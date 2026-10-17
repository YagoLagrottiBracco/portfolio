/** Build standalone distributions. Existing 1.0.0 bytes are verified, never overwritten. */
import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import { chmodSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { syncEngines } from "../packages/resource-tools/scripts/sync-engines.mjs"

export interface ReleaseArtifact {
  id: string
  filename: string
  format: "tgz" | "zip"
  bytes: number
  sha256: string
  url: string
  source: string
  compatibility: string
  license: "MIT"
}
export interface EcosystemReleaseManifest {
  schemaVersion: 1
  version: "1.0.0"
  releasedAt: string
  registry: { packageName: string; status: "not-published"; install: string }
  artifacts: ReleaseArtifact[]
}
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const baseUrl = "https://lagrotti.dev/recursos/releases/1.0.0"
const sourceBase = "https://github.com/YagoLagrottiBracco/portfolio/tree/master"
const sha256 = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex")

// Deterministic STORE ZIP: sorted safe paths, fixed DOS date, UTF-8 names and CRC32.
function crc32(data: Buffer) {
  let crc = 0xffffffff
  for (const byte of data) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
  }
  return (crc ^ 0xffffffff) >>> 0
}
function zip(files: Record<string, Buffer>) {
  const chunks: Buffer[] = [], directory: Buffer[] = []
  let offset = 0
  const names = Object.keys(files).sort()
  for (const name of names) {
    if (!/^[a-zA-Z0-9_./-]+$/.test(name) || name.startsWith("/") || name.split("/").includes(".."))
      throw new Error("Unsafe archive path")
    const data = files[name], filename = Buffer.from(name), crc = crc32(data)
    const header = Buffer.alloc(30), entry = Buffer.alloc(46)
    header.writeUInt32LE(0x04034b50)
    header.writeUInt16LE(20, 4)
    header.writeUInt16LE(0x800, 6)
    header.writeUInt16LE(0x21, 12)
    header.writeUInt32LE(crc, 14)
    header.writeUInt32LE(data.length, 18)
    header.writeUInt32LE(data.length, 22)
    header.writeUInt16LE(filename.length, 26)
    entry.writeUInt32LE(0x02014b50)
    entry.writeUInt16LE(20, 4)
    entry.writeUInt16LE(20, 6)
    entry.writeUInt16LE(0x800, 8)
    entry.writeUInt16LE(0x21, 14)
    entry.writeUInt32LE(crc, 16)
    entry.writeUInt32LE(data.length, 20)
    entry.writeUInt32LE(data.length, 24)
    entry.writeUInt16LE(filename.length, 28)
    entry.writeUInt32LE(offset, 42)
    chunks.push(header, filename, data)
    directory.push(entry, filename)
    offset += header.length + filename.length + data.length
  }
  const central = Buffer.concat(directory), end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50)
  end.writeUInt16LE(names.length, 8)
  end.writeUInt16LE(names.length, 10)
  end.writeUInt32LE(central.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...chunks, central, end])
}
function sourceFiles(folder: string, prefix: string, root = repositoryRoot): Record<string, Buffer> {
  const base = join(root, folder), files: Record<string, Buffer> = {}
  function visit(path: string) {
    for (const name of readdirSync(path).sort()) {
      if (["node_modules", ".git", ".DS_Store"].includes(name) || name.endsWith(".tgz")) continue
      const full = join(path, name), stat = lstatSync(full)
      if (stat.isSymbolicLink()) throw new Error("Symlinks are not allowed in release archives")
      if (stat.isDirectory()) visit(full)
      else if (stat.isFile()) files[`${prefix}/${relative(base, full).split(sep).join("/")}`] = readFileSync(full)
    }
  }
  visit(base)
  return files
}
function writeGenerated(path: string, bytes: string | Buffer) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, bytes)
}

/** Normalize modes in a private staging copy; preserve the frozen 1.0.0 tar headers. */
export function packStandaloneCli(sourceDirectory = join(repositoryRoot, "packages/resource-tools")): Buffer {
  const staging = mkdtempSync(join(tmpdir(), "resource-cli-pack-"))
  try {
    for (const [name, bytes] of Object.entries(sourceFiles(".", "package", sourceDirectory))) {
      const path = join(staging, name)
      writeGenerated(path, bytes)
      chmodSync(path, 0o755)
    }
    const packed = JSON.parse(execFileSync("npm", ["pack", "--ignore-scripts", "--json", "--pack-destination", staging], { cwd: join(staging, "package"), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })) as { filename: string }[]
    if (packed.length !== 1 || !/^[a-zA-Z0-9_.-]+\.tgz$/.test(packed[0].filename)) throw new Error("Unexpected npm pack output")
    return readFileSync(join(staging, packed[0].filename))
  } finally { rmSync(staging, { recursive: true, force: true }) }
}

