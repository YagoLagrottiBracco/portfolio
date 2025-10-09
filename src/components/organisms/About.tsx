"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { personalData } from "@/data/personal"

export function About() {
  return (
    <section id="about" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {personalData.summary}
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {personalData.skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Badge variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {personalData.certifications.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Certifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalData.certifications.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-background p-4 rounded-lg border"
                  >
                    <p className="font-medium">{cert}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
