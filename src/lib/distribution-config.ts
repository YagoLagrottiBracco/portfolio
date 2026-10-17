/** Deployment-controlled destinations only; never accept these URLs from a request. */
export function configuredHttpsUrl(value: string | undefined): string | null {
  if (!value || value !== value.trim() || value.length > 2048) return null
  try {
    const url = new URL(value)
    if (url.protocol !== "https:" || url.username || url.password || url.hash) return null
    return url.href
  } catch { return null }
}

/** Native receive/signature/persistence support is not implemented. */
export function federationBridge() {
  if (process.env.ACTIVITYPUB_MODE !== undefined && process.env.ACTIVITYPUB_MODE !== "bridge") return null
  const webfinger = configuredHttpsUrl(process.env.ACTIVITYPUB_WEBFINGER_URL)
  const username = process.env.ACTIVITYPUB_USERNAME ?? "blog"
  if (!webfinger || !/^[A-Za-z0-9_.-]{1,64}$/.test(username)) return null
  return { webfinger, username, actor: configuredHttpsUrl(process.env.ACTIVITYPUB_ACTOR_URL), outbox: configuredHttpsUrl(process.env.ACTIVITYPUB_OUTBOX_URL) }
}

export function webSubHub(): string | null {
  return configuredHttpsUrl(process.env.WEBSUB_HUB_URL)
}
