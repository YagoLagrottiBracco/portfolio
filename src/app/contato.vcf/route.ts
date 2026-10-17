import { buildVcard } from "@/lib/cv-formats"

export const dynamic = "force-static"

/** "Save contact" on a phone: name, title, email, phone and profiles. */
export function GET() {
  return new Response(buildVcard("pt"), {
    headers: { "Content-Type": "text/vcard; charset=utf-8", "Content-Disposition": 'attachment; filename="yago-lagrotti-bracco.vcf"' },
  })
}
