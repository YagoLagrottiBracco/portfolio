import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'

const MAX_BODY = 16384
const TOKEN = 'fictional-local-token' // Public teaching token, never a real credential.
const seeds = ['Inspect a contract', 'Retry a synthetic job', 'Read the next page', 'Validate a request', 'Handle an error']

export function createLabServer() {
  const tasks = seeds.map((title, index) => ({ id: index + 1, title, completed: false }))
  const respond = (response, status, body, headers = {}) => {
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers })
    response.end(JSON.stringify(body))
  }
  const error = (response, status, code, message, headers) => respond(response, status, { error: { code, message }, fictional: true }, headers)
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost')
      if (request.method === 'GET' && url.pathname === '/health') return respond(response, 200, { status: 'ok', fictional: true })
      if (request.headers.authorization !== `Bearer ${TOKEN}`) return error(response, 401, 'unauthorized', 'Use the public fictional lab token.', { 'WWW-Authenticate': 'Bearer realm="fictional-http-lab"' })
      if (url.pathname === '/simulate-error') return error(response, 503, 'synthetic_unavailable', 'Intentional fictional service failure.', { 'Retry-After': '1' })
      if (url.pathname === '/tasks' && request.method === 'GET') {
        if ([...url.searchParams.keys()].some((key) => !['page', 'limit'].includes(key)) || ['page', 'limit'].some((key) => url.searchParams.getAll(key).length > 1))
          return error(response, 400, 'invalid_pagination', 'Use page >= 1 and limit between 1 and 20.')
        const pageValue = url.searchParams.get('page') ?? '1', limitValue = url.searchParams.get('limit') ?? '2'
        const page = Number(pageValue), limit = Number(limitValue)
        if (!/^[1-9]\d{0,5}$/.test(pageValue) || !/^[1-9]\d?$/.test(limitValue) || limit > 20)
          return error(response, 400, 'invalid_pagination', 'Use page >= 1 and limit between 1 and 20.')
        const data = tasks.slice((page - 1) * limit, page * limit)
        return respond(response, 200, { data, pagination: { page, limit, total: tasks.length, nextPage: page * limit < tasks.length ? page + 1 : null }, fictional: true })
      }
      if (url.pathname === '/tasks' && request.method === 'POST') {
        if (request.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json') return error(response, 415, 'unsupported_media_type', 'Send application/json.')
        const chunks = []
        let size = 0
        for await (const chunk of request) {
          size += chunk.length
          if (size > MAX_BODY) { request.resume(); return error(response, 413, 'body_too_large', 'The local lab accepts at most 16384 bytes.') }
          chunks.push(chunk)
        }
        let body
        try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')) }
        catch { return error(response, 400, 'invalid_json', 'The request body must be valid JSON.') }
        if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some((key) => key !== 'title') || typeof body.title !== 'string' || body.title.trim().length < 1 || body.title.length > 120)
          return error(response, 422, 'validation_error', 'Provide only a title containing 1 to 120 characters.')
        if (tasks.length >= 1000) return error(response, 409, 'lab_capacity', 'Restart the lab to reset its bounded in-memory data.')
        const task = { id: tasks.length + 1, title: body.title.trim(), completed: false }
        tasks.push(task)
        return respond(response, 201, { data: task, fictional: true }, { Location: `/tasks/${task.id}` })
      }
      if (url.pathname === '/tasks') return error(response, 405, 'method_not_allowed', 'Use GET or POST.', { Allow: 'GET, POST' })
      const match = /^\/tasks\/([1-9]\d{0,6})$/.exec(url.pathname)
      if (match && request.method === 'GET') {
        const task = tasks.find((item) => item.id === Number(match[1]))
        if (task) return respond(response, 200, { data: task, fictional: true })
      }
      return error(response, 404, 'not_found', 'This fictional resource does not exist.')
    } catch { if (!response.headersSent) error(response, 400, 'invalid_request', 'The request could not be read.') }
  })
  server.requestTimeout = 10000
  server.headersTimeout = 5000
  return server
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4010)
  createLabServer().listen(port, '127.0.0.1', () => console.log(`Fictional HTTP lab: http://127.0.0.1:${port}\nPublic teaching token: ${TOKEN}`))
}
