import { closeSync, constants, fstatSync, openSync, readFileSync } from "node:fs"

/** Open once: a missing local dataset is optional, other errors are not. */
export function readOptionalLocalFile(path: string): Buffer | null {
  let fd: number
  try { fd = openSync(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0)) }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null
    throw error
  }
  try {
    if (!fstatSync(fd).isFile()) throw new Error("Expected a regular local file")
    return readFileSync(fd)
  } finally { closeSync(fd) }
}
