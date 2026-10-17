# Plano editorial — 30 dias

Datas sugeridas: 19/10 a 17/11/2026. Revise antes de publicar ou enviar. Este arquivo não agenda nem envia mensagens. Selecione uma versão de idioma para cada público; não é preciso publicar as três. Não há resultados de audiência ou participações externas confirmadas.

## 2026-10-19 · LinkedIn

<!-- d01-kit -->

Uma biblioteca para testar decisões de engenharia

Reuni ferramentas e materiais abertos para transformar uma conversa de arquitetura em um experimento: comparador JSON, revisor de chaves .env, simulador de fila e starter de worker em TypeScript.

O caminho de cinco minutos é simples: compare dois contratos, gere uma sobrecarga e execute os testes do starter. Cada recurso informa seus limites; a simulação não usa dados de produção. Os materiais estão em português, inglês e espanhol.

Qual dessas decisões aparece mais nas conversas do seu time? Comece pelo kit e escolha um experimento.

https://lagrotti.dev/recursos/campanhas/kit-engenharia?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d01-kit-pt

---

## 2026-10-20 · WhatsApp

<!-- d02-json -->

Um contrato mudou?

Deixei um comparador JSON que mostra campos adicionados, removidos e alterados, sem confundir ordem das chaves com mudança. Teste com dois exemplos fictícios no navegador. Pode ser útil na próxima revisão de payload.

https://lagrotti.dev/recursos/ferramentas/json?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d02-json-pt

---

## 2026-10-21 · Comunidade de desenvolvimento

<!-- d03-fila-lab -->

Exercício aberto: prever o backlog antes de executar

Compartilho uma demo didática de filas para discussão técnica. Desafio: configure 20 entradas/s, dois workers e 0% de falhas. Antes de avançar dez passos, anote quanto trabalho espera encontrar na fila. Depois zere a entrada e estime o tempo de drenagem.

O modelo tenta uma mensagem por worker a cada segundo; retries são limitados a três tentativas. Não há backoff, persistência ou partições. O objetivo é discutir capacidade e recuperação, sem estimar o desempenho de um broker real.

Se experimentar, qual hipótese você mudaria primeiro: capacidade, duração do pico ou política de rejeição? Compartilhe o raciocínio com dados fictícios.

https://lagrotti.dev/recursos/demos/queue?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d03-fila-lab-pt

---

## 2026-10-22 · LinkedIn

<!-- d04-backlog -->

Uma fila compra tempo; a capacidade paga a conta

Neste modelo, 20 entradas por segundo e dois workers produzem um saldo de 18 mensagens por segundo. Dez passos depois, são 180 mensagens pendentes.

A fila absorve esse pico, mas não elimina o trabalho. Com a entrada parada, dois workers precisam de mais 90 passos para drená-la. Se as 20 entradas/s continuarem, o backlog continuará crescendo.

O experimento está pronto para você alterar as variáveis. Antes de escolher uma fila, pergunte: quanto atraso o produto tolera e qual é o plano para recuperar a capacidade?

https://lagrotti.dev/recursos/laboratorio/sobrecarga?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d04-backlog-pt

---

## 2026-10-23 · Sugestão para newsletter

<!-- d05-pitch-worker -->

Assunto: Sugestão de recurso: worker TypeScript para explorar retries

Olá, equipe editorial.

Gostaria de sugerir um recurso gratuito para uma edição sobre backend ou sistemas orientados a eventos: um starter TypeScript executável com testes, deduplicação em memória, limite de tentativas e exemplo de fila de falhas.

Sugestão de chamada: “Execute um worker pequeno, provoque uma falha e acompanhe o limite de retries. Um ponto de partida para discutir idempotência antes de adotar um broker.”

Requer Node.js 22 ou superior e usa licença MIT. O README explica a execução; a deduplicação é local ao processo e não representa uma solução pronta para produção. Se fizer sentido para a curadoria, o link abaixo reúne o download e o contexto.

Obrigado pela avaliação,
Yago Lagrotti Bracco

https://lagrotti.dev/recursos/templates/worker?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d05-pitch-worker-pt

---

## 2026-10-24 · WhatsApp

<!-- d06-adr -->

Uma decisão que dá para revisar

Um template ADR para registrar contexto, alternativas, decisão e consequências. Minha parte preferida é a condição de revisão: o que precisaria mudar para a escolha deixar de fazer sentido? Dá para baixar e preencher em texto.

