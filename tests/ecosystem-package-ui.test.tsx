import React from "react"
import test from "node:test"
import assert from "node:assert/strict"
import { renderToStaticMarkup } from "react-dom/server"
import { PackageResources } from "../src/components/ecosystem/PackageResources"

// Existing client components use Next's automatic JSX runtime; tsx tests use the classic runtime.
Object.assign(globalThis, { React })

test("distribution screens expose real versioned downloads and localized instructions", () => {
  for (const locale of ["pt", "en", "es"] as const) {
    for (const kind of ["terminal", "github-action", "executar", "api-bruno", "versoes"] as const) {
      const html = renderToStaticMarkup(<PackageResources kind={kind} locale={locale} />)
      assert.match(html, /1\.0\.0/)
      assert.match(html, /\/recursos\/releases\/1\.0\.0\//)
      assert.ok(!html.includes("undefined"))
      if (kind === "executar") assert.match(html, /stackblitz\.com\/github\/YagoLagrottiBracco\/portfolio\/tree\/master\/examples\/worker-starter/)
      if (kind === "versoes") { assert.match(html, /SHA-256/); assert.match(html, /[a-f0-9]{64}/) }
      if (kind === "terminal") assert.match(html, /npm install --global https:\/\/lagrotti\.dev/)
      if (locale === "en") assert.match(html, kind === "versoes" ? /Immutable downloads/ : /Download/)
      if (locale === "es") assert.match(html, kind === "versoes" ? /Descargas inmutables/ : /Descargar/)
    }
  }
})
