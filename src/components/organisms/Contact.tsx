"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { personalData } from "@/data/personal"
import { useTranslation } from '@/contexts/TranslationContext';

export function Contact() {
  const { t } = useTranslation();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const name = formData.get('name')
    const email = formData.get('email')
    const subject = formData.get('subject')
    const message = formData.get('message')
    const body = `${t('contact.emailGreeting')}\n\n${message}\n\n${t('contact.emailSignature')}\n\n${t('contact.nameLabel')}: ${name}\n${t('contact.emailLabel')}: ${email}`
    const mailto = `mailto:${personalData.socialLinks.email}?subject=${encodeURIComponent(subject as string)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('contact.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-background border rounded-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t('contact.nameLabel')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder={t('contact.namePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t('contact.emailLabel')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder={t('contact.emailPlaceholder')}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  {t('contact.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder={t('contact.subjectPlaceholder')}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>
              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                {t('contact.send')}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground mb-4">{t('contact.directContact')}</p>
            <div className="flex gap-6 justify-center">
              <a
                href={personalData.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href={personalData.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href={`mailto:${personalData.socialLinks.email}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {personalData.socialLinks.email}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
