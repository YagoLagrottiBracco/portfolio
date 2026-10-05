import assert from "node:assert/strict"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { BlogMarkdown } from "../src/components/blog/BlogMarkdown"
import { safeBlogUrl } from "../src/lib/blog-markdown-url"

test("renders safe rich markdown", () => {
  const content = [
    "## API",
    "",
    "[unsafe](javascript:alert(1)) and ![unsafe](javascript:alert(1))",
    "",
    "| Name | Value |",
    "| --- | --- |",
    "| One | Two |",
    "",
    "```unknown-language",
    "<script>alert('x')</script>",
    "```",
    "",
    "![Diagram](https://example.com/diagram.png \"A useful caption\")",
    "",
    "![Plain](https://example.com/plain.png)",
  ].join("\n")
  const html = renderToStaticMarkup(<BlogMarkdown content={content} />)

  assert.match(html, /id="api"/)
  assert.doesNotMatch(html, /href="javascript:|src="javascript:/)
  assert.match(html, /overflow-x-auto/)
  assert.match(html, /&lt;script&gt;alert/)
  assert.match(html, /<figcaption[^>]*>A useful caption<\/figcaption>/)
  assert.match(html, /aria-label="Copiar código"/)
  assert.equal((html.match(/<figcaption\b/g) ?? []).length, 1)
})

test("allows useful URLs and rejects protocol-relative or executable URLs", () => {
  assert.equal(safeBlogUrl("/blog/post", "link"), "/blog/post")
  assert.equal(safeBlogUrl("#api", "link"), "#api")
  assert.equal(safeBlogUrl("mailto:hello@example.com", "link"), "mailto:hello@example.com")
  assert.equal(safeBlogUrl("http://example.com", "link"), "http://example.com")
  assert.equal(safeBlogUrl("http://example.com/image.png", "image"), undefined)
  assert.equal(safeBlogUrl("//evil.example/x", "image"), undefined)
  assert.equal(safeBlogUrl("javascript:alert(1)", "link"), undefined)
})

test("resolves only staged images in a private preview", () => {
  const content = "## Preview\n\n![Safe](blog-asset://one) ![Missing](blog-asset://two)"
  const html = renderToStaticMarkup(<BlogMarkdown content={content} assetPreviews={{ "blog-asset://one": "data:image/png;base64,iVBORw0KGgo=" }} />)
  assert.match(html, /src="data:image\/png;base64,iVBORw0KGgo="/)
  assert.doesNotMatch(html, /src="blog-asset:\/\//)
})
