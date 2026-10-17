import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'

test('fictional HTTP lab serves authenticated, paginated contracts and structured errors', async () => {
  const { createLabServer } = await import('../server.mjs')
  const server = createLabServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const base = `http://127.0.0.1:${server.address().port}`
  const headers = { Authorization: 'Bearer fictional-local-token' }
  try {
    const health = await fetch(`${base}/health`)
    assert.equal(health.status, 200)
    assert.equal((await health.json()).fictional, true)
    assert.equal((await fetch(`${base}/tasks`)).status, 401)
    const page = await fetch(`${base}/tasks?page=1&limit=2`, { headers })
    assert.equal(page.status, 200)
    const body = await page.json()
    assert.equal(body.data.length, 2)
    assert.equal(body.pagination.nextPage, 2)
    assert.equal(body.pagination.total, 5)
    const page2 = await fetch(`${base}/tasks?page=2&limit=2`, { headers })
    assert.notEqual((await page2.json()).data[0].id, body.data[0].id)
    assert.equal((await fetch(`${base}/tasks?limit=9999`, { headers })).status, 400)
    assert.equal((await fetch(`${base}/tasks?page=1&page=2`, { headers })).status, 400)
    const created = await fetch(`${base}/tasks`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: '{"title":"Synthetic task"}' })
    assert.equal(created.status, 201)
    const task = (await created.json()).data
    assert.equal(task.title, 'Synthetic task')
    assert.equal((await fetch(`${base}/tasks/${task.id}`, { headers })).status, 200)
    const invalid = await fetch(`${base}/tasks`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: '{"title":""}' })
    assert.equal(invalid.status, 422)
    assert.equal((await invalid.json()).error.code, 'validation_error')
    assert.equal((await fetch(`${base}/tasks`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: '{' })).status, 400)
    assert.equal((await fetch(`${base}/tasks`, { method: 'POST', headers: { ...headers, 'Content-Type': 'text/plain' }, body: '{}' })).status, 415)
    assert.equal((await fetch(`${base}/tasks`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'a'.repeat(20000) }) })).status, 413)
    assert.equal((await fetch(`${base}/tasks/999999`, { headers })).status, 404)
    assert.equal((await fetch(`${base}/simulate-error`, { headers })).status, 503)
    assert.equal((await fetch(`${base}/tasks`, { method: 'DELETE', headers })).status, 405)
  } finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)) }
})
