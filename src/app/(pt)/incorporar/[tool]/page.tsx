import { notFound } from "next/navigation"
import { ResourceEmbed } from "@/components/resources/ResourceEmbed"
export const metadata = { robots: { index: false, follow: true } }
export function generateStaticParams() { return ["json", "env", "queue"].map(tool => ({ tool })) }
export default async function Embed({ params }: { params: Promise<{ tool: string }> }) { const { tool } = await params; if (tool !== "json" && tool !== "env" && tool !== "queue") notFound(); return <ResourceEmbed tool={tool} locale="pt" /> }
