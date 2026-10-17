import { getCaseStudyProjects } from "@/lib/projects"
import { createRecommendationHandler } from "@/lib/recommendation"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Module scope, so the rate limit counts across requests on the same instance. */
export const POST = createRecommendationHandler({ projectSlugs: getCaseStudyProjects().map((project) => project.slug) })
