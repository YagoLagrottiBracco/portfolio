import assert from "node:assert/strict"
import test from "node:test"
import { createBlogIndex } from "../src/lib/blog-content"

test("accepts an HTTPS article image URL", () => {
  const index = createBlogIndex([{
    filename: "image.pt.mdx",
    source: `---
title: Image post
slug: image-post
translationKey: image-post
excerpt: An excerpt.
date: 2026-09-01
tags: [seo]
locale: pt
image:
  url: https://images.example.com/cover.webp
  alt: Descriptive cover image
  width: 1200
  height: 630
---

## Content

Useful content.`,
  }], { now: new Date("2026-09-24T00:00:00Z") })

  assert.equal(index.getPostBySlug("image-post")?.image?.src, "https://images.example.com/cover.webp")
})

