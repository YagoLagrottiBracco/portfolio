import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { StackScreen } from "@/components/organisms/StackScreens"
import { getAllPosts } from "@/lib/blog"
import { publishedTechs } from "@/lib/stack"
import { buildStackMetadata } from "@/lib/stack-metadata"

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

/** Only technologies with enough evidence get a page. */
export function generateStaticParams() {
  return publishedTechs(getAllPosts()).map((entry) => ({ slug: entry.slug }))
}

const find = (slug: string) => publishedTechs(getAllPosts()).find((entry) => entry.slug === slug)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const entry = find((await params).slug)
  return entry ? buildStackMetadata("pt", entry) : {}
}

export default async function StackPage({ params }: PageProps) {
  const entry = find((await params).slug)
  if (!entry) notFound()
  return <StackScreen entry={entry} locale="pt" />
}
