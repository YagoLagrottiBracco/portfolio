import { readFileSync, writeFileSync } from "node:fs"
import { execFileSync } from "node:child_process"
import { resolve } from "node:path"
import {
  approveCommunitySubmission,
  extractCommunityProposal,
  validateCommunitySubmission,
  type ApprovedCommunityEntry,
} from "../src/lib/resource-community"

import { readOptionalLocalFile } from "./lib/local-files"

const args = process.argv.slice(2)
const option = (name: string) => {
  const i = args.indexOf(name)
  return i < 0 ? undefined : args[i + 1]
}
try {
  const issue = option("--issue"),
    input = option("--input")
  if (Boolean(issue) === Boolean(input))
    throw new Error("Choose --input proposal.json or --issue NUMBER")
  let proposal,
    evidence = option("--issue-url")
  if (issue) {
    if (!/^[1-9]\d*$/.test(issue)) throw new Error("Invalid issue number")
    const data = JSON.parse(
      execFileSync(
        "gh",
        ["api", `repos/YagoLagrottiBracco/portfolio/issues/${issue}`],
        { encoding: "utf8", maxBuffer: 150_000 }
      )
    )
    if (
      !data.labels.some(
        (label: { name: string }) => label.name === "community-approved"
      )
    )
      throw new Error(
        "A maintainer must apply community-approved after reviewing credit and consent"
      )
    proposal = extractCommunityProposal(data.body ?? "")
    evidence = data.html_url
  } else {
    const source = readFileSync(resolve(input!), "utf8")
    if (source.length > 100_000) throw new Error("Proposal exceeds 100KB")
    proposal = validateCommunitySubmission(JSON.parse(source))
  }
  if (!args.includes("--approve")) {
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          proposal,
          next: "Review permission/source and repeat with --approve --reviewer LOGIN --issue-url URL",
        },
        null,
        2
      )
    )
  } else {
    const approved = approveCommunitySubmission(proposal, {
      reviewer: option("--reviewer") ?? "",
      issueUrl: evidence ?? "",
      reviewedAt: new Date().toISOString().slice(0, 10),
    })
    const output = resolve(
      option("--output") ?? "src/data/resources/community.json"
    )
    const existing = readOptionalLocalFile(output)
    const entries: ApprovedCommunityEntry[] = existing ? JSON.parse(existing.toString("utf8")) : []
    if (!Array.isArray(entries)) throw new Error("Invalid gallery file")
    if (entries.some((entry) => entry.slug === approved.slug))
      throw new Error("Slug already exists; review edits separately")
    for (const entry of entries) approveCommunitySubmission(entry, entry.review)
    writeFileSync(
      output,
      JSON.stringify([...entries, approved], null, 2) + "\n"
    )
    console.log(
      `Imported ${approved.slug}; review the diff and publish through the normal site build.`
    )
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : "Invalid submission")
  process.exitCode = 1
}
