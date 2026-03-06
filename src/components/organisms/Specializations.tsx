"use client"

/**
 * @file Specializations.tsx
 * @description "Educação Contínua & Especializações" section.
 *
 * Displays courses grouped into 3 domain categories:
 * - Inteligência Artificial & Agentes
 * - Arquitetura & Backend Escalável
 * - Frontend & Qualidade de Software
 *
 * Layout: 3-column card grid (1 col mobile, 3 col lg).
 * Each card shows the category icon, title, and a list of courses.
 * Data comes from `personalData.specializations` in `@/data/personal`.
 */
import { motion } from "framer-motion"
import { Brain, Server, Code2, CheckCircle2 } from "lucide-react"
import { personalData } from "@/data/personal"
import { useTranslation } from "@/contexts/TranslationContext"

type LocaleKey = "pt" | "en"

const ICON_MAP = {
    Brain: Brain,
    Server: Server,
    Code2: Code2,
}

const CATEGORY_STYLES = [
    {
        border: "border-blue-500/20",
        bg: "bg-blue-500/5",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-400",
        checkColor: "text-blue-400",
        hoverBorder: "hover:border-blue-500/40",
    },
    {
        border: "border-orange-500/20",
        bg: "bg-orange-500/5",
        iconBg: "bg-orange-500/10",
        iconColor: "text-orange-400",
        checkColor: "text-orange-400",
        hoverBorder: "hover:border-orange-500/40",
    },
    {
        border: "border-purple-500/20",
        bg: "bg-purple-500/5",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-400",
        checkColor: "text-purple-400",
        hoverBorder: "hover:border-purple-500/40",
    },
]

export function Specializations() {
    const { t, locale } = useTranslation()
    const l = locale as LocaleKey

    return (
        <section id="specializations" className="py-24 bg-muted/20">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-14 text-center"
                >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {t('specializations.label')}
                    </p>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {t('specializations.title')}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                        {t('specializations.subtitle')}
                    </p>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                    {personalData.specializations.map((group, groupIndex) => {
                        const style = CATEGORY_STYLES[groupIndex % CATEGORY_STYLES.length]
                        const Icon = ICON_MAP[group.icon as keyof typeof ICON_MAP]

                        return (
                            <motion.div
                                key={group.category.pt}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: groupIndex * 0.12, duration: 0.55 }}
                                className={`relative rounded-2xl border ${style.border} ${style.bg} ${style.hoverBorder} p-6 transition-all duration-300`}
                            >
                                {/* Category header */}
                                <div className="mb-5 flex items-start gap-4">
                                    <div className={`flex-shrink-0 rounded-xl ${style.iconBg} p-3`}>
                                        <Icon className={`w-5 h-5 ${style.iconColor}`} />
                                    </div>
                                    <h3 className="text-base font-semibold leading-snug pt-1">
                                        {group.category[l]}
                                    </h3>
                                </div>

                                {/* Course list */}
                                <ul className="space-y-3">
                                    {group.courses.map((course) => (
                                        <li key={course} className="flex items-start gap-3">
                                            <CheckCircle2
                                                className={`mt-0.5 w-4 h-4 flex-shrink-0 ${style.checkColor}`}
                                            />
                                            <span className="text-sm text-muted-foreground leading-snug">
                                                {course}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
