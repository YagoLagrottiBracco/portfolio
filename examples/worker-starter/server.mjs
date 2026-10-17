import { createServer } from 'node:http'
import { runDemo } from './demo.mjs'

const page = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Worker starter</title><style>body{font:18px system-ui;max-width:50rem;margin:3rem auto;padding:1rem;background:#101114;color:#eee}button{font:inherit;padding:.8rem}pre{white-space:pre-wrap;overflow-wrap:anywhere}</style><h1>Worker starter</h1><p>Fictional local jobs: success, a transient failure, a permanent failure and a duplicate.</p><p>Run tests in the terminal with <code>npm test</code>. Source: worker.mjs.</p><button id="run">Run synthetic demo</button><pre id="output" role="status"></pre><script>document.getElementById('run').onclick=async()=>{const output=document.getElementById('output');try{const response=await fetch('/api/demo');output.textContent=JSON.stringify(await response.json(),null,2)}catch{output.textContent='Demo unavailable.'}};</script></html>`
const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  if (request.method === 'GET' && request.url === '/api/demo') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(await runDemo()))
  } else if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); response.end(page)
  } else { response.writeHead(404); response.end('Not found') }
})
const port = Number(process.env.PORT || 3000)
server.listen(port, '0.0.0.0', () => console.log(`Fictional worker demo: http://localhost:${port}`))
