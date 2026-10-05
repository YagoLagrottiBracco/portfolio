import assert from "node:assert/strict"
import test from "node:test"
import sharp from "sharp"
import { prepareBlogAssets, validateBlogMarkdown, validateUploadImage } from "../src/lib/blog-admin-assets"

const bodies = { pt: "## Olá", en: "## Hello", es: "## Hola" }

test("rejects a missing staged image and unsafe Markdown", async () => {
  await assert.rejects(prepareBlogAssets([], { ...bodies, pt: "## Olá\n\n![a](blog-asset://x)" }, "key"), /asset/i)
  assert.throws(() => validateBlogMarkdown("## Heading\n\n<script>alert(1)</script>"), /HTML/i)
  assert.throws(() => validateBlogMarkdown("## Heading\n\n[x](javascript:alert(1))"), /URL|protocol/i)
  assert.throws(() => validateBlogMarkdown("## Heading\n\n![](https://example.com/image.png)"), /alt/i)
  assert.doesNotThrow(() => validateBlogMarkdown("## Heading\n\n[Legacy source](http://example.com)"))
  assert.doesNotThrow(() => validateBlogMarkdown("## Heading\n\n```html\n<script>literal</script>\n```"))
})

test("validates actual image bytes and resolves placeholders", async () => {
  const bytes = await sharp({ create: { width: 2, height: 2, channels: 4, background: "red" } }).png().toBuffer()
  const asset = { id: "a", filename: "image.png", contentType: "image/png", base64: bytes.toString("base64"), alt: "Description", width: 2, height: 2 }
  const result = await prepareBlogAssets([asset], { ...bodies, pt: "## Olá\n\n![a](blog-asset://a)" }, "key")
  assert.equal(result.files.length, 1)
  assert.match(result.markdownByLocale.pt, /\/blog\/key-[a-f0-9]{12}\.png/)
  await assert.rejects(prepareBlogAssets([{ ...asset, base64: Buffer.from("not an image").toString("base64") }], bodies, "key"), /image/i)
  await assert.rejects(prepareBlogAssets([{ ...asset, width: 3 }], bodies, "key"), /dimension/i)
})

test("accepts real AVIF bytes", async () => {
  const bytes = await sharp({ create: { width: 2, height: 2, channels: 4, background: "red" } }).avif().toBuffer()
  const result = await validateUploadImage({ contentType: "image/avif", base64: bytes.toString("base64"), width: 2, height: 2 })
  assert.equal(result.length, bytes.length)
})
