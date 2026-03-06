"use client"

/**
 * @file FeaturedProjects.tsx
 * @description Featured projects section with glassmorphism cards, grouped by category.
 *
 * Data source: `personalData.featuredProjects` in `@/data/personal`.
 * Uses Next.js `<Image />` component, shadcn Badge, and Framer Motion whileInView animations.
 *
 * Layout: Two category groups — "Sistemas & Arquitetura" and "Automação & Agentes de IA"
 * with a 1-col (mobile) / 2-col (lg) responsive grid.
 */
import { motion } from "framer-motion"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { personalData } from "@/data/personal"
import { useTranslation } from "@/contexts/TranslationContext"

type LocaleKey = "pt" | "en"

export function FeaturedProjects() {
    const { t, locale } = useTranslation()
    const l = locale as LocaleKey

    const categories = [...new Set(personalData.featuredProjects.map((p) => p.category[l]))]

    return (
        <section id="featured-projects" className="py-24">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        {t("featuredProjects.title")}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("featuredProjects.subtitle")}
                    </p>
                </motion.div>

                {/* Category groups */}
                <div className="space-y-20 max-w-6xl mx-auto">
                    {categories.map((category) => {
                        const projects = personalData.featuredProjects.filter(
                            (p) => p.category[l] === category
                        )
                        return (
                            <div key={category}>
                                {/* Category label */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-8 flex items-center gap-4"
                                >
                                    <span className="h-px flex-1 bg-border" />
                                    <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                                        {category}
                                    </span>
                                    <span className="h-px flex-1 bg-border" />
                                </motion.div>

                                {/* Cards grid */}
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                    {projects.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 24 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.12, duration: 0.55 }}
                                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 hover:bg-white/8 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]"
                                        >
                                            {/* Project image */}
                                            <div className="relative aspect-video w-full overflow-hidden">
                                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                                <Image
                                                    src={project.image}
                                                    alt={project.title[l]}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                                    onError={(e) => {
                                                        // Fallback to a gradient placeholder if image missing
                                                        const target = e.target as HTMLImageElement
                                                        target.style.display = "none"
                                                    }}
                                                />
                                                {/* Category badge overlay */}
                                                <div className="absolute top-4 left-4 z-20">
                                                    <Badge
                                                        variant="secondary"
                                                        className="border-blue-500/30 bg-blue-500/20 text-blue-300 backdrop-blur-sm text-xs"
                                                    >
                                                        {project.category[l]}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Card content */}
                                            <div className="p-6 space-y-5">
                                                <h3 className="text-xl font-bold leading-snug">
                                                    {project.title[l]}
                                                </h3>

                                                {/* Challenge */}
                                                <div>
                                                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
                                                        {t("featuredProjects.challenge")}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {project.challenge[l]}
                                                    </p>
                                                </div>

                                                {/* Solution */}
                                                <div>
                                                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan-400">
                                                        {t("featuredProjects.solution")}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                                        {project.solution[l]}
                                                    </p>
                                                </div>

                                                {/* Tech stack badges */}
                                                <div>
                                                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                                        {t("featuredProjects.stack")}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.techStack.map((tech) => (
                                                            <Badge
                                                                key={tech}
                                                                variant="outline"
                                                                className="border-white/10 text-xs text-muted-foreground"
                                                            >
                                                                {tech}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Links */}
                                                {project.links.length > 0 && (
                                                    <div className="flex gap-3 pt-1">
                                                        {project.links.map((link) => (
                                                            <Button
                                                                key={link.url}
                                                                variant="outline"
                                                                size="sm"
                                                                asChild
                                                                className="gap-2 border-white/10 text-xs hover:border-blue-500/50"
                                                            >
                                                                <a
                                                                    href={link.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <ExternalLink className="w-3 h-3" />
                                                                    {link.label[l]}
                                                                </a>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
