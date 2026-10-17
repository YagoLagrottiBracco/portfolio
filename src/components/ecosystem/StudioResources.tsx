import React from "react"
import type {Locale} from "@/lib/i18n"
import type {StudioResource} from "@/lib/resource-studio"
import {ResourceTools} from "@/components/resources/ResourceTools"
import {ChallengeStudio} from "@/components/ecosystem/ChallengeStudio"
import {DiagramEditor} from "@/components/ecosystem/DiagramEditor"
import {ResourceCollections} from "@/components/ecosystem/ResourceCollections"

export type StudioKind="cenarios"|"desafios"|"editor-diagramas"|"colecoes"
const emptyResources:StudioResource[]=[]
export function StudioResources({kind,locale,resources=emptyResources}:{kind:StudioKind;locale:Locale;resources?:StudioResource[]}) {
  switch(kind) {
    case "cenarios":return <ResourceTools tool="queue" locale={locale} />
    case "desafios":return <ChallengeStudio locale={locale} />
    case "editor-diagramas":return <DiagramEditor locale={locale} />
    case "colecoes":return <ResourceCollections locale={locale} resources={resources} />
  }
}
