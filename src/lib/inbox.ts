/**
 * Delivers form submissions to Yago's inbox through Resend
 * (https://resend.com/docs/api-reference/emails/send-email). Nothing is kept
 * on the site: the email is the record. Messages only ever go to the
 * configured inbox — never to the address someone typed — so the forms
 * cannot be used to send mail to third parties.
 */
export interface InboxConfig {
  apiKey: string
  /** A sender on a domain verified in Resend, e.g. "lagrotti.dev <contato@lagrotti.dev>". */
  from: string
  to: string
}

/** From the environment, or `null` while Resend is not configured. */
export function inboxConfig(env: Record<string, string | undefined> = process.env): InboxConfig | null {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO) return null
  return { apiKey: env.RESEND_API_KEY, to: env.CONTACT_TO, from: env.CONTACT_FROM || "lagrotti.dev <onboarding@resend.dev>" }
}

export interface InboxMessage {
  subject: string
  text: string
  /** The person who wrote, so "reply" in the mail client answers them. */
  replyTo?: string
  /** Same key within 24 h sends once, e.g. a double-clicked submit. */
  idempotencyKey?: string
}

export async function sendToInbox(message: InboxMessage, config: InboxConfig, fetcher: typeof fetch = fetch): Promise<boolean> {
  const response = await fetcher("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      ...(message.idempotencyKey ? { "Idempotency-Key": message.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      subject: message.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
      text: message.text,
      ...(message.replyTo ? { reply_to: message.replyTo } : {}),
    }),
  })
  return response.ok
}

/** "label: value" lines, skipping empty values. */
export function fieldLines(fields: [string, string | undefined][]): string {
  return fields.filter((entry): entry is [string, string] => Boolean(entry[1]?.trim())).map(([label, value]) => `${label}: ${value}`).join("\n")
}
