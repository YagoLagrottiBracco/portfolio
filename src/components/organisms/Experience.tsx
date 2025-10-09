"use client"

import { motion } from "framer-motion"
import { personalData } from "@/data/personal"

type ExperienceEntry = {
  type: 'experience'
  company: string
  position: string
  period: string
  description: string
}

type EducationEntry = {
  type: 'education'
  degree: string
  institution: string
  period: string
}

type TimelineEntry = ExperienceEntry | EducationEntry

export function Experience() {
  const allEntries: TimelineEntry[] = [
    ...personalData.experience.map(exp => ({ ...exp, type: 'experience' as const })),
    ...personalData.education.map(edu => ({ ...edu, type: 'education' as const }))
  ].sort((a, b) => {
    // Simple sort by period - this could be improved with date parsing
    return b.period.localeCompare(a.period)
  })

  return (
    <section id="experience" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience & Education</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My professional journey and educational background.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-0.5 w-0.5 h-full bg-border" />

            {allEntries.map((entry, index) => (
              <motion.div
                key={`${entry.type}-${index}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10" />

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                }`}>
                  <div className="bg-background border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">
                        {entry.type === 'experience' ? entry.company : entry.degree}
                      </h3>
                      <span className="text-sm text-muted-foreground">{entry.period}</span>
                    </div>
                    {entry.type === 'experience' && (
                      <p className="text-sm text-muted-foreground mb-2">{entry.position}</p>
                    )}
                    {entry.type === 'education' && (
                      <p className="text-sm text-muted-foreground mb-2">{entry.institution}</p>
                    )}
                    {entry.type === 'experience' && (
                      <p className="text-muted-foreground">{entry.description}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
