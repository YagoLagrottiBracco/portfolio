/**
 * @file work-with-me.ts
 * @description Copy for `/trabalhe-comigo`: the two ways to work together and
 * how a project runs. Every claim here restates something the rest of the
 * site already says (the summary, the contact section, the case studies);
 * keep it that way. The areas of work are not listed here — the page builds
 * them from `projectCategories` and the case studies, so they cannot drift.
 */
import { profile } from "@/data/profile"
import { availabilityLabel, type AvailabilityStatus } from "@/lib/availability"
import type { Locale } from "@/lib/i18n"

type LocalizedText = Record<Locale, string>

export interface WorkFormat {
  id: "role" | "project"
  title: LocalizedText
  description: LocalizedText
  points: LocalizedText[]
}

const introAvailabilitySuffix: Record<AvailabilityStatus, LocalizedText> = {
  available: {
    pt: "disponível imediatamente.",
    en: "available immediately.",
    es: "disponible de inmediato.",
  },
  limited: {
    pt: `${availabilityLabel.limited.pt.toLowerCase()}.`,
    en: `${availabilityLabel.limited.en.toLowerCase()}.`,
    es: `${availabilityLabel.limited.es.toLowerCase()}.`,
  },
  unavailable: {
    pt: `${availabilityLabel.unavailable.pt.toLowerCase()}.`,
    en: `${availabilityLabel.unavailable.en.toLowerCase()}.`,
    es: `${availabilityLabel.unavailable.es.toLowerCase()}.`,
  },
}

export function buildWorkWithMeIntro(status: AvailabilityStatus = profile.availability.status): LocalizedText {
  const suffix = introAvailabilitySuffix[status]
  return {
    pt: `Procuro um time em que possa contribuir com desenvolvimento fullstack, arquitetura de sistemas e DevOps, da experiência do usuário à operação em produção. Também aceito projetos sob medida. Remoto, baseado no Brasil (UTC-3), ${suffix.pt}`,
    en: `I'm looking for a team where I can contribute as a Senior Software Engineer, Full-Stack Developer, and Programmer across systems architecture and DevOps, from the user experience to running in production. I also take on custom projects. Remote, based in Brazil (UTC-3), ${suffix.en}`,
    es: `Busco un equipo en el que pueda aportar como Programador, Desarrollador Full Stack e Ingeniero de Software Sénior en arquitectura de sistemas y DevOps, desde la experiencia de usuario hasta la operación en producción. También acepto proyectos a medida. Remoto, desde Brasil (UTC-3), ${suffix.es}`,
  }
}

