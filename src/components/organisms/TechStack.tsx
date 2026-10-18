/**
 * @file TechStack.tsx
 * @description Thin strip of core technologies, between the Hero and the case studies.
 *
 * Each accent is a light/dark pair: the single `-400` shades used before were
 * roughly 2:1 against a white background, so in light mode the strip read as
 * washed-out noise.
 *
 * A Server Component: no JavaScript of its own reaches the browser, so it
 * costs nothing to hydrate on a slow phone.
 */

import Link from "next/link"
import type { Locale } from "@/lib/i18n"
import { reveal } from "@/lib/motion"
import { getStackPath, techFor } from "@/lib/stack"
import { translator } from "@/lib/translate"

const TECH_ITEMS = [
    { name: "TypeScript", color: "text-blue-700 dark:text-blue-400" },
    { name: "Next.js", color: "text-foreground" },
    { name: "NestJS", color: "text-rose-700 dark:text-rose-400" },
    { name: "Python", color: "text-yellow-700 dark:text-yellow-400" },
    { name: "Django", color: "text-green-800 dark:text-green-400" },
    { name: "FastAPI", color: "text-teal-700 dark:text-teal-400" },
    { name: "Laravel", color: "text-red-700 dark:text-red-400" },
    { name: "MySQL", color: "text-blue-800 dark:text-blue-300" },
    { name: "MongoDB", color: "text-green-700 dark:text-green-400" },
    { name: "Golang", color: "text-cyan-700 dark:text-cyan-400" },
    { name: "Apache Kafka", color: "text-orange-700 dark:text-orange-400" },
    { name: "ClickHouse", color: "text-amber-700 dark:text-amber-400" },
    { name: "Docker", color: "text-sky-700 dark:text-sky-300" },
]

export function TechStack({ locale, techPages = [] }: { locale: Locale; techPages?: string[] }) {
    const t = translator(locale)
    const published = new Set(techPages)

    return (
        <section className="border-y border-hairline bg-muted/30 py-10">
            <div className="container mx-auto px-4">
                <p
                    {...reveal()}
                    className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground"
                >
                    {t("techStack.label")}
                </p>

                <ul
                    {...reveal(1)}
                    className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
                >
                    {TECH_ITEMS.map((tech, i) => {
                        const entry = techFor(tech.name)
                        const href = entry && published.has(entry.slug) ? getStackPath(locale, entry.slug) : null
                        return (
                            <li key={tech.name} className="flex items-center gap-8">
                                {href ? (
                                    <Link href={href} className={`text-sm font-semibold underline-offset-4 hover:underline ${tech.color}`}>
                                        {tech.name}
                                    </Link>
                                ) : (
                                    <span className={`text-sm font-semibold ${tech.color}`}>{tech.name}</span>
                                )}
                                {i < TECH_ITEMS.length - 1 && (
                                    <span className="hidden text-muted-foreground/30 sm:inline" aria-hidden="true">
                                        /
                                    </span>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}
