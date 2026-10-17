import { tr } from "./types"
export const videoSteps = {
  queue: [
    tr(
      "Esta é uma simulação local: vinte entradas por segundo e dois workers.",
      "This is a local simulation: twenty arrivals per second and two workers.",
      "Esta es una simulación local: veinte entradas por segundo y dos workers."
    ),
    tr(
      "Após dez segundos, o backlog chega a 180 mensagens.",
      "After ten seconds, backlog reaches 180 messages.",
      "Tras diez segundos, hay 180 mensajes pendientes."
    ),
    tr(
      "Para recuperar, zere as entradas e aumente para cinquenta workers.",
      "To recover, set arrivals to zero and increase to fifty workers.",
      "Para recuperar, pon entradas en cero y aumenta a cincuenta workers."
    ),
    tr(
      "Avance dez segundos: a fila esvazia e o trabalho é concluído.",
      "Advance ten seconds: the queue drains and work completes.",
      "Avanza diez segundos: la cola se vacía y el trabajo termina."
    ),
    tr(
      "Com falhas permanentes, três tentativas levam a mensagem para a DLQ.",
      "With permanent failures, three attempts move a message to the DLQ.",
      "Con fallos permanentes, tres intentos llevan el mensaje a la DLQ."
    ),
  ],
  json: [
    tr(
      "Compare duas versões de um evento. Os dados ficam no navegador.",
      "Compare two versions of an event. Data stays in the browser.",
      "Compara dos versiones de un evento. Los datos quedan en el navegador."
    ),
    tr(
      "A comparação identifica a versão, o total e um novo campo de status.",
      "The comparison identifies the version, total and a new status field.",
      "La comparación identifica versión, total y un nuevo campo de estado."
    ),
    tr(
      "Os caminhos usam JSON Pointer para localizar cada mudança.",
      "Paths use JSON Pointer to locate each change.",
      "Las rutas usan JSON Pointer para localizar cada cambio."
    ),
    tr(
      "Uma entrada inválida mostra um erro sem executar o conteúdo.",
      "Invalid input shows an error without executing the content.",
      "Una entrada inválida muestra un error sin ejecutar el contenido."
    ),
    tr(
      "Restaure os dados e compare novamente. Use o link para experimentar.",
      "Restore the data and compare again. Follow the link to try it.",
      "Restaura los datos y compara otra vez. Sigue el enlace para probarlo."
    ),
  ],
}