export const workWithMe = {
  title: { pt: "Trabalhe comigo", en: "Work with me", es: "Trabaja conmigo" },
  metaTitle: {
    pt: "Contratar Programador Sênior, Desenvolvedor Full Stack e Engenheiro de Software — Trabalhe comigo",
    en: "Hire a Senior Software Engineer, Full-Stack Developer & Programmer — Work with me",
    es: "Contratar Programador Sénior, Desarrollador Full Stack e Ingeniero de Software — Trabaja conmigo",
  },
  description: {
    pt: "Contrate Yago Lagrotti: Programador Sênior, Desenvolvedor Full Stack e Engenheiro de Software no Brasil (São Paulo, UTC-3). Aberto a vagas remotas e a projetos de software sob medida: fullstack, arquitetura de sistemas, DevOps e IA aplicada, do zero à produção.",
    en: "Hire Yago Lagrotti: Senior Software Engineer, Full-Stack Developer, and Programmer based in Brazil (UTC-3). Open to remote roles and custom software projects: fullstack, systems architecture, DevOps, and applied AI, from zero to production.",
    es: "Contrata a Yago Lagrotti: Programador Sénior, Desarrollador Full Stack e Ingeniero de Software en Brasil (UTC-3). Disponible para puestos remotos y proyectos de software a medida: fullstack, arquitectura de sistemas, DevOps e IA aplicada, de cero a producción.",
  },
  intro: buildWorkWithMeIntro(),
  languages: {
    pt: "Trabalho em português, inglês e espanhol.",
    en: "I work in Portuguese, English and Spanish.",
    es: "Trabajo en portugués, inglés y español.",
  },
  formats: [
    {
      id: "role",
      title: { pt: "Uma vaga no seu time", en: "A role on your team", es: "Un puesto en tu equipo" },
      description: {
        pt: "Engenharia de Software Sênior, remoto: do frontend com React e Next.js ao backend com Node.js, TypeScript e Python, com arquitetura, infraestrutura e operação em produção.",
        en: "Senior Software Engineering, remote: from React and Next.js frontends to Node.js, TypeScript and Python backends, with architecture, infrastructure and production operations.",
        es: "Ingeniería de software sénior, remoto: del frontend con React y Next.js al backend con Node.js, TypeScript y Python, con arquitectura, infraestructura y operación en producción.",
      },
      points: [
        { pt: "Liderança técnica de equipes de engenharia", en: "Technical leadership of engineering teams", es: "Liderazgo técnico de equipos de ingeniería" },
        { pt: "Migração de monolitos para arquiteturas orientadas a eventos", en: "Moving monoliths to event-driven architectures", es: "Migración de monolitos a arquitecturas orientadas a eventos" },
        { pt: "Produtos SaaS multi-tenant, do zero a centenas de clientes", en: "Multi-tenant SaaS products, from zero to hundreds of customers", es: "Productos SaaS multi-tenant, de cero a cientos de clientes" },
      ],
    },
    {
      id: "project",
      title: { pt: "Um projeto sob medida", en: "A custom project", es: "Un proyecto a medida" },
      description: {
        pt: "Um produto completo, do problema à produção: arquitetura, desenvolvimento, deploy e operação. Para quem precisa de alguém que entregue a solução inteira, não só uma parte dela.",
        en: "A complete product, from the problem to production: architecture, development, deployment and operations. For when you need someone to deliver the whole solution, not just a piece of it.",
        es: "Un producto completo, del problema a la producción: arquitectura, desarrollo, despliegue y operación. Para cuando necesitas a alguien que entregue la solución entera, no solo una parte.",
      },
      points: [
        { pt: "Plataformas e e-commerce com regras de negócio próprias", en: "Platforms and e-commerce with their own business rules", es: "Plataformas y comercio electrónico con reglas de negocio propias" },
        { pt: "Portais, agendamento e áreas do cliente", en: "Portals, booking and customer areas", es: "Portales, reservas y áreas de cliente" },
        { pt: "IA aplicada a processos reais", en: "AI applied to real processes", es: "IA aplicada a procesos reales" },
      ],
    },
  ] satisfies WorkFormat[],
  steps: [
    {
      title: { pt: "Uma conversa de 30 minutos", en: "A 30-minute call", es: "Una llamada de 30 minutos" },
      text: {
        pt: "Você conta o problema, o estágio atual e o contexto do negócio; eu faço as perguntas técnicas e de produto que definem o tamanho real do desafio.",
        en: "You walk me through the problem, current stage and business context; I ask the technical and product questions that size the real challenge.",
        es: "Me cuentas el problema, la etapa actual y el contexto del negocio; yo hago las preguntas técnicas y de producto que definen el tamaño real del reto.",
      },
    },
    {
      title: { pt: "Escopo por escrito", en: "A written scope", es: "Un alcance por escrito" },
      text: {
        pt: "O que entra, o que fica de fora, a arquitetura proposta e como vamos medir que deu certo, antes de qualquer linha de código.",
        en: "What is in, what is out, the proposed architecture and how we will measure success, before any code is written.",
        es: "Qué entra, qué queda fuera, la arquitectura propuesta y cómo mediremos que funcionó, antes de escribir una línea de código.",
      },
    },
    {
      title: { pt: "Entregas em produção", en: "Shipping to production", es: "Entregas en producción" },
      text: {
        pt: "Etapas curtas, código documentado no seu repositório e o produto rodando desde cedo, para você acompanhar e ajustar o rumo com segurança.",
        en: "Short iterations, documented code in your repository and the product running early, so you can follow along and steer safely.",
        es: "Etapas cortas, código documentado en tu repositorio y el producto funcionando desde temprano, para que puedas seguirlo y ajustar el rumbo con seguridad.",
      },
    },
  ],
  labels: {
    pt: { formats: "Duas formas de trabalharmos juntos", areas: "Onde já entreguei", steps: "Como começa um projeto", cta: "Vamos conversar?", ctaText: "Escolha o canal que preferir para conversar sobre uma vaga sênior ou um projeto sob medida. Respondo pessoalmente em português, inglês ou espanhol.", cv: "Baixar o currículo em PDF", caseStudy: "Ver estudo de caso", cvFocus: "Com foco em", cvText: "Texto simples", cvJson: "JSON Resume", vcard: "Salvar contato" },
    en: { formats: "Two ways to work together", areas: "Where I have delivered", steps: "How a project starts", cta: "Shall we talk?", ctaText: "Pick whichever channel you prefer to discuss a senior role or a custom project. I reply personally in Portuguese, English or Spanish.", cv: "Download the résumé (PDF)", caseStudy: "Read the case study", cvFocus: "Focused on", cvText: "Plain text", cvJson: "JSON Resume", vcard: "Save contact" },
    es: { formats: "Dos formas de trabajar juntos", areas: "Dónde ya he entregado", steps: "Cómo empieza un proyecto", cta: "¿Hablamos?", ctaText: "Elige el canal que prefieras para hablar sobre un puesto sénior o un proyecto a medida. Respondo personalmente en portugués, inglés o español.", cv: "Descargar el currículum en PDF", caseStudy: "Ver caso de estudio", cvFocus: "Con foco en", cvText: "Texto simple", cvJson: "JSON Resume", vcard: "Guardar contacto" },
  } satisfies Record<Locale, Record<string, string>>,
}
