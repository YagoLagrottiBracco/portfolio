import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DiscoveryScreen } from "@/components/discovery/DiscoveryScreen"
import { discoverySlugs, isDiscoverySlug } from "@/data/discovery"
import { buildDiscoveryMetadata } from "@/lib/discovery-metadata"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return discoverySlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  if (!isDiscoverySlug(slug)) return {}
  return buildDiscoveryMetadata("pt", slug)
}

export default async function DiscoveryPage({ params }: PageProps) {
  const { slug } = await params
  if (!isDiscoverySlug(slug)) notFound()

  return <DiscoveryScreen slug={slug} locale="pt" />
}

