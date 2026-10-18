import type { MetadataRoute } from "next"

/**
 * Lets the site be installed on a phone or desktop with its own icon. The
 * start URL is tagged, so launches from the home screen show up as a source.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yago Lagrotti Bracco — Programador, Desenvolvedor Full Stack & Engenheiro de Software Sênior",
    short_name: "Lagrotti",
    description: "Portfólio, estudos de caso, artigos e contato de Yago Lagrotti Bracco: Programador Sênior, Desenvolvedor Full Stack, arquitetura de sistemas e DevOps.",
    lang: "pt-BR",
    start_url: "/?utm_source=pwa&utm_medium=homescreen",
    scope: "/",
    display: "standalone",
    // The site opens in the dark theme unless the reader picks another.
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
