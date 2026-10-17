import React from "react"
import type { Locale } from "@/lib/i18n"
import { CopyField } from "@/components/resources/ResourceActions"
import release from "../../../public/recursos/releases/1.0.0/manifest.json"

export type PackageResourceKind = "terminal" | "github-action" | "executar" | "api-bruno" | "versoes"
const downloads = "/recursos/releases/1.0.0"
const repository = "https://github.com/YagoLagrottiBracco/portfolio/tree/master"
const actionRepository = "https://github.com/YagoLagrottiBracco/resource-contract-checks"
const actionClass = "inline-flex min-h-11 items-center rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-brand hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
const sources: Record<Exclude<PackageResourceKind, "versoes">, string> = {
  terminal: "packages/resource-tools",
  "github-action": "packages/resource-action",
  executar: "examples/worker-starter",
  "api-bruno": "examples/http-lab",
}
const filenames: Record<Exclude<PackageResourceKind, "versoes">, string> = {
  terminal: "resource-tools-1.0.0.tgz",
  "github-action": "resource-action-1.0.0.zip",
  executar: "worker-starter-1.0.0.zip",
  "api-bruno": "http-lab-1.0.0.zip",
}

export function PackageResources({ kind, locale }: { kind: PackageResourceKind; locale: Locale }) {
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  const titles: Record<string, string> = {
    terminal: copy("JSON e .env no terminal", "JSON and .env in your terminal", "JSON y .env en tu terminal"),
    "terminal-source": copy("Código-fonte da CLI", "CLI source code", "Código fuente de la CLI"),
    "github-action": "GitHub Action",
    executar: "Worker starter",
    "api-bruno": copy("Laboratório HTTP + Bruno", "HTTP + Bruno lab", "Laboratorio HTTP + Bruno"),
  }
  const heading = kind === "versoes" ? copy("Downloads imutáveis", "Immutable downloads", "Descargas inmutables") : titles[kind]
  const readme = locale === "pt" ? "README.md" : `README.${locale}.md`
  return (
    <section className="mt-8 space-y-6 rounded-2xl border border-hairline bg-surface p-5 sm:p-7">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-brand">v{release.version} · MIT · Node.js ≥20</p>
        <h2 className="mt-2 text-2xl font-semibold">{heading}</h2>
      </div>

      {kind === "terminal" && <>
        <p className="text-sm leading-relaxed text-muted-foreground">{copy(
          "Compare JSON e confira chaves .env com os mesmos motores usados nas ferramentas do site. Instale o TGZ hospedado abaixo; a publicação no registro npm está pendente.",
          "Compare JSON and check .env keys with the same engines used by the website tools. Install the hosted TGZ below; npm registry publication is pending.",
          "Compara JSON y revisa claves .env con los mismos motores de las herramientas del sitio. Instala el TGZ alojado; la publicación en el registro npm está pendiente."
        )}</p>
        <CopyField label={copy("Instalar e executar", "Install and run", "Instalar y ejecutar")} locale={locale} value={`${release.registry.install}\nresource-tools json before.json after.json --json\nresource-tools env .env.example .env --json`} />
        <p className="text-sm leading-relaxed text-muted-foreground">{copy(
          "Saídas: 0 para igualdade/validação, 1 para diferenças, 2 para entrada inválida. Cada arquivo ou stdin aceita até 200.000 bytes UTF-8. Use - para uma das entradas. Sem rede ou telemetria. Relatórios .env contêm apenas nomes de chaves e linhas; relatórios JSON podem incluir os valores comparados.",
          "Exit codes: 0 for equal/valid, 1 for differences, 2 for invalid input. Each file or stdin accepts up to 200,000 UTF-8 bytes. Use - for one input. No network or telemetry. Environment reports contain only key names and line numbers; JSON reports may include the compared values.",
          "Salidas: 0 para igualdad/validación, 1 para diferencias, 2 para entrada inválida. Cada archivo o stdin admite hasta 200.000 bytes UTF-8. Usa - para una entrada. Sin red ni telemetría. Los informes .env incluyen solo claves y líneas; los informes JSON pueden incluir los valores comparados."
        )}</p>
      </>}

      {kind === "github-action" && <>
        <p className="text-sm leading-relaxed text-muted-foreground">{copy(
          "Uma Action composta independente, com CLI e motor incluídos. Compara arquivos após o checkout e falha com os mesmos códigos da CLI. O runner precisa de Bash e Node.js 20 ou superior.",
          "A standalone composite Action with the CLI and engine included. It compares files after checkout and fails with the CLI exit codes. The runner needs Bash and Node.js 20 or newer.",
          "Una Action compuesta independiente con CLI y motor incluidos. Compara archivos después del checkout y falla con los códigos de la CLI. El runner necesita Bash y Node.js 20 o superior."
        )}</p>
        <CopyField label={copy("Passos do workflow", "Workflow steps", "Pasos del workflow")} locale={locale} value={`steps:\n  - uses: actions/checkout@v4\n  - uses: YagoLagrottiBracco/resource-contract-checks@v1\n    with:\n      tool: env\n      reference: .env.example\n      candidate: .env.ci`} />
        <p className="text-sm leading-relaxed text-muted-foreground">{copy(
          "O resumo mostra apenas estado e contagens. Nunca inclui conteúdo dos arquivos, nomes de chaves, caminhos ou valores. A Action está publicada no repositório dedicado, com as tags v1 e v1.0.0. Prefira fixar o SHA completo revisado. O ZIP também permite usá-la como Action local. A listagem no Marketplace depende do aceite da conta.",
          "The summary shows only status and counts. It never includes file contents, key names, paths or values. The Action is published in its dedicated repository with v1 and v1.0.0 tags. Prefer a reviewed full commit SHA. The ZIP also supports using it as a local Action. Marketplace listing requires account acceptance.",
          "El resumen muestra solo estado y recuentos. Nunca incluye archivos, nombres de claves, rutas ni valores. La Action está publicada en su repositorio dedicado con las etiquetas v1 y v1.0.0. Es preferible un SHA completo revisado. El ZIP también permite usarla como Action local. La lista del Marketplace requiere la aceptación de la cuenta."
        )}</p>
      </>}

      {kind === "executar" && <>
        <p className="text-sm leading-relaxed text-muted-foreground">{copy(
          "Execute fontes reais de um worker com reentrega, deduplicação por ID e descarte após três falhas. O exemplo cria apenas trabalhos sintéticos e mostra cada tentativa no navegador ou no terminal.",
          "Run real worker sources with retries, ID deduplication and dead letters after three failures. The example creates only synthetic jobs and shows each attempt in the browser or terminal.",
          "Ejecuta código real de un worker con reintentos, deduplicación por ID y descarte tras tres fallos. El ejemplo crea trabajos sintéticos y muestra cada intento en el navegador o la terminal."
        )}</p>
        <a className={actionClass} href="https://stackblitz.com/github/YagoLagrottiBracco/portfolio/tree/master/examples/worker-starter?startScript=dev" target="_blank" rel="noopener noreferrer">{copy("Abrir no StackBlitz", "Open in StackBlitz", "Abrir en StackBlitz")}</a>
        <CopyField label={copy("Após extrair o ZIP", "After extracting the ZIP", "Después de extraer el ZIP")} locale={locale} value="cd worker-starter\nnpm install --ignore-scripts\nnpm test\nnpm run demo\nnpm start" />
        <p className="text-sm leading-relaxed text-muted-foreground">{copy(
          "A demo abre em localhost:3000. Retém até 1.000 IDs em memória e executa um trabalho por vez. Reiniciar perde o estado. O README explica os limites e a adaptação para persistência, backoff e efeitos idempotentes em produção.",
          "The demo opens at localhost:3000. It retains up to 1,000 IDs in memory and executes one job at a time. Restarting loses state. The README explains the limits and how to adapt it for persistence, backoff and idempotent production side effects.",
          "La demo abre en localhost:3000. Conserva hasta 1.000 IDs en memoria y ejecuta un trabajo a la vez. Reiniciar pierde el estado. El README explica los límites y la adaptación para persistencia, backoff y efectos idempotentes en producción."
        )}</p>
      </>}

      {kind === "api-bruno" && <>
        <p className="text-sm leading-relaxed text-muted-foreground">{copy(
          "Uma API HTTP fictícia e local, acompanhada por 13 requisições Bruno completas com testes. Explore autenticação, paginação, criação, validação e erros usando apenas dados sintéticos.",
          "A fictional local HTTP API with 13 complete Bruno requests and tests. Explore authentication, pagination, creation, validation and errors using synthetic data.",
          "Una API HTTP ficticia y local con 13 peticiones Bruno completas y pruebas. Explora autenticación, paginación, creación, validación y errores con datos sintéticos."
        )}</p>
        <CopyField label={copy("Iniciar o laboratório", "Start the lab", "Iniciar el laboratorio")} locale={locale} value="cd http-lab\nnpm install --ignore-scripts\nnpm test\nnpm start" />
        <CopyField label={copy("Executar Bruno em outro terminal", "Run Bruno in another terminal", "Ejecutar Bruno en otra terminal")} locale={locale} value="cd http-lab/bruno\nnpx --yes @usebruno/cli@4.2.1 run --env local --sandbox=safe" />
        <p className="text-sm leading-relaxed text-muted-foreground">{copy(
          "O servidor escuta em http://127.0.0.1:4010. No Bruno, abra a pasta bruno e selecione local. O token público fictional-local-token é didático. A coleção percorre respostas 200, 201, 400, 401, 404, 405, 415, 422 e 503. Não envie dados reais; reinicie para restaurar as tarefas iniciais.",
          "The server listens at http://127.0.0.1:4010. In Bruno, open the bruno folder and select local. The public fictional-local-token is for teaching. The collection covers responses 200, 201, 400, 401, 404, 405, 415, 422 and 503. Use synthetic data; restart to restore the seeded tasks.",
          "El servidor escucha en http://127.0.0.1:4010. En Bruno, abre la carpeta bruno y selecciona local. El token público fictional-local-token es didáctico. La colección recorre respuestas 200, 201, 400, 401, 404, 405, 415, 422 y 503. Usa datos sintéticos; reinicia para restaurar las tareas iniciales."
        )}</p>
      </>}

      {kind !== "versoes" && <div className="flex flex-wrap gap-3">
        <a className={actionClass} href={`${downloads}/${filenames[kind]}`} download>{copy("Baixar", "Download", "Descargar")} {kind === "terminal" ? "TGZ" : "ZIP"} · v1.0.0</a>
        <a className={actionClass} href={kind === "github-action" ? `${actionRepository}/blob/v1.0.0/${readme}` : `${repository}/${sources[kind]}/${readme}`}>{copy("Ler instruções", "Read instructions", "Leer instrucciones")}</a>
        <a className={actionClass} href={kind === "github-action" ? actionRepository : `${repository}/${sources[kind]}`}>{copy("Código-fonte", "Source code", "Código fuente")}</a>
      </div>}

      {kind === "versoes" && <>
        <p className="text-sm leading-relaxed text-muted-foreground">{copy(
          "Versão 1.0.0, publicada em 17 de outubro de 2026. Cada arquivo tem tamanho e SHA-256 verificáveis. A geração recusa bytes conflitantes em uma versão existente; futuras alterações devem receber outra versão. O registro npm permanece pendente; o TGZ hospedado pode ser instalado diretamente.",
          "Version 1.0.0, released October 17, 2026. Every file has a verifiable size and SHA-256. The builder rejects conflicting bytes in an existing version; future changes require another version. npm registry publication remains pending; the hosted TGZ can be installed directly.",
          "Versión 1.0.0, publicada el 17 de octubre de 2026. Cada archivo tiene tamaño y SHA-256 verificables. El generador rechaza bytes conflictivos en una versión existente; los cambios futuros requieren otra versión. El registro npm sigue pendiente; el TGZ alojado se instala directamente."
        )}</p>
        <div className="space-y-4">
          {release.artifacts.map((artifact) => <article key={artifact.id} className="rounded-xl border border-hairline bg-background p-4">
            <h3 className="font-semibold">{titles[artifact.id]}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{artifact.filename} · {new Intl.NumberFormat(locale).format(artifact.bytes)} bytes · MIT</p>
            <p className="mt-2 text-xs text-muted-foreground">{copy("Compatibilidade", "Compatibility", "Compatibilidad")}: Node.js ≥20{artifact.id === "github-action" ? " · GitHub Actions · Bash" : artifact.id === "executar" ? " · StackBlitz" : artifact.id === "api-bruno" ? " · Bruno CLI 4.2.1" : ""}</p>
            <p className="mt-2 break-all font-mono text-xs">SHA-256: {artifact.sha256}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a className={actionClass} href={`${downloads}/${artifact.filename}`} download>{copy("Baixar", "Download", "Descargar")} {artifact.format.toUpperCase()}</a>
              <a className={actionClass} href={artifact.source}>{copy("Código-fonte", "Source code", "Código fuente")}</a>
            </div>
          </article>)}
        </div>
        <CopyField label={copy("Conferir integridade após baixar todos os arquivos", "Verify integrity after downloading every file", "Verificar integridad tras descargar todos los archivos")} locale={locale} value="sha256sum -c SHA256SUMS\n# macOS: shasum -a 256 -c SHA256SUMS" />
      </>}
      <div className="flex flex-wrap gap-4 border-t border-hairline pt-5 text-sm">
        <a className="text-brand underline underline-offset-4" href={`${downloads}/manifest.json`}>{copy("Manifesto JSON", "JSON manifest", "Manifiesto JSON")}</a>
        <a className="text-brand underline underline-offset-4" href={`${downloads}/SHA256SUMS`}>SHA256SUMS</a>
        {kind === "terminal" && <a className="text-brand underline underline-offset-4" href={`${downloads}/resource-tools-source-1.0.0.zip`} download>{copy("Baixar fontes e testes", "Download source and tests", "Descargar código y pruebas")}</a>}
      </div>
    </section>
  )
}
