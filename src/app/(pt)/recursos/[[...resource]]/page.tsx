import { ResourceScreen } from "@/components/resources/ResourceScreen"
import { buildResourceMetadata } from "@/lib/resource-metadata"
import { getResourceEntries, resourceSections } from "@/lib/resource-catalog"

interface Props { params: Promise<{ resource?: string[] }> }
export function generateStaticParams() {
  return [{ resource: [] }, ...resourceSections.flatMap(s => [{ resource: [s.slug] }, ...getResourceEntries(s.slug).map(e => ({ resource: [s.slug, e.slug] }))])]
}
export async function generateMetadata({ params }: Props) { const { resource = [] } = await params; return buildResourceMetadata("pt", resource[0], resource[1]) }
export default async function Resources({ params }: Props) { const { resource } = await params; return <ResourceScreen locale="pt" segments={resource} /> }
