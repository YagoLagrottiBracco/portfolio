/**
 * @file screening.ts
 * @description The questions every recruiter asks before the first call,
 * answered on `/trabalhe-comigo#triagem`. Answers restate what the site already
 * says (contact section, summary, experience). The ones only Yago can give —
 * contract model, salary, English level, relocation — start as `null` and stay
 * hidden until filled in.
 */
import type { Locale } from "@/lib/i18n"

type LocalizedText = Record<Locale, string>

export interface ScreeningAnswer {
  id: string
  question: LocalizedText
  /** `null` hides the question until there is a real answer. */
  answer: LocalizedText | null
}

export const screening: ScreeningAnswer[] = [
  {
    id: "location",
    question: { pt: "Onde você está e em que fuso?", en: "Where are you based, and in which time zone?", es: "¿Dónde vives y en qué huso horario?" },
    answer: { pt: "Embu-Guaçu, São Paulo, Brasil. UTC-3, sem horário de verão.", en: "Embu-Guaçu, São Paulo, Brazil. UTC-3, no daylight saving time.", es: "Embu-Guaçu, São Paulo, Brasil. UTC-3, sin horario de verano." },
  },
  {
    id: "remote",
    question: { pt: "Trabalha remoto?", en: "Do you work remotely?", es: "¿Trabajas en remoto?" },
    answer: {
      pt: "Sim, procuro vagas remotas e projetos sob medida como Programador Sênior, Desenvolvedor Full Stack e Engenheiro de Software.",
      en: "Yes, I am looking for remote roles and custom projects as a Senior Software Engineer, Full-Stack Developer, and Programmer.",
      es: "Sí, busco puestos remotos y proyectos a medida como Programador Sénior, Desarrollador Full Stack e Ingeniero de Software.",
    },
  },
  {
    id: "seniority",
    question: { pt: "Qual a sua senioridade?", en: "What is your seniority?", es: "¿Cuál es tu seniority?" },
    answer: {
      pt: "Programador Sênior, Desenvolvedor Full Stack e Engenheiro de Software Sênior, com mais de 10 anos desenvolvendo produtos de ponta a ponta.",
      en: "Senior Software Engineer, Full-Stack Developer, and Programmer, with more than 10 years building products end to end.",
      es: "Programador sénior, desarrollador full stack e ingeniero de software sénior, con más de 10 años desarrollando productos de punta a punta.",
    },
  },
  {
    id: "leadership",
    question: { pt: "Já liderou times?", en: "Have you led teams?", es: "¿Has liderado equipos?" },
    answer: { pt: "Sim: fui CTO e fundador da TechWorkz.Digital (2023–2026) e gerente de desenvolvimento na Bebidas Online, liderando cinco desenvolvedores.", en: "Yes: I was CTO and founder of TechWorkz.Digital (2023–2026) and Software Development Manager at Bebidas Online, leading five developers.", es: "Sí: fui director de tecnología y fundador de TechWorkz.Digital (2023–2026) y gerente de desarrollo en Bebidas Online, al frente de cinco desarrolladores." },
  },
  {
    id: "stack",
    question: { pt: "Qual é a sua stack principal?", en: "What is your main stack?", es: "¿Cuál es tu stack principal?" },
    answer: { pt: "Node.js e TypeScript no backend, React e Next.js no frontend, PostgreSQL, além de Python (Django, FastAPI), Laravel, Kafka, Docker e Terraform.", en: "Node.js and TypeScript on the backend, React and Next.js on the frontend, PostgreSQL, plus Python (Django, FastAPI), Laravel, Kafka, Docker and Terraform.", es: "Node.js y TypeScript en el backend, React y Next.js en el frontend, PostgreSQL, además de Python (Django, FastAPI), Laravel, Kafka, Docker y Terraform." },
  },
  {
    id: "languages",
    question: { pt: "Em que idiomas trabalha?", en: "Which languages do you work in?", es: "¿En qué idiomas trabajas?" },
    answer: { pt: "Português, inglês e espanhol.", en: "Portuguese, English and Spanish.", es: "Portugués, inglés y español." },
  },
  {
    id: "contract",
    question: { pt: "Qual modelo de contratação você aceita?", en: "Which contract models do you accept?", es: "¿Qué modelo de contratación aceptas?" },
    answer: null,
  },
  {
    id: "salary",
    question: { pt: "Qual a sua pretensão salarial?", en: "What are your salary expectations?", es: "¿Cuál es tu expectativa salarial?" },
    answer: null,
  },
  {
    id: "english-level",
    question: { pt: "Qual o seu nível de inglês?", en: "What is your English level?", es: "¿Cuál es tu nivel de inglés?" },
    answer: null,
  },
  {
    id: "relocation",
    question: { pt: "Aceita mudança de cidade ou viagens?", en: "Would you relocate or travel?", es: "¿Aceptas mudarte o viajar?" },
    answer: null,
  },
]

export const screeningCopy: Record<Locale, { title: string; intro: string; start: string }> = {
  pt: { title: "Respostas rápidas para recrutadores", intro: "O que costuma ser perguntado antes da primeira conversa.", start: "Quando pode começar?" },
  en: { title: "Quick answers for recruiters", intro: "What usually comes up before the first call.", start: "When can you start?" },
  es: { title: "Respuestas rápidas para reclutadores", intro: "Lo que suele preguntarse antes de la primera conversación.", start: "¿Cuándo puedes empezar?" },
}
