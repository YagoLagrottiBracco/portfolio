import { appendFile } from 'node:fs/promises'
import { evaluate } from './tools/bin/resource-tools.mjs'

// Values stay in process memory. No shell interpolation, error snippets or file paths reach logs.
const report = await evaluate(process.env.RESOURCE_TOOL, process.env.RESOURCE_REFERENCE, process.env.RESOURCE_CANDIDATE)
const lines = ['## Resource contract checks', '', `Status: ${report.status}`, `Exit code: ${report.exitCode}`]
if (report.tool === 'env' && report.result) {
  lines.push(`Missing keys: ${report.result.missing.length}`, `Extra keys: ${report.result.extra.length}`, `Duplicate keys: ${report.result.duplicates.length + report.result.referenceDuplicates.length}`, `Invalid lines: ${report.result.invalidLines.length + report.result.referenceInvalidLines.length}`)
} else if (report.tool === 'json' && report.result) {
  lines.push(`JSON differences: ${report.result.changes.length}`, `Truncated: ${report.result.truncated ? 'yes' : 'no'}`)
}
lines.push('', 'Only status and counts are published. File contents, key names and values are omitted.', '')
try {
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join('\n'))
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `status=${report.status}\nexit-code=${report.exitCode}\n`)
  process.stdout.write(`Resource contract checks: ${report.status} (exit ${report.exitCode}).\n`)
  process.exitCode = report.exitCode
} catch {
  process.stderr.write('Unable to write GitHub output files.\n')
  process.exitCode = 2
}
