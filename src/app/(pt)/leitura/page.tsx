import { DiscoveryScreen } from "@/components/discovery/DiscoveryScreen"
import { buildDiscoveryMetadata } from "@/lib/discovery-metadata"

export const metadata = buildDiscoveryMetadata("pt", "leitura")

export default function Page() {
  return <DiscoveryScreen locale="pt" slug="leitura" />
}
