/**
 * @file form-controls.tsx
 * @description Building blocks shared by the site's forms (brief,
 * recommendation): labelled fields, the bot trap and the status messages that
 * work with and without JavaScript. No hooks, so server and client trees can
 * both use them.
 */
import React, { type ReactNode } from "react"

import { cn } from "@/lib/utils"

export const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-brand"

interface FieldProps {
  id: string
  label: string
  /** Shown under the label, e.g. what the field is used for. */
  hint?: string
  children: ReactNode
  className?: string
}

export function Field({ id, label, hint, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      {hint && <p id={`${id}-hint`} className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

export function Checkbox({ id, name, required, children }: { id: string; name: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <input id={id} name={name} type="checkbox" required={required} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand)]" />
      <label htmlFor={id} className="leading-snug text-foreground">{children}</label>
    </div>
  )
}

/** A field people never see; bots fill every field, which is how they are told apart. */
export function Honeypot({ id }: { id: string }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>Website</label>
      <input id={id} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  )
}

/**
 * The live message (JavaScript) and one hidden message per status that
 * `:target` reveals after the plain-form redirect to `#<prefix>-<status>`.
 */
export function StatusMessages<S extends string>({ prefix, current, messages, className }: { prefix: string; current: S | null; messages: Record<S, string>; className?: string }) {
  return (
    <>
      <p role="status" className={cn("text-sm font-medium text-foreground empty:hidden", className)}>{current ? messages[current] : ""}</p>
      {(Object.keys(messages) as S[]).map((status) => (
        <p key={status} id={`${prefix}-${status}`} className={cn("hidden text-sm font-medium text-foreground target:block", className)}>
          {messages[status]}
        </p>
      ))}
    </>
  )
}
