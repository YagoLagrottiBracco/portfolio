export interface ResourceCitation {
  id: string
  title: string
  author: string
  url: string
  publishedAt?: string
  updatedAt?: string
  version?: string
  kind: "article" | "software" | "resource"
}
function bib(value: string): string {
  return value.replace(
    /[\\{}%&#_$\r\n]/g,
    (char) =>
      ({
        "\\": "\\textbackslash{}",
        "{": "\\{",
        "}": "\\}",
        "%": "\\%",
        "&": "\\&",
        "#": "\\#",
        _: "\\_",
        $: "\\$",
        "\r": " ",
        "\n": " ",
      })[char]!
  )
}
export function buildCitation(input: ResourceCitation): {
  text: string
  bibtex: string
} {
  const url = new URL(input.url)
  if (
    url.protocol !== "https:" ||
    url.hostname !== "lagrotti.dev" ||
    url.username ||
    url.password ||
    url.port
  )
    throw new Error("Use a canonical portfolio URL")
  if (
    !input.title.trim() ||
    !input.author.trim() ||
    input.title.length > 2000 ||
    input.author.length > 200
  )
    throw new Error("Invalid citation metadata")
  const date = input.updatedAt ?? input.publishedAt
  if (
    date &&
    (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(date) ||
      Number.isNaN(Date.parse(date)))
  )
    throw new Error("Invalid citation date")
  const key =
    input.id
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 100) || "resource"
  const fields = [
    ["author", input.author],
    ["title", input.title],
    ["url", url.toString()],
    ...(date
      ? [
          ["year", date.slice(0, 4)],
          ["date", date.slice(0, 10)],
        ]
      : []),
    ...(input.version ? [["version", input.version]] : []),
  ]
  return {
    text: `${input.author}. ${input.title}.${input.version ? ` v${input.version}.` : ""}${date ? ` ${date.slice(0, 10)}.` : ""} ${url.toString()}`,
    bibtex: `@misc{${key},\n${fields.map(([name, value]) => `  ${name} = {${bib(value)}}`).join(",\n")}\n}\n`,
  }
}
