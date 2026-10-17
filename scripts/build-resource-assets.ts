/** Rebuild editorial assets without rerunning benchmark or recording videos. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { join } from "node:path"
import sharp from "sharp"
import { personalData } from "../src/data/personal"
import { getCaseStudyProjects } from "../src/lib/projects"
import { getResourceEntry } from "../src/lib/resource-catalog"
import { getCaseStudyPath } from "../src/lib/case-study-routes"
import { getResourcePath } from "../src/lib/resource-routes"
import { locales, type Locale } from "../src/lib/i18n"
import { videoSteps } from "../src/data/resources/video-transcripts"

const root = join(process.cwd(), "public/recursos")
const tr = (l: Locale, pt: string, en: string, es: string) =>
  ({ pt, en, es })[l]
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
function wrap(s: string, chars: number): string[] {
  const lines: string[] = []
  let line = ""
  for (const word of s.split(/\s+/)) {
    if ((line + " " + word).trim().length > chars && line) {
      lines.push(line)
      line = word
    } else line = (line + " " + word).trim()
  }
  if (line) lines.push(line)
  return lines
}
function lines(
  text: string[],
  x: number,
  y: number,
  size: number,
  color = "#d4d4d8",
  step = size * 1.38
) {
  return text
    .map(
      (line, i) =>
        `<text x="${x}" y="${y + i * step}" font-size="${size}" fill="${color}">${esc(line)}</text>`
    )
    .join("")
}
const svg = (width: number, height: number, content: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><rect width="100%" height="100%" fill="#101114"/><g font-family="DejaVu Sans,Arial,sans-serif">${content}</g></svg>`
function save(path: string, data: string | Buffer) {
  const target = join(root, path)
  mkdirSync(join(target, ".."), { recursive: true })
  writeFileSync(target, data)
}
// Minimal, standards-compliant STORE ZIP; each file's CRC is checked during extraction.
function crc32(data: Buffer) {
  let crc = 0xffffffff
  for (const byte of data) {
    crc ^= byte
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1))
  }
  return (crc ^ 0xffffffff) >>> 0
}
function zip(files: Record<string, string | Buffer>): Buffer {
  const chunks: Buffer[] = [],
    directory: Buffer[] = []
  let offset = 0
  for (const [name, source] of Object.entries(files)) {
    const data = Buffer.isBuffer(source) ? source : Buffer.from(source),
      filename = Buffer.from(name),
      crc = crc32(data)
    const h = Buffer.alloc(30)
    h.writeUInt32LE(0x04034b50)
    h.writeUInt16LE(20, 4)
    h.writeUInt16LE(0x800, 6)
    h.writeUInt16LE(0x21, 12)
    h.writeUInt32LE(crc, 14)
    h.writeUInt32LE(data.length, 18)
    h.writeUInt32LE(data.length, 22)
    h.writeUInt16LE(filename.length, 26)
    const d = Buffer.alloc(46)
    d.writeUInt32LE(0x02014b50)
    d.writeUInt16LE(20, 4)
    d.writeUInt16LE(20, 6)
    d.writeUInt16LE(0x800, 8)
    d.writeUInt16LE(0x21, 14)
    d.writeUInt32LE(crc, 16)
    d.writeUInt32LE(data.length, 20)
    d.writeUInt32LE(data.length, 24)
    d.writeUInt16LE(filename.length, 28)
    d.writeUInt32LE(offset, 42)
    chunks.push(h, filename, data)
    directory.push(d, filename)
    offset += h.length + filename.length + data.length
  }
  const central = Buffer.concat(directory),
    end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50)
  end.writeUInt16LE(Object.keys(files).length, 8)
  end.writeUInt16LE(Object.keys(files).length, 10)
  end.writeUInt32LE(central.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...chunks, central, end])
}
const credit =
  "Original text and diagrams: CC BY 4.0 https://creativecommons.org/licenses/by/4.0/\nCredit: Yago Lagrotti Bracco — https://lagrotti.dev\nThird-party brands, client interfaces and screenshots are excluded.\n"
const mit = `MIT License

Copyright (c) 2026 Yago Lagrotti Bracco

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`

async function build() {
  save("downloads/tools-LICENSE.txt", mit)
  const card = svg(
    1200,
    630,
    `<rect x="60" y="60" width="80" height="6" rx="3" fill="#93c5fd"/>${lines(["LAGROTTI.DEV / OPEN RESOURCES"], 60, 125, 22, "#93c5fd")}${lines(["Build. Explore.", "Share what works."], 60, 255, 76, "#fafafa", 92)}${lines(["Tools · Demos · Architecture · Code"], 60, 485, 30)}${lines([personalData.name], 60, 565, 23, "#a1a1aa")}`
  )
  const cover = await sharp(Buffer.from(card)).png().toBuffer()
  save("engineering-kit.png", cover)
  for (const l of locales) {
    for (const p of getCaseStudyProjects()) {
      const canonical = `https://lagrotti.dev${getCaseStudyPath(l, p.slug)}`
      if (p.caseStudy.diagram?.length) {
        const stages = p.caseStudy.diagram
        const rowHeights: number[] = []
        for (let r = 0; r < Math.ceil(stages.length / 2); r++)
          rowHeights.push(
            Math.max(
              ...stages
                .slice(r * 2, r * 2 + 2)
                .map(
                  (stage) =>
                    100 +
                    wrap((stage.items ?? []).map((i) => i[l]).join(" · "), 45)
                      .length *
                      30
                )
            )
          )
        let y = 210
        const boxes = stages
          .map((stage, i) => {
            const x = i % 2 === 0 ? 55 : 745,
              r = Math.floor(i / 2)
            if (i > 0 && i % 2 === 0) y += rowHeights[r - 1] + 35
            const title = wrap(`${i + 1}. ${stage.title[l]}`, 36)
            const body = wrap(
              (stage.items ?? []).map((item) => item[l]).join(" · "),
              45
            )
            return `<rect x="${x}" y="${y}" width="640" height="${rowHeights[r]}" rx="18" fill="#191d25" stroke="${stage.emphasis ? "#93c5fd" : "#3f3f46"}"/>${lines(title, x + 25, y + 43, 26, "#93c5fd", 33)}${lines(body, x + 25, y + 82, 22, "#d4d4d8", 30)}`
          })
          .join("")
        const height =
          300 +
          rowHeights.reduce((a, b) => a + b, 0) +
          (rowHeights.length - 1) * 35
        const diagram = svg(
          1440,
          height,
          `${lines([p.title[l]], 55, 90, 44, "#fafafa")}${lines([tr(l, "Fluxo de arquitetura · leia na ordem numerada", "Architecture flow · follow the numbered order", "Flujo de arquitectura · sigue el orden numerado")], 55, 145, 24)}${boxes}${lines([`lagrotti.dev · Yago Lagrotti Bracco · CC BY 4.0`], 55, height - 35, 20, "#a1a1aa")}`
        )
        save(`diagramas/${l}/${p.slug}.svg`, diagram)
        save(
          `diagramas/${l}/${p.slug}.png`,
          await sharp(Buffer.from(diagram)).png().toBuffer()
        )
      }
      const labels = [
        tr(l, "O problema", "The problem", "El problema"),
        tr(l, "As restrições", "The constraints", "Las restricciones"),
        tr(l, "A decisão", "The decision", "La decisión"),
        tr(l, "A solução", "The solution", "La solución"),
        tr(l, "O aprendizado", "The lesson", "El aprendizaje"),
      ]
      const bodies = [
        p.caseStudy.context[l],
        p.caseStudy.challenge[l],
        p.caseStudy.highlights[0].description[l],
        p.caseStudy.solution[l],
        p.caseStudy.highlights[Math.min(1, p.caseStudy.highlights.length - 1)]
          .description[l],
      ]
      const slides: Record<string, Buffer | string> = {}
      const alt: string[] = []
      for (let i = 0; i < 5; i++) {
        let font = 42
        while (
          wrap(bodies[i], Math.floor(880 / (font * 0.55))).length * font * 1.4 >
            780 &&
          font > 26
        )
          font -= 2
        const body = wrap(bodies[i], Math.floor(880 / (font * 0.55)))
        const image = svg(
          1080,
          1350,
          `<rect x="70" y="70" width="70" height="7" rx="3" fill="#93c5fd"/>${lines([`${i + 1} / 5   ${labels[i].toUpperCase()}`], 70, 140, 24, "#93c5fd")}${lines(wrap(p.title[l], 29), 70, 240, 56, "#fafafa", 68)}${lines(body, 70, 450, font, "#d4d4d8", font * 1.4)}${lines(["Yago Lagrotti Bracco", "lagrotti.dev"], 70, 1250, 23, "#93c5fd", 34)}`
        )
        const png = await sharp(Buffer.from(image)).png().toBuffer()
        save(`carrosseis/${l}/${p.slug}-${i + 1}.png`, png)
        slides[`slide-${i + 1}.png`] = png
        alt.push(`${i + 1}. ${labels[i]} — ${p.title[l]}\n${bodies[i]}\n`)
      }
      slides["alt-text.txt"] = alt.join("\n")
      slides["credits.txt"] = `${credit}\n${canonical}\n`
      save(`carrosseis/${l}/${p.slug}.zip`, zip(slides))
      const curator = `${p.title[l]}\n\n${p.description[l]}\n\n${canonical}\n\n${personalData.name}\n${credit}\nScreenshot permission: use this image to illustrate a recommendation of this linked case study with credit. Client marks and interfaces retain their respective rights.\n`
      save(
        `curadoria/${l}/${p.slug}.zip`,
        zip({
          "summary.txt": curator,
          "project.png": readFileSync(join(process.cwd(), "public", p.image)),
          "credits.txt": credit,
        })
      )
    }
    const press = getResourceEntry("imprensa", "yago")!
    save(
      `downloads/${l}/press-kit.zip`,
      zip({
        "bio.txt": `${press.title[l]}\n\n${press.description[l]}\n\n${press.blocks![0].body[l]}\n\n${personalData.socialLinks.linkedin}\n${personalData.socialLinks.github}\nContact: ${personalData.socialLinks.email}\n`,
        "ylb-icon.svg": readFileSync(
          join(process.cwd(), "public/ylb-icon.svg")
        ),
        "presentation.png": cover,
        "author-photo.jpg": readFileSync(join(process.cwd(), "public/recursos/imprensa/yago-github.jpg")),
        "photo-source.txt": "Public author profile photo, reused unchanged at original 422x422 resolution. Source: https://avatars.githubusercontent.com/u/38819229?v=4\nProfile: https://github.com/YagoLagrottiBracco\nThe photo is excluded from the CC BY diagram/text license.\n",
        "usage.txt": `${credit}\nUse biography and monogram when referring to Yago Lagrotti Bracco. The public profile photo is included unchanged; its source is recorded in photo-source.txt. Contact the author for higher-resolution photography or an interview.\n`,
      })
    )
    for (const [section, slug] of [
      ["palestras", "eventos"],
      ["palestras", "arquitetura"],
      ["colaboracoes", "reproduzir-benchmark"],
      ["campanhas", "kit-engenharia"],
    ]) {
      const item = getResourceEntry(section, slug)!
      if (section === "campanhas") {
        save(
          `downloads/${l}/${item.download}`,
          locales
            .map((lang) => {
              const launch = getResourceEntry(section, slug)!
              return `# ${launch.title[lang]}\n\n${launch.description[lang]}\n\n${launch.blocks?.map((b) => `${b.title[lang]}\n${b.body[lang]}`).join("\n\n")}\n\nhttps://lagrotti.dev${getResourcePath(lang, section, slug)}`
            })
            .join("\n\n---\n\n") + `\n\n${credit}`
        )
        continue
      }
      save(
        `downloads/${l}/${item.download}`,
        `# ${item.title[l]}\n\n${item.description[l]}\n\n${item.blocks?.map((b) => `## ${b.title[l]}\n\n${b.body[l]}`).join("\n\n")}\n\nhttps://lagrotti.dev${getResourcePath(l, section, slug)}\n\n${personalData.name} — ${personalData.socialLinks.email}\n\n${credit}`
      )
    }
    const headings =
      l === "pt"
        ? [
            "Título da decisão",
            "Estado: proposta",
            "Contexto e restrições",
            "Alternativas consideradas",
            "Decisão e justificativa",
            "Consequências e custos",
            "Evidência e experimento",
            "Condição para revisar",
            "Responsável e data",
          ]
        : l === "en"
          ? [
              "Decision title",
              "Status: proposed",
              "Context and constraints",
              "Alternatives considered",
              "Decision and rationale",
              "Consequences and costs",
              "Evidence and experiment",
              "Review condition",
              "Owner and date",
            ]
          : [
              "Título de la decisión",
              "Estado: propuesta",
              "Contexto y restricciones",
              "Alternativas consideradas",
              "Decisión y justificación",
              "Consecuencias y costes",
              "Evidencia y experimento",
              "Condición de revisión",
              "Responsable y fecha",
            ]
    save(
      `downloads/${l}/adr.md`,
      `# ${headings[0]}\n\n${headings[1]}\n\n${headings
        .slice(2)
        .map(
          (h) =>
            `## ${h}\n\n[${tr(l, "Preencha com fatos, links e critérios verificáveis.", "Fill with facts, links and verifiable criteria.", "Completa con hechos, enlaces y criterios verificables.")}]`
        )
        .join("\n\n")}\n\n${credit}`
    )
    for (const kind of ["queue", "json"] as const) {
      const stamp = (s: number) => `00:${String(s).padStart(2, "0")}.000`
      save(
        `videos/${l}/${kind}.vtt`,
        `WEBVTT\n\n${videoSteps[kind].map((step, i) => `${i + 1}\n${stamp(i * 6)} --> ${stamp((i + 1) * 6)}\n${step[l]}\n`).join("\n")}`
      )
    }
  }
  save("downloads/worker-starter.zip", zip(workerFiles(mit)))
  console.log(
    "Generated localized diagrams, 150 carousel slides, 30 curator packs, press/session kits, captions and worker starter."
  )
}

function workerFiles(license: string): Record<string, string> {
  return {
    "package.json": JSON.stringify(
      {
        name: "bounded-worker-starter",
        version: "1.0.0",
        private: true,
        type: "module",
        engines: { node: ">=22" },
        scripts: {
          start: "tsx src/demo.ts",
          test: "tsx --test tests/worker.test.ts",
          typecheck: "tsc --noEmit",
        },
        devDependencies: { "@types/node": "^22", tsx: "^4", typescript: "^5" },
      },
      null,
      2
    ),
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "NodeNext",
          moduleResolution: "NodeNext",
          strict: true,
          noEmit: true,
          allowImportingTsExtensions: true,
          types: ["node"],
        },
        include: ["src/**/*.ts", "tests/**/*.ts"],
      },
      null,
      2
    ),
    LICENSE: license,
    "src/worker.ts": `export interface Message<T> { id: string; payload: T }
export async function runWorker<T>(messages: Message<T>[], handle: (message: Message<T>) => Promise<void>, maxAttempts = 3) {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 100) throw new Error('maxAttempts must be 1..100')
  const completed = new Set<string>()
  const dead: { message: Message<T>; attempts: number }[] = []
  for (const message of messages) {
    if (completed.has(message.id) || dead.some(entry => entry.message.id === message.id)) continue
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try { await handle(message); completed.add(message.id); break }
      catch { if (attempt === maxAttempts) dead.push({ message, attempts: attempt }) }
    }
  }
  return { completed: [...completed], dead }
}
`,
    "src/demo.ts": `import { runWorker } from './worker.ts'
const attempts = new Map<string, number>()
const result = await runWorker([{ id: 'one', payload: 100 }, { id: 'one', payload: 100 }, { id: 'bad', payload: 0 }], async message => {
  const count = (attempts.get(message.id) ?? 0) + 1; attempts.set(message.id, count)
  if (message.id === 'bad' || count === 1) throw new Error('synthetic failure')
  console.log('Completed', message.id)
})
console.log(JSON.stringify(result, null, 2))
`,
    "tests/worker.test.ts": `import test from 'node:test'
import assert from 'node:assert/strict'
import { runWorker } from '../src/worker.ts'
test('retries transient failures and deduplicates completed IDs', async () => {
 let attempts = 0
 const r = await runWorker([{id:'a', payload:1}, {id:'a', payload:1}], async () => { if (++attempts < 2) throw new Error('retry') })
 assert.equal(attempts, 2); assert.deepEqual(r.completed, ['a']); assert.equal(r.dead.length, 0)
})
test('permanent failures stop at three attempts and enter dead letters', async () => {
 let attempts = 0
 const r = await runWorker([{id:'a', payload:1}], async () => { attempts++; throw new Error('bad') })
 assert.equal(attempts, 3); assert.equal(r.dead[0].attempts, 3); assert.equal(r.completed.length, 0)
})
test('rejects invalid retry bounds', async () => {
 await assert.rejects(() => runWorker([], async () => {}, 0), /maxAttempts/)
})
`,
    "README.md": `# Bounded worker starter\n\nNode.js 22+. Run: npm install, npm test, npm run typecheck, npm start.\n\nA small sequential TypeScript worker. Duplicate completed IDs within one run are skipped. A handler can fail up to three attempts; exhausted messages enter the returned dead-letter list.\n\nFiles: src/worker.ts (logic), src/demo.ts (synthetic example), tests/worker.test.ts (behavior), .github/workflows/ci.yml (CI).\n\nThis educational starter has no durable broker, backoff, transactions, concurrency control or cross-process deduplication. Handlers must be idempotent: a failure after a side effect can repeat that effect. Persist IDs transactionally with the business operation before using this pattern in production. Avoid logging secrets and add shutdown/replay policy for your environment.\n\nMIT. Yago Lagrotti Bracco — https://lagrotti.dev/recursos/templates/worker\n`,
    "README.pt.md": `# Worker com tentativas limitadas\n\nNode.js 22+. Execute npm install, npm test, npm run typecheck e npm start.\n\nWorker sequencial em TypeScript com retries e deduplicação local à execução. Falhas esgotadas retornam na lista dead. O exemplo usa apenas dados fictícios. Consulte README.md para o mapa dos arquivos.\n\nÉ um exemplo didático sem broker durável, backoff, transações, controle de concorrência ou deduplicação entre processos. O handler precisa ser idempotente: uma falha depois de um efeito pode repeti-lo. Antes de produção, persista IDs na mesma transação da operação de negócio e defina desligamento e reprocessamento.\n\nMIT. https://lagrotti.dev/recursos/templates/worker\n`,
    "README.es.md": `# Worker con intentos limitados\n\nNode.js 22+. Ejecuta npm install, npm test, npm run typecheck y npm start.\n\nWorker secuencial TypeScript con reintentos y deduplicación local a una ejecución. Los fallos agotados van a dead. El ejemplo usa datos ficticios. README.md explica cada archivo.\n\nEjemplo didáctico sin broker duradero, backoff, transacciones, control de concurrencia ni deduplicación entre procesos. El handler debe ser idempotente: un fallo tras un efecto puede repetirlo. Antes de producción, guarda IDs en la misma transacción de negocio y define cierre y reprocesamiento.\n\nMIT. https://lagrotti.dev/es/recursos/templates/worker\n`,
    ".gitignore": "node_modules/\n.env\n",
    ".github/workflows/ci.yml":
      "name: Check\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v7\n      - uses: actions/setup-node@v7\n        with:\n          node-version: 22\n      - run: npm install\n      - run: npm test\n      - run: npm run typecheck\n",
  }
}
build().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
