/** A body limit is enforced on streamed bytes, independently of Content-Length. */
export class BodyTooLargeError extends Error {
  constructor() { super("Request body exceeds the byte limit") }
}

export async function readBoundedBody(request: Request, maxBytes: number): Promise<Uint8Array> {
  const reader = request.body?.getReader()
  if (!reader) return new Uint8Array()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    // The header is only an early refusal; a small or absent value never bypasses counting.
    if (Number(request.headers.get("content-length")) > maxBytes) throw new BodyTooLargeError()
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) throw new BodyTooLargeError()
      chunks.push(value)
    }
    const body = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength }
    return body
  } catch (error) {
    // Stop consuming immediately. A failing cancellation must not replace the refusal.
    void reader.cancel().catch(() => {})
    throw error
  } finally {
    reader.releaseLock()
  }
}

export async function readBoundedJson(request: Request, maxBytes: number): Promise<unknown> {
  return JSON.parse(new TextDecoder().decode(await readBoundedBody(request, maxBytes)))
}
