import { buildVcard } from "@/lib/cv-formats"

export const dynamic = "force-static"

export function GET() {
  return new Response(buildVcard("pt"), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="yago-lagrotti.vcf"',
    },
  })
}
