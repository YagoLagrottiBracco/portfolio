import { permanentRedirect } from "next/navigation"

/** Legacy `/pt/blog` and `/en/blog`. The canonical blog index is `/blog`. */
export default function LegacyLocaleBlogPage() {
  permanentRedirect("/blog")
}
