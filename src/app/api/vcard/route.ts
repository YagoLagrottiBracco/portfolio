import { personalData } from "@/data/personal"

export const dynamic = "force-static"

function escapeCard(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")
}

export function GET() {
  const card = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeCard(personalData.name)}`,
    `TITLE:${escapeCard(personalData.headline)}`,
    `EMAIL;TYPE=INTERNET:${personalData.socialLinks.email}`,
    `TEL;TYPE=CELL:${personalData.socialLinks.phone}`,
    `URL:${personalData.socialLinks.domain}`,
    `URL;TYPE=GitHub:${personalData.socialLinks.github}`,
    `URL;TYPE=LinkedIn:${personalData.socialLinks.linkedin}`,
    "END:VCARD",
    "",
  ].join("\r\n")
  return new Response(card, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="yago-lagrotti.vcf"',
    },
  })
}