https://lagrotti.dev/recursos/templates/adr?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d06-adr-pt

---

## 2026-10-25 · LinkedIn

<!-- d07-guia-filas -->

A resposta precisa do resultado agora?

Essa pergunta vem antes da escolha do broker. Se a resposta exige o resultado imediatamente, volume e dependência cabem no orçamento de latência, uma chamada direta pode ser suficiente.

Uma fila faz sentido quando receber e concluir podem ser etapas diferentes, os picos excedem a capacidade sustentada e o trabalho pode ser repetido com segurança. Isso traz novas decisões: retenção, ordenação, idempotência e destino das falhas.

Escrevi um guia curto com critérios e limites. Use-o para revisar uma escolha do seu contexto: qual requisito realmente pede processamento assíncrono?

https://lagrotti.dev/recursos/guias/filas?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d07-guia-filas-pt

---

## 2026-10-26 · LinkedIn

<!-- d08-env -->

O nome de uma variável também é contrato

Um deploy pode falhar porque uma chave obrigatória não chegou ao ambiente. Para revisar esse contrato, criei uma ferramenta que compara nomes de variáveis de uma referência .env.example com outra configuração.

O relatório aponta ausências, extras, duplicatas e linhas inválidas sem reproduzir os valores. O processamento acontece no navegador. Para demonstrar, use valores fictícios: o verificador não é um parser completo de dotenv nem confirma se o segredo está correto.

Que verificação de configuração você gostaria de fazer antes do próximo deploy?

https://lagrotti.dev/recursos/ferramentas/env?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d08-env-pt

---

## 2026-10-27 · WhatsApp

<!-- d09-idempotencia -->

E se a mensagem chegar duas vezes?

Retries pedem uma pergunta: repetir esta operação repete o efeito? A explicação curta de idempotência ajuda a separar a identidade da mensagem do efeito de negócio. Leve um exemplo fictício de cobrança ou pedido para a conversa do time.

https://lagrotti.dev/recursos/glossario/idempotencia?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d09-idempotencia-pt

---

## 2026-10-28 · Comunidade de desenvolvimento

<!-- d10-worker-lab -->

Laboratório pequeno: teste falhas antes do broker

Proponho um exercício com o starter TypeScript da biblioteca. Baixe, execute npm install, npm test e npm start em Node.js 22+. Leia o teste de deduplicação e o limite de tentativas antes de mudar qualquer código.

Agora descreva dois cenários: mensagem repetida no mesmo processo e repetição depois de reiniciar o processo. O segundo não é resolvido por um Set em memória. Que armazenamento e fronteira transacional você escolheria para ligar o efeito de negócio à chave de idempotência?

O starter tem licença MIT e serve como material didático. Se compartilhar sua solução, inclua teste e explique a hipótese de falha; não use dados reais de clientes.

https://lagrotti.dev/recursos/templates/worker?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d10-worker-lab-pt

---

## 2026-10-29 · LinkedIn

<!-- d11-clone -->

Um benchmark precisa de contexto para ser útil

Comparar JSON.parse/stringify e structuredClone só pelo menor tempo deixa perguntas importantes de fora. Quais tipos precisam ser preservados? Qual era o tamanho dos dados? O runtime foi o mesmo?

Publiquei um experimento com dados JSON sintéticos, aquecimento, alternância da ordem dos métodos e amostras brutas para download. O conjunto não testa Date, Map, ciclos ou transferíveis. A medição local não transforma uma estratégia em vencedora universal.

Leia o método, execute o script no seu ambiente e compare os resultados por tamanho. Que caso de uso mudaria sua escolha mesmo com um tempo maior?

https://lagrotti.dev/recursos/benchmarks/json-clone?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d11-clone-pt

---

## 2026-10-30 · Sugestão para newsletter

<!-- d12-pitch-filas -->

Assunto: Sugestão para a curadoria: uma fila que você pode sobrecarregar

Olá, equipe editorial.

Quero sugerir uma demo interativa para uma edição sobre confiabilidade: o leitor ajusta entradas, workers e falhas para observar backlog, retries e fila de falhas. Não requer conta.

Chamada sugerida: “Antes de adicionar uma fila, preveja o backlog de um pico de dez segundos e teste sua estimativa no navegador.”

O modelo é didático, sem dados de produção, backoff ou persistência. A página explicita essas limitações e permite repetir o exercício. Pode ser um complemento prático a uma discussão sobre capacidade. Segue o link para avaliação.

