# Revisão dos achados de segurança — 17/10/2026

Referência inicial: 14 alertas CodeQL abertos em `5af653b`, sendo sete em testes, e nove dependências de produção classificadas como baixas/moderadas. Severidade do scanner não comprova explorabilidade de cada fluxo. Não foram descartados alertas automaticamente.

| Alertas | Análise e tratamento |
| --- | --- |
| 3, Markdown no relatório de tráfego | Problema real de formatação/injeção de conteúdo no relatório: origem/campanha podem conter barra invertida, separador, HTML e quebra de linha. Escapar primeiro os caracteres Markdown e HTML, normalizar controles/quebras e delimitar código de funis corretamente. Regressão reproduzida antes da correção em `tests/traffic-report.test.ts`. |
| 7–10, leituras de arquivos locais | Build/imports usavam exists/lstat antes de ler o caminho. Agora um helper abre uma vez, recusa symlink final onde `O_NOFOLLOW` existe, verifica arquivo regular no descritor e distingue ENOENT de outros erros. Releases continuam usando criação exclusiva e comparação de bytes. Estes scripts rodam em checkout local confiável; não são endpoints remotos. Não tornam seguro um diretório pai controlado por atacante. |
| 11, logs do importador Webmention | Mensagens de erro de entradas locais passam a ser serializadas como objeto JSON numa linha, sem interpolação de linhas de controle no log. Nenhum corpo de requisição/segredo é registrado pelas APIs. |
| 1, fluxo DOM no editor | O fluxo observado extrai texto, passa por estado React e renderiza `{message}` como nó de texto. O link possui prefixo fixo `/admin/blog/`; não há reinterpretação com innerHTML nesse fluxo. Justificativa de falso positivo registrada; alterações futuras que introduzam HTML exigem nova revisão. |
| 2, 4–6, 12–14, verificações em testes | Regex/substrings validam saídas de fixtures e componentes, sem serem sanitizadores usados em produção. Não representam validação de host ou filtragem de HTML de um endpoint. Preservados como testes; não confundir a observação estática com uma exploração pública. |

## Endpoints e dependências

Os limites de corpo contam bytes do stream antes do parse, independentemente de Content-Length. Uploads de publicação passam pela validação compartilhada usada pelo admin: metadados, tipo e dimensões, seguida de decodificação completa limitada a 25 milhões de pixels. Cabeçalho válido com pixels corrompidos é recusado; imagens animadas/multipágina não são aceitas. Recusas de corpos/JSON/campos inválidos geram razão fixa sanitizada. Logs não contêm mensagens enviadas, perguntas ao modelo, e-mails, imagens ou erros crus de provedores.

Os contadores de requisições e a cota diária do assistente são por instância e reiniciam com ela. Persistência dos votos Redis é atômica, mas não transforma esses contadores locais em firewall distribuído ou limite global de gasto. Retenção durável de logs, firewall e orçamento do provedor dependem de infraestrutura externa.

`npm audit --omit=dev` encontrou **0 altas/críticas, 5 baixas e 4 moderadas** no snapshot de validação. As cadeias afetadas são gray-matter/js-yaml e recursos matemáticos transitivos do editor Milkdown. As sugestões automáticas propõem downgrade incompatível de gray-matter/Milkdown; não foram aplicadas com `--force`. O editor não oferece LaTeX e o conteúdo do blog/admin exige acesso autorizado, mas isso não elimina a obrigação de acompanhar as dependências. O CI mantém reprovação para altas/críticas e Dependabot acompanha atualizações.

Referências dos achados: [Code scanning do repositório](https://github.com/YagoLagrottiBracco/portfolio/security/code-scanning). O estado atual de cada alerta depende da análise posterior do commit implantado; esta nota não afirma que o scanner fechou todos eles.
