import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const run = fileURLToPath(new URL('../run.mjs', import.meta.url))
test('standalone Action fails on missing keys and writes counts without secrets or injected Markdown', () => {
  const directory = mkdtempSync(join(tmpdir(), 'resource-action-'))
  try {
    const reference = join(directory, 'reference.env'), candidate = join(directory, 'candidate.env')
    const summary = join(directory, 'summary.md'), output = join(directory, 'output')
    writeFileSync(reference, 'TOKEN=SECRET_REFERENCE\nPORT=3000\n')
    writeFileSync(candidate, 'TOKEN=SECRET_CANDIDATE\nOTHER=SECRET_OTHER\n')
    const result = spawnSync(process.execPath, [run], { encoding: 'utf8', env: { ...process.env, RESOURCE_TOOL: 'env', RESOURCE_REFERENCE: reference, RESOURCE_CANDIDATE: candidate, GITHUB_STEP_SUMMARY: summary, GITHUB_OUTPUT: output } })
    assert.equal(result.status, 1)
    const report = readFileSync(summary, 'utf8')
    assert.match(report, /Missing keys: 1/)
    assert.ok(!`${report}${result.stdout}${result.stderr}`.includes('SECRET'))
    assert.ok(!report.includes(directory))
    assert.match(readFileSync(output, 'utf8'), /status=different/)
  } finally { rmSync(directory, { recursive: true, force: true }) }
})

test('Action does not interpolate untrusted arguments into shell commands or summaries', () => {
  const directory = mkdtempSync(join(tmpdir(), 'resource-action-'))
  try {
    const summary = join(directory, 'summary.md')
    const result = spawnSync(process.execPath, [run], { encoding: 'utf8', env: { ...process.env, RESOURCE_TOOL: '$(touch unsafe)', RESOURCE_REFERENCE: '![bad](https://evil.test)', RESOURCE_CANDIDATE: '-', GITHUB_STEP_SUMMARY: summary } })
    assert.equal(result.status, 2)
    assert.ok(!readFileSync(summary, 'utf8').includes('evil.test'))
  } finally { rmSync(directory, { recursive: true, force: true }) }
})

test('Action JSON differences reveal counts without JSON values in logs or summary', () => {
  const directory = mkdtempSync(join(tmpdir(), 'resource-action-'))
  try {
    const reference = join(directory, 'reference.json'), candidate = join(directory, 'candidate.json'), summary = join(directory, 'summary.md')
    writeFileSync(reference, '{"password":"PRIVATE_JSON_ONE"}')
    writeFileSync(candidate, '{"password":"PRIVATE_JSON_TWO"}')
    const result = spawnSync(process.execPath, [run], { encoding: 'utf8', env: { ...process.env, RESOURCE_TOOL: 'json', RESOURCE_REFERENCE: reference, RESOURCE_CANDIDATE: candidate, GITHUB_STEP_SUMMARY: summary } })
    assert.equal(result.status, 1)
    const report = readFileSync(summary, 'utf8')
    assert.match(report, /JSON differences: 1/)
    assert.ok(!`${report}${result.stdout}${result.stderr}`.includes('PRIVATE_JSON'))
    assert.ok(!report.includes('password'))
  } finally { rmSync(directory, { recursive: true, force: true }) }
})