Obrigado,
Yago Lagrotti Bracco

https://lagrotti.dev/recursos/demos/queue?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d12-pitch-filas-pt

---

## 2026-10-31 · WhatsApp

<!-- d13-reproduzir -->

Repita a medição no seu runtime

Tem um experimento de cópia de JSON com script e dados sintéticos. Rode no seu ambiente e compare medianas por tamanho. A parte útil é registrar método e limites, não escolher uma API por um número isolado. O roteiro está aqui.

https://lagrotti.dev/recursos/laboratorio/copias?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d13-reproduzir-pt

---

## 2026-11-01 · LinkedIn

<!-- d14-caso-vmageste -->

Leia o fluxo antes de escolher a ferramenta

Uma discussão sobre eventos fica mais concreta quando desenhamos as etapas: onde o dado entra, onde é processado e como chega à consulta. No estudo de caso do VMAGeste, esse fluxo é uma boa porta de entrada para ler as decisões de arquitetura.

Minha sugestão de leitura: identifique uma fronteira assíncrona, anote a hipótese que ela atende e procure o que precisaria ser observado na operação. Use o caso como contexto e a demo da biblioteca para testar a ideia de capacidade com dados fictícios.

Qual informação você procura primeiro em um diagrama para entender a recuperação de uma falha?

https://lagrotti.dev/projetos/vmageste?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d14-caso-vmageste-pt

---

## 2026-11-02 · LinkedIn

<!-- d15-oficina -->

Uma hora para escrever uma decisão defensável

Preparei uma oficina autoguiada com um problema delimitado: 20 pedidos/s entram, dois são processados por segundo e o pico dura dez segundos. A tarefa é modelar o backlog e registrar uma decisão em um ADR.

O roteiro divide uma hora entre contexto, experimento, alternativas, escrita e revisão. Você pode fazer sozinho ou em dupla, usando apenas navegador e editor de texto. O material inclui exercícios, resultados esperados e gabarito para facilitar a discussão.

É um material disponível para usar, sem inscrição ou evento marcado. Qual condição faria você rejeitar trabalho em vez de enfileirar?

https://lagrotti.dev/recursos/campanhas/oficina-arquitetura?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d15-oficina-pt

---

## 2026-11-03 · WhatsApp

<!-- d16-pico -->

Desafio de dois minutos

20 entradas/s, dois workers, 0% de falhas, dez segundos. Quanto fica pendente? Faça a previsão antes de abrir a demo e depois zere a entrada para medir a recuperação. O roteiro distingue um pico temporário de déficit permanente de capacidade.

https://lagrotti.dev/recursos/laboratorio/sobrecarga?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d16-pico-pt

---

## 2026-11-04 · Comunidade de desenvolvimento

<!-- d17-adr-review -->

Revisão de ADR: que evidência mudaria sua decisão?

Exercício para uma discussão de arquitetura: use o cenário da oficina autoguiada e escreva um ADR com contexto, duas alternativas, decisão, consequências e condição de revisão. Evite justificar só com preferência por uma ferramenta.

Uma alternativa pode preservar a capacidade atual e aceitar atraso; outra pode aumentar workers ou rejeitar entrada acima de um limite. Compare tempo de recuperação, custo, duplicação e o que o usuário percebe. Declare as hipóteses que seu experimento não mediu.

Ao revisar, procure uma condição verificável que obrigaria a reavaliar a escolha. O material inclui um exemplo de resposta, sem tratar uma arquitetura como solução única. Qual hipótese falta no seu ADR?

https://lagrotti.dev/recursos/campanhas/oficina-arquitetura?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d17-adr-review-pt

---

## 2026-11-05 · LinkedIn

<!-- d18-monolito -->

Uma fronteira de código precisa virar um serviço?

Separar responsabilidades é uma decisão; separar deploys é outra. Uma fronteira pode começar dentro de um monólito modular e só depois ganhar operação independente, se existir uma necessidade concreta.

No guia sobre monólito modular e serviços separados, a proposta é comparar autonomia, contratos e custo operacional. Um novo processo também traz rede, observabilidade e falhas parciais.

Antes de decompor, escreva a restrição que a separação resolve e a condição que justificaria revisar a decisão. Qual parte do seu sistema precisa de autonomia de operação hoje?

https://lagrotti.dev/recursos/guias/monolito?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d18-monolito-pt

---

## 2026-11-06 · Sugestão para newsletter

<!-- d19-pitch-oficina -->

