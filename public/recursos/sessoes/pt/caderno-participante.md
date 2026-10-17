# Caderno de participante — filas e decisões de arquitetura

Material para os roteiros de 30 e 60 minutos. Cenário fictício, sem inscrição ou evento marcado. Salve uma cópia no seu editor ou imprima. Não precisa identificar a pessoa. Use dados fictícios; nada é enviado por este arquivo.

## 1. Minha previsão antes de executar

Entradas = 20/s; workers = 2; uma tentativa bem-sucedida por worker/s; pico = 10 s; depois entradas = 0.

- Hipótese que estou testando: ____________________
- Chegadas em dez segundos: ______
- Concluídas em dez segundos: ______
- Pendentes ao fim do pico: ______
- Segundos adicionais com dois workers: ______
- Conta usada: ____________________

## 2. Registro de observação

Reinicie e configure os três controles a cada execução. No modo offline, preencha usando conservação de mensagens.

| Execução | Entrada durante pico | Workers no pico/depois | Chegadas | Concluídas ao fim do pico | Pendentes ao fim do pico | Recuperação adicional |
| --- | --- | --- | --- | --- | --- | --- |
| A | 20/s por 10 s | 2 / 2 | ___ | ___ | ___ | ___ s |
| B | 20/s por 10 s | 2 / 8 | ___ | ___ | ___ | ___ s |
| C | 20/s por 20 s | 8 / 8, entrada continua | ___ | ___ após 10 s | ___ após 10 e 20 s | drena? ___ |

O que mudou entre A e B? ____________________
O que o experimento não mediu? ____________________
Chegadas = concluídas + pendentes + DLQ + rejeitadas. Minha contabilidade fecha? ______

## 3. Falhas e repetição — palestra de 30 minutos

Uma mensagem entra no primeiro passo; depois entrada zero. Um worker, falhas = 100%.

| Passo | Pendentes | Concluídas | DLQ |
| --- | --- | --- | --- |
| 1 | ___ | ___ | ___ |
| 2 | ___ | ___ | ___ |
| 3 | ___ | ___ | ___ |

Desenhe o intervalo: efeito registrado → queda antes da confirmação → entrega repetida.

- Chave da operação de negócio: ____________________
- O que precisa sobreviver ao reinício: ____________________
- Como evitar repetir um efeito externo: ____________________
- Quem investiga a DLQ e quando reprocessar: ____________________

## 4. Matriz de alternativas — oficina de 60 minutos

Requisito fictício: concluir os pedidos aceitos até 30 s após o pico. Para a rejeição, faça análise no papel; a demo não permite configurar essa política.

| Alternativa | Recuperação | Efeito para usuário | Custo/risco não medido | Atende o requisito? |
| --- | --- | --- | --- | --- |
| Manter 2 workers | ___ | ___ | ___ | ___ |
| Usar 8 depois do pico | ___ | ___ | ___ | ___ |
| Aceitar 2/s e rejeitar o resto | ___ | ___ | ___ | ___ |

## 5. Meu ADR

**Título e status:** ____________________

**Contexto e restrições:** ____________________

**Alternativas e motivo para descartar uma:** ____________________

**Decisão:** ____________________

**Evidência, incluindo a execução e os números:** ____________________

**Consequências e hipótese não medida:** ____________________

**Condição observável de revisão:** ____________________

## 6. Revisão e saída

- [ ] Minha conta conserva as mensagens.
- [ ] Comparei pelo menos duas alternativas e o prazo.
- [ ] Diferenciei rejeitar, concluir e perder.
- [ ] Registrei um risco e uma hipótese não medida.
- [ ] Minha condição de revisão pode ser verificada.

Comentário de revisão: ____________________
Alteração que fiz após revisar: ____________________
Próximo teste em um ambiente representativo: ____________________

Depois da tentativa, consulte os gabaritos em [Filas sem mágica](filas-30min.md) e [Oficina de arquitetura](arquitetura-60min.md). Não é necessário instalar o starter para concluir.
