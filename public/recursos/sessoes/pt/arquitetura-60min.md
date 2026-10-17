# Oficina: uma decisão que dá para defender

## Objetivo, público e cenário

Oficina proposta de 60 minutos para pessoas que já conhecem HTTP; individual ou em duplas. Não representa evento realizado, inscrição ou turma confirmada. Entrega: um ADR que compara alternativas, usa um experimento e explicita uma condição de revisão. Requer apenas navegador e editor; terminal é opcional.

Cenário inteiramente fictício: um serviço recebe 20 pedidos/s durante dez segundos e depois não recebe nada. Dois workers processam uma mensagem/s cada, sem falhas. O requisito do exercício é concluir todos os pedidos aceitos em até 30 segundos após o fim do pico. Esse prazo foi criado para o exercício e não descreve um produto real. A capacidade pode ser alterada instantaneamente na simulação; custos e tempo de provisionamento não são medidos.

Prepare a demo, o guia de filas, o template ADR e o caderno. Faça o experimento uma vez antes de facilitar. Ofereça os materiais em texto e explique os contadores em voz alta. Em dupla, definam operador e revisor e troquem aos 25 minutos. Ninguém precisa compartilhar nome, código privado ou dados reais.

## Agenda e instruções de facilitação

| Minutos | Atividade | Pergunta de facilitação | Entrega |
| --- | --- | --- | --- |
| 0–10 | Ler contexto e restrições | “O prazo é para aceitar ou concluir? O que sabemos e o que supomos?” | Hipóteses e critério de aceitação. |
| 10–25 | Prever e executar experimento | “Qual conta deveria fechar? O que alteramos entre os testes?” | Tabela de três execuções. |
| 25–40 | Comparar alternativas | “Quem espera, quem paga e quem pode repetir o efeito?” | Matriz com pelo menos duas alternativas. |
| 40–55 | Escrever ADR | “Qual evidência sustenta a decisão? Qual risco fica aberto?” | ADR com condição de revisão. |
| 55–60 | Revisão por pares ou autorrevisão | “O que invalidaria a recomendação?” | Um comentário e uma revisão concreta. |

## Exercício 1 — hipótese e capacidade

Antes de abrir a demo, anote: quantas mensagens chegam, quantas terminam durante o pico, quanto fica pendente e quanto demora a recuperar com dois workers. Declare a hipótese “uma tentativa bem-sucedida por worker por segundo”. O requisito é sobre todos os pedidos aceitos; não mude silenciosamente para “fila vazia” descartando trabalho.

## Exercício 2 — três execuções controladas

1. A: reinicie, entradas = 20, workers = 2, falhas = 0; avance dez segundos. Anote chegadas, concluídas, pendentes e DLQ. Mude entradas = 0, mantenha dois workers e observe até drenar. Conte segundos adicionais.
2. B: repita o pico após reiniciar e configurar os mesmos controles. Somente depois dos dez segundos, ponha entradas = 0 e workers = 8. Avance dez segundos duas vezes e depois três passos de um segundo. Registre em qual passo a fila esvazia.
3. C: reinicie; use entradas = 20, workers = 8, falhas = 0 durante dez segundos. Registre o backlog. Mantenha entradas = 20 por mais dez segundos. Ele diminuiu? Explique o que isso diz sobre sobrecarga permanente.

Reiniciar limpa o estado, não necessariamente os controles: configure os três a cada repetição. No modo offline, faça uma tabela com saldo = pendentes anteriores + entradas − concluídas; concluídas não podem superar o trabalho disponível. Não use a demo para medir custo ou latência real.

## Exercício 3 — alternativas e consequências

Compare: A, manter dois workers e aceitar atraso; B, aceitar o pico e usar oito workers após ele; C, limitar a aceitação a dois pedidos/s e rejeitar o restante. C é uma política hipotética analisada no papel, não uma opção de admissão configurável da demo.

Para cada alternativa, escreva: prazo para concluir o trabalho aceito, efeito para o usuário, necessidade de idempotência, custo ainda desconhecido e falha que precisa ser observada. Acrescente uma alternativa própria somente se explicar as novas hipóteses. Uma rejeição explícita exige contrato de erro e política segura de nova tentativa; não a descreva como trabalho concluído.