Assunto: Material para estudo: oficina de arquitetura em 60 minutos

Olá, equipe editorial.

Gostaria de sugerir um material para a seção de estudos ou atividades em equipe: uma oficina de 60 minutos para comparar alternativas e escrever um ADR apoiado por um experimento de capacidade.

Chamada sugerida: “Um problema, uma simulação e uma decisão registrada. Faça sozinho ou em dupla, com navegador e editor de texto.”

O guia traz divisão de tempo, exercícios, resultados esperados e gabarito. O cenário é fictício; não exige inscrição. Trata-se de uma proposta e de material autoguiado disponível, sem afirmar que houve uma apresentação ou turma anterior. O link reúne o contexto e os downloads para avaliação.

Obrigado,
Yago Lagrotti Bracco

https://lagrotti.dev/recursos/palestras/arquitetura?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d19-pitch-oficina-pt

---

## 2026-11-07 · WhatsApp

<!-- d20-env-check -->

Revisão rápida de configuração

Antes de testar, crie dois .env fictícios: uma referência com API_URL e WORKER_TOKEN e outro com API_URL repetido. O revisor mostra a chave ausente e a duplicata, sem reproduzir valores no relatório. Aqui está a ferramenta.

https://lagrotti.dev/recursos/ferramentas/env?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d20-env-check-pt

---

## 2026-11-08 · LinkedIn

<!-- d21-caso-pulsewatch -->

O que observar além da quantidade na fila?

Dois backlogs do mesmo tamanho podem representar situações muito diferentes. Uma fila que drena rapidamente depois de um pico pede uma leitura; uma mensagem antiga que não avança pede outra.

Para estudar essa diferença, leia o caso PulseWatch junto com o guia de filas. Use o caso como contexto de produto e operação, sem converter os números do simulador em métricas do projeto.

Na sua revisão, anote três sinais: idade da mensagem mais antiga, taxa de conclusão e destino das falhas. Qual sinal ajudaria a decidir entre esperar, escalar e investigar?

https://lagrotti.dev/projetos/pulsewatch?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d21-caso-pulsewatch-pt

---

## 2026-11-09 · LinkedIn

<!-- d22-retries -->

Qual é o destino da terceira falha?

Retry precisa de um limite e de um destino depois dele. Na demo didática, uma mensagem que falha três vezes vai para a fila de falhas. Isso encerra o ciclo automático do modelo, mas não explica sozinho como corrigir a causa.

Uma discussão de operação precisa dizer quem investiga, como identificar a mensagem e em que condição o reprocessamento será seguro. Não basta trocar uma fila infinita por um depósito de erros sem responsável.

O glossário explica DLQ e liga o conceito ao exercício. Se uma mensagem fosse para a fila de falhas hoje, seu time saberia qual seria o próximo passo?

https://lagrotti.dev/recursos/glossario/dead-letter?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d22-retries-pt

---

## 2026-11-10 · WhatsApp

<!-- d23-json-video -->

Veja um contrato mudando

Uma gravação curta mostra duas versões de um evento e os campos que mudaram. Dá para assistir e repetir no comparador com exemplos fictícios. É uma entrada rápida para conversar sobre revisão de contratos.

https://lagrotti.dev/recursos/videos/json?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d23-json-video-pt

---

## 2026-11-11 · Comunidade de desenvolvimento

<!-- d24-benchmark-colab -->

Convite aberto: reproduzir um benchmark com método

Abri um brief para reproduzir o experimento de cópia de JSON em outro runtime e comparar resultados com o mesmo método. O material inclui script, amostras e descrição das limitações.

Uma contribuição útil informa versão do runtime, sistema, CPU, comando e amostras brutas com dados sintéticos. Antes de comparar, verifique o tamanho dos objetos e as garantias semânticas de cada API. Diferenças podem motivar hipóteses; não provam uma regra universal.

O brief explica revisão e crédito. Não há coautores confirmados; uma eventual publicação conjunta depende da revisão do método e da autorização de quem participar. Se esse tipo de reprodução interessa, leia o escopo e proponha uma contribuição.

https://lagrotti.dev/recursos/colaboracoes/reproduzir-benchmark?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d24-benchmark-colab-pt

---

## 2026-11-12 · LinkedIn

<!-- d25-caso-eurologado -->

Do payload ao contexto do produto

Um diff mostra que um campo mudou. Para decidir se isso importa, precisamos do contexto: quem produz, quem consome e qual comportamento depende desse campo.

