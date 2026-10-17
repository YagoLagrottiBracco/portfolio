import type { Locale } from "@/lib/i18n"

/**
 * Whether Yago is taking new work. Set once in `personalData.availability`;
 * the homepage badge, the résumé header and `/agora` all read it.
 */
export type AvailabilityStatus = "available" | "limited" | "unavailable"

export const availabilityLabel: Record<AvailabilityStatus, Record<Locale, string>> = {
  available: {
    pt: "Aberto a vagas remotas e a novos projetos",
    en: "Open to remote roles and new projects",
    es: "Disponible para puestos remotos y nuevos proyectos",
  },
  limited: {
    pt: "Agenda limitada: novos projetos com início mais adiante",
    en: "Limited availability: new projects start further out",
    es: "Agenda limitada: nuevos proyectos con inicio más adelante",
  },
  unavailable: {
    pt: "Sem disponibilidade no momento, mas respondo mensagens",
    en: "Not taking new work right now, but I reply to messages",
    es: "Sin disponibilidad por ahora, pero respondo mensajes",
  },
}