## Exercício 4 — ADR e revisão

Preencha: título/status; contexto/restrições; alternativas; decisão; evidência; consequências; condição de revisão. Inclua uma alternativa rejeitada e por quê. O revisor deve localizar o número da execução que sustenta a escolha, uma hipótese não medida e um sinal que invalidaria a decisão. Na revisão individual, leia o ADR como se outra pessoa fosse operar o sistema.

## Gabarito de cálculo

- Pico com dois workers: 200 chegadas, 20 concluídas, 180 pendentes, zero DLQ. Recuperação A = 90 s; excede o requisito de 30 s.
- B: os mesmos 180 pendentes no fim do pico. Oito workers concluem 176 em 22 s e as quatro restantes no segundo 23. Total do relógio = 33 s; recuperação = 23 s, dentro do requisito. Após 20 s adicionais, ainda há 20 pendentes. Há sete segundos de margem no modelo, sem medir provisionamento ou I/O.
- C da execução: oito workers durante o pico deixam (20 − 8) × 10 = 120 pendentes. Mais dez segundos com as mesmas entradas levam a 240 pendentes: +12/s. Oito workers não resolvem a entrada permanente de 20/s.
- Política de rejeição no papel: aceitar dois/s por dez segundos permite concluir 20 e rejeitar explicitamente 180, sob as hipóteses de processamento do modelo. Atende o prazo dos aceitos, mas não aceita todos os pedidos. Isso exige acordo de produto; rejeitar não é perder silenciosamente nem concluir.

## Exemplo de ADR preenchido

**Título/status:** Recuperar pico com capacidade temporária — proposta para o cenário fictício.

**Contexto:** 200 pedidos em dez segundos; dois workers concluem 20 nesse intervalo. Os aceitos devem terminar até 30 s após o pico. Sem novas chegadas e sem falhas nos testes.

**Alternativas:** manter dois workers recupera em 90 s e não atende o prazo; rejeitar acima de dois/s muda o contrato de aceitação; elevar a oito após o pico recupera em 23 s no modelo.

**Decisão/evidência:** escolher oito workers após o pico para este exercício, com admissão e capacidade limitadas. Execução B: 180 pendentes, 176 concluídas em 22 s, quatro no passo seguinte. Não afirmar que autoscaling real é instantâneo.

**Consequências:** custo maior durante recuperação; exige disponibilidade de capacidade, chave idempotente durável, limite de tentativas e procedimento de DLQ. Provisionamento, latência, ordenação, persistência e custo ficam por validar num ambiente representativo. Efeitos externos exigem garantias próprias, além de uma transação local.

**Condição de revisão:** antes de produção, validar o prazo incluindo provisionamento e I/O; se o trabalho aceito ultrapassar os 30 s após o pico, ou a entrada não cessar, reavaliar capacidade e política de admissão. Observar idade da mensagem mais antiga, taxa de conclusão, DLQ e rejeições. Não basta medir quantidade.

## Critério de conclusão e extensão

O ADR passa na revisão se conserva as 200 mensagens, compara ao menos duas alternativas, relaciona a decisão ao prazo, reconhece uma hipótese não medida e inclui condição verificável de revisão. Outras decisões são válidas se explicitarem o compromisso de produto e sustentarem a conta; o gabarito não define uma arquitetura universal.

Se sobrar tempo, introduza uma falha depois do efeito e antes da confirmação. Explique por que repetir exige idempotência e por que o Set do starter não sobrevive a reinício. Para estudo posterior, execute o starter e escreva um teste de repetição. Isso não faz parte dos 60 minutos nem exige instalar nada para concluir a oficina.

## Recursos e preparação

- [Demo de fila](https://lagrotti.dev/recursos/demos/queue)
- [Guia de filas](https://lagrotti.dev/recursos/guias/filas)
- [Template ADR](https://lagrotti.dev/recursos/templates/adr)
- [Starter de worker](https://lagrotti.dev/recursos/templates/worker)
- [Caderno de participante](caderno-participante.md)