Use o estudo de caso Eurologado como exercício de leitura. Escolha um fluxo descrito no caso e escreva um contrato fictício mínimo para representá-lo. Depois adicione um campo e altere um valor no comparador JSON da biblioteca.

O exercício não reproduz contratos internos do projeto. Ele conecta uma ferramenta de comparação a perguntas de produto: o consumidor tolera a mudança? A validação detectaria a incompatibilidade?

https://lagrotti.dev/projetos/eurologado?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d25-caso-eurologado-pt

---

## 2026-11-13 · Sugestão para newsletter

<!-- d26-pitch-kit -->

Assunto: Sugestão de curadoria: ferramentas e exercícios de engenharia

Olá, equipe editorial.

Gostaria de sugerir o kit aberto de engenharia para uma seleção de recursos práticos. Ele reúne comparador JSON, revisor de chaves .env, demo de fila, starter TypeScript e exercícios de decisão de arquitetura, em português, inglês e espanhol.

Chamada sugerida: “Compare um contrato, provoque uma sobrecarga e leve um starter com testes. Uma biblioteca para experimentar decisões com dados fictícios.”

Os recursos explicam suas limitações e podem ser explorados sem cadastro. Não apresento métricas de audiência ou resultados de uso; o link abaixo permite avaliar diretamente o material. Se fizer sentido para a edição, fico disponível para esclarecer método e escopo.

Obrigado,
Yago Lagrotti Bracco

https://lagrotti.dev/recursos/campanhas/kit-engenharia?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d26-pitch-kit-pt

---

## 2026-11-14 · WhatsApp

<!-- d27-charla -->

Roteiro de 30 minutos sobre filas

Preparei “Filas sem mágica”: roteiro e material para discutir capacidade, retries, idempotência e observabilidade em 30 minutos. Inclui exercícios e gabarito. É uma proposta disponível para convite ou estudo, sem evento marcado.

https://lagrotti.dev/recursos/palestras/eventos?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d27-charla-pt

---

## 2026-11-15 · LinkedIn

<!-- d28-decisao -->

Troque “é melhor” por uma condição observável

Um ADR útil não termina na escolha da tecnologia. Ele registra a restrição, a alternativa descartada e o sinal que faria o time reconsiderar.

No cenário fictício da oficina, uma condição pode ser: se o backlog não drenar no prazo definido para o produto, reavaliar capacidade e política de admissão. O número precisa vir do requisito ou do experimento, com as hipóteses visíveis.

O template está disponível em texto para você adaptar. Pegue uma decisão recente: qual consequência foi aceita conscientemente e qual evidência mostraria que ela ficou cara demais?

https://lagrotti.dev/recursos/templates/adr?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d28-decisao-pt

---

## 2026-11-16 · Comunidade de desenvolvimento

<!-- d29-comunidade -->

Usou um recurso? Mostre uma aplicação verificável

A biblioteca tem um convite aberto para quem aplicar um dos recursos em uma demonstração pública. Uma proposta útil mostra qual recurso foi usado, o que foi adaptado e como outra pessoa pode verificar o resultado.

Pode ser um teste de deduplicação, um ADR com experimento reproduzível ou uma comparação de contratos com dados sintéticos. Inclua um link público, o crédito desejado e a autorização de publicação. Não envie dados pessoais de terceiros nem material confidencial.

As propostas passam por revisão; enviar não garante publicação. A página explica o fluxo e permite preparar a proposta para revisar antes de enviar. Que adaptação tornaria o recurso mais útil no seu contexto?

https://lagrotti.dev/recursos/comunidade/sua-aplicacao?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d29-comunidade-pt

---

## 2026-11-17 · LinkedIn

<!-- d30-proximo -->

Escolha um experimento e registre o que aprendeu

Se você chegou à biblioteca por um post, aqui vai uma sequência para transformar leitura em prática: compare dois payloads fictícios, sobrecarregue a fila, teste o starter e escreva um ADR com uma condição de revisão.

Não é preciso adotar uma tecnologia nova para tirar valor do exercício. O resultado pode ser confirmar que uma chamada direta basta, descobrir uma hipótese não testada ou explicar melhor a recuperação de uma falha.

O kit reúne os caminhos e downloads em três idiomas. Qual experimento você escolheria para a próxima conversa de engenharia? Registre a previsão antes de executar e compare depois.

https://lagrotti.dev/recursos/campanhas/kit-engenharia?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d30-proximo-pt
