# Conclusão dos recursos de divulgação — 2026-10-17

O mapa das vinte coleções está em [distribution-resources.md](distribution-resources.md). Esta etapa fecha as lacunas identificadas após a primeira implementação.

- **Demos de produtos reais:** Dupla Face e Flora carregam as aplicações originais, por escolha explícita do visitante, com origem, instruções, fechamento e link alternativo. As interações públicas foram verificadas sem reservas, envio de formulários ou dados pessoais. O modelo de filas continua identificado como simulação educativa.
- **Contribuição concreta:** seis propostas derivadas da leitura de nove repositórios, com commits, arquivos, linhas, estimativa, conhecimentos e critérios de aceite. Não são apresentadas como tarefas aprovadas pelos mantenedores.
- **Campanha pronta para execução:** 30 dias consecutivos, de 19/10 a 17/11/2026; 90 textos completos em PT/EN/ES para LinkedIn, WhatsApp, comunidades e curadores de newsletters. Links UTM, calendários ICS, ZIPs e marcações locais. Copiar, marcar ou baixar não publica nem envia mensagens.
- **Material para conduzir sessões:** palestra de 30 minutos e oficina de 60 minutos, com agenda, exercícios, gabarito comentado, caderno e alternativa offline nos três idiomas. São propostas e materiais disponíveis, sem alegar apresentações realizadas.
- **Kit de imprensa com foto real:** imagem original do perfil público GitHub, 422 × 422 pixels, incluída nos três ZIPs com procedência e regras de uso.
- **Colaboração e galeria com caminho persistente:** rascunhos de issue e e-mail, JSON para download, autorização explícita, importador com modo de validação, label de revisão e workflow de PR em rascunho. Entradas aprovadas passam a integrar o catálogo e o sitemap no próximo build.

## Limites externos

Ainda precisam de pessoas ou acesso às contas: publicar/agendar os textos nas redes e newsletters, obter uma colaboração real, receber a primeira submissão externa com consentimento e combinar/realizar palestras. Os materiais e caminhos de envio estão disponíveis. Nenhum participante, depoimento, evento ou publicação foi inventado, e nenhuma mensagem foi enviada a terceiros.

## Validação final e publicação

- `npm test`: 109 testes passaram, sem falhas ou testes ignorados.
- `npm run lint`, `npm run typecheck`, `npm run check:blog-covers` e `npm run build`: concluídos com sucesso.
- Playwright contra o build de produção: 25 testes passaram, incluindo carregamento opt-in, fechamento das demos, rascunhos sem envio e checklist entre idiomas/reloads.
- Auditoria HTTP de 309 páginas: status, canonical, origem da imagem social e idioma corretos; quatro caminhos inválidos retornaram 404.
- 70 ZIPs: CRCs e caminhos internos verificados; os três kits de imprensa incluem foto e procedência.
- Inspeção de cinco telas novas em 390 px: sem overflow horizontal ou erros de execução; conferência visual de campanha, contribuição e demo em desktop/celular.
- Revisão encontrou e corrigiu um caso em que o texto da proposta podia simular o checkbox de autorização. Teste reproduziu a falha antes da correção e passou depois; há cobertura para CRLF e autorização em outra seção.

A entrega usa a branch `feat/growth-and-quality`, PR para `master` e a integração Vercel existente. O destino público dos recursos é [lagrotti.dev/recursos](https://lagrotti.dev/recursos); a publicação só é considerada concluída após CI, deploy e verificação HTTP do site público. As participações e publicações externas listadas acima permanecem separadas dessa entrega de código e materiais.
