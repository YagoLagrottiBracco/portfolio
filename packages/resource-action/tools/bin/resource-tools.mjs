#!/usr/bin/env node
import { open } from 'node:fs/promises'
import { constants, realpathSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { compareJson, inspectEnvKeys } from '../lib/engines.mjs'

export const MAX_INPUT_BYTES = 200000
const HELP = `resource-tools 1.0.0 — local JSON and .env checks (Node.js 20+)

Usage:
  resource-tools json <left-file|-> <right-file|-> [--json]
  resource-tools env <reference-file|-> <candidate-file|-> [--json]
  resource-tools --help
  resource-tools --version

Use - once to read stdin; use -- before filenames starting with -.
Each input is limited to 200000 UTF-8 bytes. Only regular files are accepted.
Exit codes: 0 equal/valid; 1 differences; 2 invalid input or usage.
.env reports contain key names and line numbers, never environment values.
JSON difference reports may contain JSON values. No network or telemetry.
`
class InputError extends Error {}

async function readInput(path, stdin) {
  if (path === '-') {
    const chunks = []
    let size = 0
    for await (const chunk of stdin) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      size += buffer.length
      if (size > MAX_INPUT_BYTES) {
        stdin.destroy()
        throw new InputError('too-large')
      }
      chunks.push(buffer)
    }
    return decode(Buffer.concat(chunks))
  }
  let handle
  try {
    // O_NONBLOCK avoids waiting forever on a FIFO before fstat can reject it.
    handle = await open(path, constants.O_RDONLY | (constants.O_NONBLOCK || 0))
    const stat = await handle.stat()
    if (!stat.isFile()) throw new InputError('not-regular-file')
    if (stat.size > MAX_INPUT_BYTES) throw new InputError('too-large')
    // Recheck the actual bytes read: the file can grow after stat().
    const data = Buffer.alloc(MAX_INPUT_BYTES + 1)
    let size = 0
    while (size < data.length) {
      const { bytesRead } = await handle.read(data, size, data.length - size, null)
      if (!bytesRead) break
      size += bytesRead
    }
    if (size > MAX_INPUT_BYTES) throw new InputError('too-large')
    return decode(data.subarray(0, size))
  } catch (error) {
    if (error instanceof InputError) throw error
    throw new InputError('unreadable-file')
  } finally { await handle?.close() }
}
function decode(buffer) {
  try { return new TextDecoder('utf-8', { fatal: true }).decode(buffer) }
  catch { throw new InputError('invalid-utf8') }
}
function parseArguments(args) {
  const positional = []
  let json = false, terminated = false
  for (const arg of args) {
    if (arg === '--' && !terminated) { terminated = true; continue }
    if (arg === '--json' && !terminated) { json = true; continue }
    if (arg.startsWith('-') && arg !== '-' && !terminated) throw new InputError('invalid-usage')
    positional.push(arg)
  }
  if (positional.length !== 3 || !['json', 'env'].includes(positional[0]) || positional.slice(1).filter((item) => item === '-').length > 1)
    throw new InputError('invalid-usage')
  return { tool: positional[0], left: positional[1], right: positional[2], json }
}

/** No logging, file writes, network requests, or environment-value reporting. */
export async function evaluate(tool, reference, candidate, { stdin = process.stdin } = {}) {
  if (!['json', 'env'].includes(tool) || typeof reference !== 'string' || !reference || typeof candidate !== 'string' || !candidate || [reference, candidate].includes('-') && reference === candidate)
    return { tool: 'unknown', status: 'invalid', exitCode: 2, error: 'invalid-usage' }
  try {
    const left = await readInput(reference, stdin)
    const right = await readInput(candidate, stdin)
    const result = tool === 'json' ? compareJson(left, right) : inspectEnvKeys(left, right)
    const invalid = result.error || (tool === 'env' && (result.duplicates.length || result.referenceDuplicates.length || result.invalidLines.length || result.referenceInvalidLines.length))
    const different = tool === 'json' ? result.changes.length || result.truncated : result.missing.length || result.extra.length
    const exitCode = invalid ? 2 : different ? 1 : 0
    return { tool, status: invalid ? 'invalid' : different ? 'different' : 'equal', exitCode, result }
  } catch (error) {
    return { tool, status: 'invalid', exitCode: 2, error: error instanceof InputError ? error.message : 'input-error' }
  }
}
function humanReport(report) {
  const lines = [`${report.tool}: ${report.status} (exit ${report.exitCode})`]
  if (report.error) lines.push(`Error: ${report.error}`)
  if (report.tool === 'env' && report.result) {
    for (const key of ['missing', 'extra', 'duplicates', 'referenceDuplicates', 'invalidLines', 'referenceInvalidLines'])
      lines.push(`${key}: ${report.result[key].join(', ') || 'none'}`)
    if (report.result.error) lines.push(`Error: ${report.result.error}`)
  } else if (report.result) lines.push(JSON.stringify(report.result, null, 2))
  return lines.join('\n') + '\n'
}
export async function main(args = process.argv.slice(2)) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) { process.stdout.write(HELP); return 0 }
  if (args.length === 1 && args[0] === '--version') { process.stdout.write('1.0.0\n'); return 0 }
  let options
  try { options = parseArguments(args) }
  catch {
    const report = { tool: 'unknown', status: 'invalid', exitCode: 2, error: 'invalid-usage' }
    process.stdout.write(args.includes('--json') ? JSON.stringify(report) + '\n' : humanReport(report) + HELP)
    return 2
  }
  const report = await evaluate(options.tool, options.left, options.right)
  process.stdout.write(options.json ? JSON.stringify(report) + '\n' : humanReport(report))
  return report.exitCode
}
if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href)
  process.exitCode = await main()
