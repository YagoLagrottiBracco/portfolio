import assert from "node:assert/strict"
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { readOptionalLocalFile } from "../scripts/lib/local-files"

test("optional local reads distinguish absent files from invalid or redirected inputs", () => {
  const dir = mkdtempSync(join(tmpdir(), "portfolio-local-files-"))
  try {
    assert.equal(readOptionalLocalFile(join(dir, "absent")), null)
    const path = join(dir, "data.json")
    writeFileSync(path, "[]")
    assert.equal(readOptionalLocalFile(path)?.toString(), "[]")
    assert.throws(() => readOptionalLocalFile(dir), /regular local file/)
    if (process.platform !== "win32") {
      const link = join(dir, "redirect")
      symlinkSync(path, link)
      assert.throws(() => readOptionalLocalFile(link), { code: "ELOOP" })
    }
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
