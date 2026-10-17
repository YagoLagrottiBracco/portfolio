import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DiscoveryScreen } from "@/components/discovery/DiscoveryScreen"
import { isDiscoverySlug } from "@/data/discovery"
import { buildDiscoveryMetadata } from "@/lib/discovery-metadata"
import { discoverySlugs } from "@/data/discovery"

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() { return discoverySlugs.map(slug => ({ slug })) }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return isDiscoverySlug(slug) ? buildDiscoveryMetadata("pt", slug) : {}
}

export default async function PortugueseDiscoveryPage({ params }: PageProps) {
  const { slug } = await params
  if (!isDiscoverySlug(slug)) notFound()
  return <DiscoveryScreen locale="pt" slug={slug} />
}
