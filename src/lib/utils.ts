import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS class names safely, resolving conflicts.
 * Combines `clsx` (conditional classes) with `tailwind-merge` (conflict resolution).
 * Use this everywhere instead of calling `clsx` or `twMerge` directly.
 * @example cn("px-4", isActive && "text-primary", "px-2") // => "px-2 text-primary"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
