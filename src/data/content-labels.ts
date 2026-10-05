import type { Locale } from "@/lib/i18n"

/**
 * Skills, metrics and company labels are stored once, in the language they
 * were written in, and translated here at render time. Product and library
 * names, and anything not listed, come out unchanged.
 */
const portugueseLabels: Record<string, string> = {
  "Event-Driven Architecture": "Arquitetura orientada a eventos",
  "Microservices": "Microsserviços",
  "Chrome Extension": "Extensão do Chrome",
  "AI APIs": "APIs de IA",
  "Prompt Engineering": "Engenharia de prompt",
  "~3M events/day": "~3 mi de eventos/dia",
  "Multi-tenant SaaS": "SaaS multi-tenant",
  "Team leadership": "Liderança de time",
  "500+ customers": "500+ clientes",
  "Multi-channel alerts": "Alertas multicanal",
  "100+ customers": "100+ clientes",
  "Sole engineer": "Engenheiro único",
  "Full product ownership": "Responsabilidade integral pelo produto",
  "Windows, macOS & Linux": "Windows, macOS e Linux",
  "End-to-end encrypted": "Criptografado de ponta a ponta",
}

const englishLabels: Record<string, string> = {
  "Independente": "Independent",
  "Automação": "Automation",
}

const spanishLabels: Record<string, string> = {
  "Independente": "Independiente",
  "Freelancer": "Profesional independiente",
  "Event-Driven Architecture": "Arquitectura orientada a eventos",
  "Microservices": "Microservicios",
  "Clean Architecture": "Arquitectura limpia",
  "Row Level Security": "Seguridad a nivel de fila",
  "Automação": "Automatización",
  "Chrome Extension": "Extensión de Chrome",
  "AI APIs": "API de IA",
  "Prompt Engineering": "Ingeniería de instrucciones",
  "~3M events/day": "~3 M de eventos/día",
  "Multi-tenant SaaS": "SaaS multiinquilino",
  "Team leadership": "Liderazgo de equipo",
  "500+ customers": "Más de 500 clientes",
  "Multi-channel alerts": "Alertas multicanal",
  "100+ customers": "Más de 100 clientes",
  "Sole engineer": "Único ingeniero",
  "Full product ownership": "Responsabilidad integral del producto",
  "Open source (Apache-2.0)": "Código abierto (Apache-2.0)",
  "Windows, macOS & Linux": "Windows, macOS y Linux",
  "End-to-end encrypted": "Cifrado de extremo a extremo",
  "Production AI Agents with JavaScript (LangChain, LangGraph)": "Agentes de IA en producción con JavaScript (LangChain, LangGraph)",
  "AI com Node.js, OpenAI, ChatGPT, LangChain & TypeScript": "IA con Node.js, OpenAI, ChatGPT, LangChain y TypeScript",
  "Machine Learning in JavaScript with TensorFlow.js": "Aprendizaje automático en JavaScript con TensorFlow.js",
  "Deploy AI: Smarter LLMs, ML Ops & Cost Efficiency": "Despliegue de IA: modelos de lenguaje más inteligentes, MLOps y eficiencia de costes",
  "Domain-Driven Design (DDD) do Zero": "Diseño guiado por el dominio (DDD) desde cero",
  "NestJS Microservices: Build & Deploy a Scalable Backend": "Microservicios con NestJS: construcción y despliegue de un backend escalable",
  "Docker Essentials": "Fundamentos de Docker",
  "React.js & Next.js Completo (do Básico ao Avançado)": "Curso completo de React.js y Next.js, de básico a avanzado",
  "JavaScript Unit Testing (The Practical Guide)": "Pruebas unitarias en JavaScript: guía práctica",
  "Cypress End-to-End Testing": "Pruebas de extremo a extremo con Cypress",
  "UX Design Focus": "Enfoque en el diseño de experiencia de usuario"
}

const labels: Record<Locale, Record<string, string>> = {
  pt: portugueseLabels,
  en: englishLabels,
  es: spanishLabels,
}

export function localizeLabel(label: string, locale: Locale): string {
  return labels[locale][label] ?? label
}
