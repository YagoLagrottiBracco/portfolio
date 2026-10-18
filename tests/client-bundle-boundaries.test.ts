import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import test from "node:test"

/**
 * What reaches the browser is decided by imports: a client component that
 * imports a module that imports the portfolio data ships every case study, in
 * three languages, to every page that renders it. That happened twice already
 * (a footer link, later a citation box), so these tests walk the value imports
 * of the client modules and fail when one reaches a module that must stay on
 * the server or out of the pages that load on every visit.
 */
const src = resolve(__dirname, "../src")

/** Every file under src/, listed once; imports resolve against this set instead of checking the disk. */
function listFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) listFiles(path, out)
    else out.push(path)
  }
  return out
}

const files = new Set(listFiles(src))

function resolveImport(from: string, spec: string): string | null {
  const base = spec.startsWith("@/") ? join(src, spec.slice(2)) : spec.startsWith(".") ? resolve(dirname(from), spec) : null
  if (!base) return null
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) {
    if (files.has(candidate)) return candidate
  }
  return null
}

/** Value imports and re-exports only: `import type` is erased and costs nothing. */
function importsOf(file: string): string[] {
  const text = readFileSync(file, "utf8")
  const specs = [...text.matchAll(/^\s*(?:import|export)\s+(?!type\b)[^;'"]*?from\s+["']([^"']+)["']/gm)].map((match) => match[1])
  return specs.map((spec) => resolveImport(file, spec)).filter((path): path is string => path !== null)
}

/** The import chain from `entry` to the first of `targets` it reaches, or null. */
function chainTo(entry: string, targets: string[]): string[] | null {
  const previous = new Map<string, string | null>([[entry, null]])
  const queue = [entry]
  while (queue.length) {
    const file = queue.shift()!
    if (targets.includes(file)) {
      const chain: string[] = []
      for (let step: string | null = file; step; step = previous.get(step) ?? null) chain.unshift(relative(src, step))
      return chain
    }
    if (!/\.tsx?$/.test(file)) continue
    for (const next of importsOf(file)) {
      if (!previous.has(next)) {
        previous.set(next, file)
        queue.push(next)
      }
    }
  }
  return null
}

function clientModules(): string[] {
  return [...files].filter((file) => /\.tsx?$/.test(file) && /^\s*["']use client["']/.test(readFileSync(file, "utf8")))
}

test("no client component downloads the portfolio data, except the case-study diagram editor", () => {
  const data = [join(src, "data/personal.ts"), join(src, "data/projects-data.ts")]
  // Edits a case study's diagram, so it needs the case studies; it only loads on its own resource page.
  const allowed = new Set(["components/ecosystem/DiagramEditor.tsx"])
  const leaks = clientModules()
    .filter((file) => !allowed.has(relative(src, file)))
    .map((file) => chainTo(file, data))
    .filter((chain): chain is string[] => chain !== null)
    .map((chain) => chain.join(" → "))
  assert.deepEqual(leaks, [], "Import the small modules instead (`@/data/profile`, `@/data/featured-order`, `@/data/project-categories`) or pass the data as props from a Server Component.")
})

test("what every page loads stays free of page-specific copy", () => {
  // The providers, navigation and footer are in every page's bundle.
  const shell = ["components/providers/Providers.tsx", "components/organisms/Navigation.tsx", "components/organisms/Footer.tsx"]
  const pageOnly = [join(src, "data/discovery.ts"), join(src, "data/personal.ts"), join(src, "data/projects-data.ts")]
  const leaks = shell
    .map((entry) => chainTo(join(src, entry), pageOnly))
    .filter((chain): chain is string[] => chain !== null)
    .map((chain) => chain.join(" → "))
  assert.deepEqual(leaks, [], "Route helpers need slugs, not page texts: see `@/data/discovery-slugs`.")
})
