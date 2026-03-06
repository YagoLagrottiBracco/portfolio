"use client"

/**
 * @file TechStack.tsx
 * @description Minimal visual strip that displays the core tech stack icons/names.
 * Used between the Hero and FeaturedProjects sections.
 * Animates into view using Framer Motion whileInView.
 */
import { motion } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"

const TECH_ITEMS = [
    { name: "TypeScript", color: "text-blue-400" },
    { name: "Next.js", color: "text-foreground" },
    { name: "NestJS", color: "text-red-400" },
    { name: "Golang", color: "text-cyan-400" },
    { name: "Apache Kafka", color: "text-orange-400" },
    { name: "ClickHouse", color: "text-yellow-400" },
    { name: "Docker", color: "text-blue-300" },
]

export function TechStack() {
    const { t } = useTranslation()
    return (
        <section className="border-y border-white/5 bg-muted/30 py-10">
            <div className="container mx-auto px-4">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground"
                >
                    {t('techStack.label')}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
                >
                    {TECH_ITEMS.map((tech, i) => (
                        <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06, duration: 0.35 }}
                            className="flex items-center gap-2"
                        >
                            <span className={`text-sm font-semibold ${tech.color}`}>{tech.name}</span>
                            {i < TECH_ITEMS.length - 1 && (
                                <span className="ml-8 hidden text-muted-foreground/30 sm:inline" aria-hidden>
                                    /
                                </span>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
