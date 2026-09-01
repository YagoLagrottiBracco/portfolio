"use client"

/**
 * @file motion.ts
 * @description Scroll-reveal props that respect the user's motion preference.
 *
 * Every section used to animate unconditionally, which ignores
 * `prefers-reduced-motion` — a high-severity accessibility issue, and a real
 * nausea trigger for some people. `useReveal()` returns the same Framer Motion
 * props as before, but collapses to "already visible" when the user has asked
 * the system for less motion.
 *
 * Usage:
 *   const reveal = useReveal()
 *   <motion.div {...reveal()} />        // simple fade-up
 *   <motion.div {...reveal(index)} />   // staggered by list position
 */
import { useReducedMotion } from "framer-motion"

/** Stagger step between list items, in seconds. Kept short per Material guidance. */
const STAGGER = 0.06
/** Cap the stagger so long grids do not leave the last card waiting. */
const MAX_STAGGER_STEPS = 6

export function useReveal() {
  const prefersReduced = useReducedMotion()

  return (index = 0) => {
    if (prefersReduced) {
      // No movement, no fade-in delay — render it in place.
      return {
        initial: { opacity: 1 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { duration: 0 },
      } as const
    }

    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-80px" },
      transition: {
        duration: 0.5,
        delay: Math.min(index, MAX_STAGGER_STEPS) * STAGGER,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    } as const
  }
}
