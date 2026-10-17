import { attributionProperties, browserStorages } from "@/lib/attribution"

/**
 * Sends a form to one of the site's form endpoints with the visit's
 * attribution, and returns the status it answered (or "unavailable" when the
 * network fails). The browser side of `src/lib/form-endpoint.ts`.
 */
export async function submitForm<S extends string>(endpoint: string, form: HTMLFormElement, unavailable: S): Promise<S> {
  const { local, session } = browserStorages()
  const fields = Object.fromEntries(new FormData(form))
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ ...fields, ...attributionProperties(local, session) }),
    })
    return ((await response.json()) as { status: S }).status
  } catch {
    return unavailable
  }
}
