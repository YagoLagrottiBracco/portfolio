/**
 * @file motion.ts
 * @description Scroll reveals, in CSS only (`[data-reveal]` in globals.css).
 *
 * They used to be Framer Motion components: about 60 KB of JavaScript, and on a
 * phone the navigation stayed off screen until hydration finished, which made
 * it the page's Largest Contentful Paint at around 4 s. Now the fade-up is a
 * scroll-driven CSS animation: it runs on the compositor, needs no script and
 * no hydration, and where the browser does not support it (or the reader
 * asked for less motion) the content is simply there.
 *
 * Usage:
 *   <div {...reveal()} />        // simple fade-up
 *   <div {...reveal(index)} />   // staggered by list position
 */
import type { CSSProperties } from "react"

/** Cap the stagger so long grids do not leave the last card waiting. */
const MAX_STAGGER_STEPS = 6

export function reveal(index = 0) {
  return {
    "data-reveal": "",
    style: { "--reveal-step": Math.min(index, MAX_STAGGER_STEPS) } as CSSProperties,
  }
}
