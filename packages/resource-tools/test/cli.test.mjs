import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const cli = fileURLToPath(new URL('../bin/resource-tools.mjs', import.meta.url))
function fixture(run) {
  const directory = mkdtempSync(join(tmpdir(), 'resource-cli-'))
  try {
    const file = (name, body) => { const path = join(directory, name); writeFileSync(path, body); return path }
    return run(file, directory)
  } finally { rmSync(directory, { recursive: true, force: true }) }
}
const invoke = (args, input) => spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8', input })

test('JSON CLI compares semantic objects and reports differences with meaningful exits', () => fixture((file) => {
  const left = file('left.json', '{"a":1,"b":2}')
  const same = file('same.json', '{"b":2,"a":1}')
  const different = file('different.json', '{"a":3,"b":2}')
  const equal = invoke(['json', left, same, '--json'])
  assert.equal(equal.status, 0, equal.stderr)
  assert.equal(JSON.parse(equal.stdout).status, 'equal')
  const change = invoke(['json', left, different, '--json'])
  assert.equal(change.status, 1)
  assert.equal(JSON.parse(change.stdout).result.changes[0].path, '/a')
}))

test('CLI reads a single stdin stream and rejects ambiguous or unknown arguments', () => fixture((file) => {
  const reference = file('reference.json', '{"ok":true}')
  assert.equal(invoke(['json', reference, '-', '--json'], '{"ok":true}').status, 0)
  assert.equal(invoke(['json', '-', '-'], '{}').status, 2)
  assert.equal(invoke(['json', reference, reference, '--typo']).status, 2)
  assert.equal(invoke(['--help']).status, 0)
  assert.equal(invoke(['--version']).stdout.trim(), '1.0.0')
}))

test('CLI rejects oversized inputs, directories, unsafe numbers and invalid JSON without echoing input', () => fixture((file, directory) => {
  const valid = file('valid.json', '{}')
  const invalid = file('invalid.json', 'PRIVATE_INVALID_VALUE')
  const oversized = file('big.json', ' '.repeat(200001))
  const unsafe = file('unsafe.json', '{"n":9007199254740993}')
  for (const source of [invalid, oversized, unsafe, directory, join(directory, 'missing')]) {
    const result = invoke(['json', valid, source, '--json'])
    assert.equal(result.status, 2)
    assert.ok(!`${result.stdout}${result.stderr}`.includes('PRIVATE_INVALID_VALUE'))
    assert.equal(JSON.parse(result.stdout).status, 'invalid')
  }
  assert.equal(invoke(['json', valid, '-', '--json'], ' '.repeat(200001)).status, 2)
}))

test('env CLI compares keys, ignores values and never prints environment values', () => fixture((file) => {
  const reference = file('reference.env', 'API_KEY=TOP_SECRET_REFERENCE\nPORT=3000\n')
  const candidate = file('candidate.env', 'API_KEY=TOP_SECRET_CANDIDATE\nEXTRA=TOP_SECRET_EXTRA\n')
  const result = invoke(['env', reference, candidate, '--json'])
  assert.equal(result.status, 1)
  assert.deepEqual(JSON.parse(result.stdout).result.missing, ['PORT'])
  assert.deepEqual(JSON.parse(result.stdout).result.extra, ['EXTRA'])
  assert.ok(!`${result.stdout}${result.stderr}`.includes('TOP_SECRET'))
  const equal = invoke(['env', reference, '-', '--json'], 'API_KEY=different\nPORT=9999\n')
  assert.equal(equal.status, 0)
}))

test('env duplicate and malformed lines return invalid without their source text', () => fixture((file) => {
  const reference = file('reference.env', 'API_KEY=secret\n')
  const candidate = file('candidate.env', 'API_KEY=TOP_SECRET_ONE\nAPI_KEY=TOP_SECRET_TWO\nPRIVATE_MALFORMED\n')
  const result = invoke(['env', reference, candidate, '--json'])
  assert.equal(result.status, 2)
  const report = JSON.parse(result.stdout)
  assert.deepEqual(report.result.duplicates, ['API_KEY'])
  assert.deepEqual(report.result.invalidLines, [3])
  assert.ok(!result.stdout.includes('TOP_SECRET'))
  assert.ok(!result.stdout.includes('PRIVATE_MALFORMED'))
}))

test('CLI rejects named pipes without blocking while opening a file', { skip: process.platform === 'win32' }, () => fixture((file, directory) => {
  const valid = file('valid.json', '{}'), fifo = join(directory, 'pipe')
  execFileSync('mkfifo', [fifo])
  const result = spawnSync(process.execPath, [cli, 'json', valid, fifo, '--json'], { encoding: 'utf8', timeout: 1500 })
  assert.equal(result.error, undefined, 'non-regular files must be rejected without waiting for a writer')
  assert.equal(result.status, 2)
  assert.equal(JSON.parse(result.stdout).error, 'not-regular-file')
}))
