// Development-only: the published package contains the generated engine, with no TS runtime dependency.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

export function syncEngines() {
  const source = readFileSync(new URL('../../../src/lib/resource-tools.ts', import.meta.url), 'utf8')
  const engineSource = source.slice(source.indexOf('type Json ='), source.indexOf('export interface QueueState'))
  if (!engineSource.includes('export function compareJson') || !engineSource.includes('export function inspectEnvKeys'))
    throw new Error('Shared resource-engine markers changed; review the standalone build.')
  const generated = '// Generated from src/lib/resource-tools.ts by sync-engines.mjs. Do not edit.\n' + ts.transpileModule(engineSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022, removeComments: false } }).outputText
  mkdirSync(new URL('../lib/', import.meta.url), { recursive: true })
  writeFileSync(new URL('../lib/engines.mjs', import.meta.url), generated)
  return generated
}
if (process.argv[1] === fileURLToPath(import.meta.url)) syncEngines()
