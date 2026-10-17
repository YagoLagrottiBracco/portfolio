import { withUtm } from "@/lib/utm"

export type ShareNetwork = "linkedin" | "whatsapp" | "x" | "email"
/** Where a shared link was sent: a network, the clipboard or the phone's share sheet. */
export type ShareTarget = ShareNetwork | "copy" | "native"

/**
 * The article URL as handed to one share target. Tagged so the visits it
 * brings back show up under that source, with the article as the campaign
 * (its `translationKey`, so the three languages add up).
 */
export function sharedArticleUrl(url: string, target: ShareTarget, campaign: string): string {
  return withUtm(url, { utm_source: target, utm_medium: "share", utm_campaign: campaign })
}

/** Ready-to-open links for each network's share dialog. */
export function shareLinks({ url, title, campaign }: { url: string; title: string; campaign: string }): Record<ShareNetwork, string> {
  const tagged = (network: ShareNetwork) => sharedArticleUrl(url, network, campaign)
  const encode = encodeURIComponent

  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encode(tagged("linkedin"))}`,
    whatsapp: `https://wa.me/?text=${encode(`${title} ${tagged("whatsapp")}`)}`,
    x: `https://x.com/intent/tweet?text=${encode(title)}&url=${encode(tagged("x"))}`,
    email: `mailto:?subject=${encode(title)}&body=${encode(`${title}\n\n${tagged("email")}`)}`,
  }
}
