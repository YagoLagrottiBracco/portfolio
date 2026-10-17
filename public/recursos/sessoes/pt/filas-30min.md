# Filas sem mágica

## Objetivos e preparação

Proposta de palestra de 30 minutos para pessoas de backend que conhecem HTTP. Material disponível para estudo ou convite; não documenta uma apresentação realizada. Ao final, a pessoa deverá prever o backlog do cenário, distinguir trabalho pendente de perda e explicar o limite de retries e a necessidade de idempotência.

Prepare navegador, cronômetro e editor. Abra a demo, o guia de filas e este material. Faça os testes abaixo antes da sessão. Use somente dados fictícios. Não peça credenciais nem registre nomes ou respostas sem acordo. Em dupla, uma pessoa opera e outra anota; troquem na metade. Na condução individual, pare o cronômetro para registrar a previsão antes de executar.

## Roteiro do facilitador — 30 minutos

| Tempo | Ação e fala de apoio | Evidência de aprendizagem |
| --- | --- | --- |
| 0–5 min | Apresente: “Receber um pedido não é concluir o trabalho”. Pergunte se uma confirmação pode anteceder o resultado. Delimite um pico, sem métricas de um sistema real. | A pessoa distingue aceitação de conclusão. |
| 5–15 min | Execute o exercício A. Peça a previsão antes do clique. Avance dez segundos; depois zere entradas e acompanhe a recuperação. | Previsão, conta e observação registradas. |
| 15–25 min | Execute B por quatro minutos. Nos seis seguintes, discuta C e desenhe o intervalo entre efeito e confirmação. | Limite de tentativas e risco de duplicação explicados. |
| 25–30 min | Peça a saída escrita e compare com o gabarito. Use a pergunta “O que faria você mudar esta decisão?”. | Uma escolha com limite e condição de revisão. |

Abertura sugerida: “Hoje vamos usar um modelo pequeno para testar uma hipótese, não escolher o melhor broker. Uma fila permite esperar; não cria capacidade de processamento”.

## Exercício A — capacidade e recuperação

1. Reinicie a demo e configure explicitamente entradas = 20, workers = 2, falhas = 0. Reiniciar limpa o estado, sem necessariamente mudar os controles.
2. Antes de avançar, preveja chegadas, conclusões e pendências após dez segundos. Escreva a conta.
3. Avance dez segundos uma vez. Anote os contadores. Mude entradas para 0, mantenha dois workers e falhas = 0.
4. Preveja quantos segundos adicionais serão necessários. Avance dez segundos nove vezes e confira a fila vazia.
5. Discuta: o que acontece se as 20 entradas/s nunca pararem?

Resultado esperado: usar conservação de mensagens para explicar a diferença entre um pico e um déficit permanente. Se a conta divergir, confira os controles e reinicie antes de repetir; não altere o resultado para caber na hipótese.

## Exercício B — destino das falhas

Reinicie; entradas = 1, workers = 1, falhas = 100. Avance um segundo. Zere entradas e avance mais dois segundos, um de cada vez. Registre pendências, concluídas e DLQ após cada passo. Pergunte: “DLQ significa que o efeito aconteceu? Quem decide se é seguro reprocessar?”.

## Exercício C — uma confirmação perdida

Desenhe: receber pedido fictício X → registrar o efeito → processo cai antes de confirmar → X é entregue novamente. Explique por que um Set em memória não protege após reinício. Proponha uma chave de negócio e uma forma de tornar efeito e registro duráveis de maneira atômica. Para um efeito externo, como pagamento, discuta também a chave de idempotência na API externa: uma transação local não cobre sozinha esse efeito.

## Gabarito comentado

- A: em dez passos chegam 200 mensagens, 20 concluem e 180 ficam pendentes. Saldo = (20 − 2) × 10. Com entrada zero, 180 / 2 = 90 segundos adicionais; o relógio termina em 100. Se a entrada continuar, o saldo é +18/s e a fila não drena.
- B: após o primeiro passo, pendentes = 1, concluídas = 0, DLQ = 0. Após o segundo, os mesmos totais. No terceiro, pendentes = 0, concluídas = 0, DLQ = 1. São três tentativas totais, não três retries além da inicial. A mensagem saiu do ciclo automático; a causa ainda pede investigação e um procedimento de reprocessamento.
- C: use uma chave estável para a mesma operação de negócio. No caso de efeito no mesmo banco, imponha unicidade e registre efeito + deduplicação na mesma transação durável; teste concorrência e repetição após reinício. Um Set protege apenas a execução local. Para efeitos externos, use a garantia idempotente do provedor e uma estratégia de reconciliação; não prometa “exactly once” só porque há retries.

## Limites, acessibilidade e saída

O modelo usa um segundo por passo e uma tentativa por worker. Falhas dependem deterministicamente do ID; não são uma amostra aleatória de disponibilidade. Há três tentativas, limite de 5.000 pendências, sem backoff, persistência, partições ou latência de rede. Não extrapole a vazão para VMAGeste, PulseWatch ou um broker real.

Leia os contadores em voz alta e ofereça a tabela em texto. Sem navegador ou rede, use o caderno: subtraia duas conclusões de vinte chegadas em cada linha; o mesmo gabarito permite a sessão offline. Sem terminal, o exercício C pode ser feito no papel. O starter é uma extensão opcional, não um pré-requisito.

Saída individual: escreva (1) por que 180 pendentes não provam perda, (2) qual sinal observaria além da quantidade e (3) uma condição que levaria a limitar entrada. Resposta aceitável: contabilidade fecha em 200; observar idade da mensagem mais antiga e taxa de conclusão; reavaliar quando o atraso exceder o requisito do produto. Números e limite devem ser explícitos, sem inventar um requisito real.

## Recursos e preparação

- [Demo de fila](https://lagrotti.dev/recursos/demos/queue)
- [Guia de filas](https://lagrotti.dev/recursos/guias/filas)
- [Template ADR](https://lagrotti.dev/recursos/templates/adr)
- [Starter de worker](https://lagrotti.dev/recursos/templates/worker)
- [Caderno de participante](caderno-participante.md)
