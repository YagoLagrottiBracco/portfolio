import type { Locale } from "@/lib/i18n"
import { tr } from "./types"

export type LocalizedText = Record<Locale, string>

export interface ProjectDemo {
  slug: string
  title: LocalizedText
  description: LocalizedText
  instructions: LocalizedText
  projectSlug: string
  productName: string
  url: string
  /** Public source repository, when the product publishes one. */
  source?: string
  embeddingSupported: boolean
  /** Date of the HTTP-header and real cross-origin iframe checks. */
  checkedAt: string
}

const inspectedProductHosts = new Set([
  "duplaface.arq.br",
  "florapsicologa.com.br",
])

/** Keep supplied data from turning the opt-in frame or its fallback into an unsafe URL. */
export function isSafeProjectDemoUrl(value: string): boolean {
  if (!value || /[\u0000-\u0020\u007f\\]/.test(value)) return false
  try {
    const url = new URL(value)
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      inspectedProductHosts.has(url.hostname)
    )
  } catch {
    return false
  }
}

export const projectDemos: readonly ProjectDemo[] = [
  {
    slug: "dupla-face-planta",
    title: tr(
      "Dupla Face: planta interativa real",
      "Dupla Face: a real interactive floor plan",
      "Dupla Face: plano interactivo real"
    ),
    description: tr(
      "Explore a planta pública do Apto Oscar no produto em produção do Estúdio Dupla Face. Os pontos abrem desenhos e imagens reais de cada ambiente.",
      "Explore Apto Oscar's public floor plan in Estúdio Dupla Face's production product. Room pins open the actual drawings and images for each space.",
      "Explora el plano público de Apto Oscar en el producto en producción de Estúdio Dupla Face. Los puntos abren dibujos e imágenes reales de cada ambiente."
    ),
    instructions: tr(
      "Role até “Planta interativa”, escolha um ponto numerado e alterne entre as plantas de projeto, demolição e construção. A área privada do cliente exige acesso próprio.",
      "Scroll to “Planta interativa”, choose a numbered room pin and switch between project, demolition and construction drawings. The private client area requires its own access.",
      "Desplázate hasta “Planta interativa”, elige un punto numerado y cambia entre los planos de proyecto, demolición y construcción. El área privada del cliente requiere acceso propio."
    ),
    projectSlug: "dupla-face",
    productName: "Estúdio Dupla Face · Apto Oscar",
    url: "https://duplaface.arq.br/projetos/apto-oscar",
    embeddingSupported: true,
    checkedAt: "2026-10-17",
  },
  {
    slug: "flora-agenda",
    title: tr(
      "Flora Psicologia: agenda real",
      "Flora Psicologia: the real booking calendar",
      "Flora Psicologia: agenda real"
    ),
    description: tr(
      "Navegue pelo calendário público de agendamento da Flora Psicologia e consulte os horários de uma data no aplicativo original em produção.",
      "Navigate Flora Psicologia's public booking calendar and inspect a date's available times in the original production application.",
      "Navega por el calendario público de reservas de Flora Psicologia y consulta los horarios de una fecha en la aplicación original en producción."
    ),
    instructions: tr(
      "Alterne o mês e selecione uma data para consultar horários. Esta é a agenda real da profissional: para experimentar, pare antes de preencher dados pessoais ou confirmar uma consulta.",
      "Switch months and select a date to inspect available times. This is the professional's real calendar: when exploring, stop before entering personal details or confirming an appointment.",
      "Cambia de mes y selecciona una fecha para consultar horarios. Es la agenda real de la profesional: al explorar, detente antes de introducir datos personales o confirmar una consulta."
    ),
    projectSlug: "flora-psicologia",
    productName: "Flora Psicologia · Agendamento",
    url: "https://florapsicologa.com.br/agendar",
    embeddingSupported: true,
    checkedAt: "2026-10-17",
  },
]