export async function buildEcosystemPackages({ outputDirectory = join(repositoryRoot, "public/recursos/releases/1.0.0") }: { outputDirectory?: string } = {}): Promise<EcosystemReleaseManifest> {
  const engine = syncEngines()
  writeGenerated(join(repositoryRoot, "packages/resource-action/tools/lib/engines.mjs"), engine)
  writeGenerated(join(repositoryRoot, "packages/resource-action/tools/bin/resource-tools.mjs"), readFileSync(join(repositoryRoot, "packages/resource-tools/bin/resource-tools.mjs")))
  const staging = mkdtempSync(join(tmpdir(), "resource-pack-"))
  const files = new Map<string, Buffer>()
  try {
    files.set("resource-tools-1.0.0.tgz", packStandaloneCli())
    files.set("resource-tools-source-1.0.0.zip", zip(sourceFiles("packages/resource-tools", "resource-tools")))
    files.set("resource-action-1.0.0.zip", zip(sourceFiles("packages/resource-action", "resource-action")))
    files.set("worker-starter-1.0.0.zip", zip(sourceFiles("examples/worker-starter", "worker-starter")))
    files.set("http-lab-1.0.0.zip", zip(sourceFiles("examples/http-lab", "http-lab")))
    const descriptions = [
      ["terminal", "resource-tools-1.0.0.tgz", "packages/resource-tools", "Node.js >=20; Linux, macOS, Windows"],
      ["terminal-source", "resource-tools-source-1.0.0.zip", "packages/resource-tools", "Node.js >=20; generated JS included"],
      ["github-action", "resource-action-1.0.0.zip", "packages/resource-action", "GitHub Actions; Bash and Node.js >=20"],
      ["executar", "worker-starter-1.0.0.zip", "examples/worker-starter", "Node.js >=20; StackBlitz WebContainers"],
      ["api-bruno", "http-lab-1.0.0.zip", "examples/http-lab", "Node.js >=20; Bruno CLI 4.2.1 or Bruno app"],
    ]
    const manifest: EcosystemReleaseManifest = {
      schemaVersion: 1,
      version: "1.0.0",
      releasedAt: "2026-10-17",
      registry: { packageName: "@yagolagrottibracco/resource-tools", status: "not-published", install: `npm install --global ${baseUrl}/resource-tools-1.0.0.tgz` },
      artifacts: descriptions.map(([id, filename, source, compatibility]) => ({ id, filename, format: filename.endsWith(".tgz") ? "tgz" : "zip", bytes: files.get(filename)!.length, sha256: sha256(files.get(filename)!), url: `${baseUrl}/${filename}`, source: `${sourceBase}/${source}`, compatibility, license: "MIT" })),
    }
    files.set("manifest.json", Buffer.from(JSON.stringify(manifest, null, 2) + "\n"))
    files.set("SHA256SUMS", Buffer.from([...files].map(([name, bytes]) => `${sha256(bytes)}  ${name}`).join("\n") + "\n"))
    // Preflight every file before writing any file, so conflicts cannot partially update a release.
    for (const [name, bytes] of files) {
      const target = join(outputDirectory, name)
      if (existsSync(target) && !readFileSync(target).equals(bytes)) throw new Error(`Immutable release conflict: ${name}. Keep 1.0.0 and publish a new version.`)
    }
    mkdirSync(outputDirectory, { recursive: true })
    for (const [name, bytes] of files) {
      const target = join(outputDirectory, name)
      if (existsSync(target)) continue
      try { writeFileSync(target, bytes, { flag: "wx" }) }
      catch (error) {
        if (!existsSync(target) || !readFileSync(target).equals(bytes)) throw error
      }
    }
    return manifest
  } finally { rmSync(staging, { recursive: true, force: true }) }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  if (args.length && (args.length !== 2 || args[0] !== "--out-dir")) throw new Error("Usage: tsx scripts/build-ecosystem-packages.ts [--out-dir DIRECTORY]")
  buildEcosystemPackages(args.length ? { outputDirectory: resolve(args[1]) } : {}).then((manifest) => {
    for (const artifact of manifest.artifacts) console.log(`${artifact.filename}: ${artifact.bytes} bytes · SHA-256 ${artifact.sha256}`)
  }).catch((error: Error) => { console.error(error.message); process.exitCode = 1 })
}
