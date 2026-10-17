import { projectDemos } from "@/data/resources/project-demos"
import publishedCommunity from "@/data/resources/community.json"
import type { ApprovedCommunityEntry } from "@/lib/resource-community"
import { publicRepositoryUrls } from "@/data/resources/repositories"
import { personalData } from "@/data/personal"
import { resourceSections } from "@/data/resources/sections"
import { tr, type ResourceEntry } from "@/data/resources/types"
import { guides, glossary, topics } from "@/data/resources/editorial"
import {
  tools,
  demos,
  templates,
  benchmarks,
  experiments,
  talks,
  collaborations,
  campaigns,
} from "@/data/resources/collections"
import { getCaseStudyProjects } from "@/lib/projects"

const communityEntries = publishedCommunity as ApprovedCommunityEntry[]
export { resourceSections }
export type { ResourceEntry }
export const RESOURCE_RELEASE_DATE = "2026-10-17"
const cases = getCaseStudyProjects()
const projectEntry = (project: (typeof cases)[number]): ResourceEntry => ({
  slug: project.slug,
  title: project.title,
  description: project.description,
  projects: [project.slug],
})

export function getResourceEntries(section: string): ResourceEntry[] {
  switch (section) {
    case "ferramentas":
      return tools
    case "demos":
      return [
        ...demos,
        ...projectDemos.map((demo) => ({
          slug: demo.slug,
          title: demo.title,
          description: demo.description,
          projects: [demo.projectSlug],
        })),
      ]
    case "templates":
      return templates
    case "benchmarks":
      return benchmarks
    case "guias":
      return guides
    case "glossario":
      return glossary
    case "temas":
      return topics
    case "laboratorio":
      return experiments
    case "palestras":
      return talks
    case "colaboracoes":
      return collaborations
    case "campanhas":
      return campaigns
    case "diagramas":
      return cases.filter((p) => p.caseStudy.diagram?.length).map(projectEntry)
    case "carrosseis":
      return cases.map(projectEntry)
    case "curadoria":
      return cases.map(projectEntry)
    case "atualizacoes":
      return [
        {
          slug: "biblioteca-aberta",
          title: tr(
            "Uma biblioteca para experimentar e reutilizar",
            "A library to explore and reuse",
            "Una biblioteca para explorar y reutilizar"
          ),
          description: tr(
            "Adicionados comparador JSON, revisor .env, demo de fila, starter de worker e materiais para divulgação.",
            "Added a JSON comparator, .env checker, queue demo, worker starter and distribution materials.",
            "Añadidos comparador JSON, revisor .env, demo de cola, starter de worker y materiales de difusión."
          ),
          date: RESOURCE_RELEASE_DATE,
          projects: ["envrune", "vmageste", "pulsewatch"],
        },
        ...cases.map((p) => ({
          ...projectEntry(p),
          blocks: p.caseStudy.highlights
            .slice(0, 3)
            .map((h) => ({ title: h.title, body: h.description })),
        })),
      ]
    case "videos":
      return [
        {
          slug: "queue",
          title: tr(
            "De sobrecarga a recuperação",
            "From overload to recovery",
            "De sobrecarga a recuperación"
          ),
          description: tr(
            "Uma gravação da demo mostra a fila crescendo e depois esvaziando ao ajustar a capacidade.",
            "A recording of the demo shows the queue growing and then draining as capacity changes.",
            "Una grabación muestra la cola creciendo y luego vaciándose al ajustar la capacidad."
          ),
          projects: ["vmageste", "pulsewatch"],
        },
        {
          slug: "json",
          title: tr(
            "Uma alteração de contrato em segundos",
            "A contract change in seconds",
            "Un cambio de contrato en segundos"
          ),
          description: tr(
            "Veja como comparar duas versões de um evento e localizar alterações nos campos.",
            "See how to compare two versions of an event and locate field changes.",
            "Mira cómo comparar dos versiones de un evento y localizar cambios en los campos."
          ),
          projects: ["eurologado", "devagent"],
        },
      ]
    case "imprensa":
      return [
        {
          slug: "yago",
          title: tr(
            "Yago Lagrotti Bracco — apresentação",
            "Yago Lagrotti Bracco — introduction",
            "Yago Lagrotti Bracco — presentación"
          ),
          description: tr(
            "Engenheiro de Software Sênior com mais de dez anos de experiência em produtos, arquitetura e DevOps.",
            "Senior Software Engineer with more than ten years of experience in products, architecture and DevOps.",
            "Ingeniero de software sénior con más de diez años de experiencia en productos, arquitectura y DevOps."
          ),
          download: "press-kit.zip",
          blocks: [
            {
              title: tr(
                "Biografia curta",
                "Short biography",
                "Biografía breve"
              ),
              body: tr(
                "Yago Lagrotti Bracco é Engenheiro de Software Sênior. Atua de ponta a ponta, conectando interfaces, APIs, arquitetura e operação. Seu portfólio reúne sistemas orientados a eventos, produtos SaaS e automação com IA, com estudos de caso em português, inglês e espanhol.",
                "Yago Lagrotti Bracco is a Senior Software Engineer. He works end to end, connecting interfaces, APIs, architecture and operations. His portfolio includes event-driven systems, SaaS products and AI automation, with case studies in Portuguese, English and Spanish.",
                "Yago Lagrotti Bracco es ingeniero de software sénior. Trabaja de punta a punta, conectando interfaces, APIs, arquitectura y operación. Su portafolio incluye sistemas orientados a eventos, productos SaaS y automatización con IA, con casos en portugués, inglés y español."
              ),
            },
          ],
        },
      ]
    case "incorporar":
      return [...tools, ...demos].map((e) => ({ ...e, blocks: undefined }))
    case "comunidade":
      return [
        {
          slug: "worker-do-autor",
          title: tr(
            "Worker de referência — exemplo do autor",
            "Reference worker — author example",
            "Worker de referencia — ejemplo del autor"
          ),
          description: tr(
            "O starter desta biblioteca demonstra retries e deduplicação em memória. Exemplo de primeira parte, não uma submissão da comunidade.",
            "This library's starter demonstrates retries and in-memory deduplication. A first-party example, not a community submission.",
            "El starter demuestra reintentos y deduplicación en memoria. Ejemplo del autor, no un envío de la comunidad."
          ),
          download: "worker-starter.zip",
        },
        ...communityEntries.map((entry) => ({
          slug: entry.slug,
          title: entry.title,
          description: entry.description,
          source: entry.demoUrl,
        })),
        {
          slug: "sua-aplicacao",
          title: tr(
            "Mostre sua aplicação",
            "Show your application",
            "Muestra tu aplicación"
          ),
          description: tr(
            "Usou algum recurso? Proponha uma entrada com demonstração pública, seu crédito e permissão de publicação. Envios passam por revisão antes de aparecer.",
            "Used a resource? Propose an entry with a public demo, your credit and publication permission. Submissions are reviewed before appearing.",
            "¿Usaste un recurso? Propón una entrada con demo pública, crédito y permiso de publicación. Los envíos se revisan antes de aparecer."
          ),
        },
      ]
    case "repositorios":
      return personalData.projects
        .filter((p) => p.links.some((l) => publicRepositoryUrls.has(l.url)))
        .map((p) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          projects: [p.slug],
          source: p.links.find((l) => publicRepositoryUrls.has(l.url))!.url,
        }))
    default:
      return []
  }
}
export function getResourceEntry(section: string, slug: string) {
  return getResourceEntries(section).find((entry) => entry.slug === slug)
}
