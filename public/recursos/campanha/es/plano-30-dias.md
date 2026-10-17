# Plan editorial — 30 días

Fechas sugeridas: 19/10–17/11/2026. Revisa antes de publicar o enviar. Este archivo no programa ni envía mensajes. Elige una versión de idioma por público; no hace falta publicar las tres. No hay resultados de audiencia ni participaciones externas confirmadas.

## 2026-10-19 · LinkedIn

<!-- d01-kit -->

Una biblioteca para probar decisiones de ingeniería

Reuní herramientas y materiales abiertos para convertir una conversación de arquitectura en un experimento: comparador JSON, revisor de claves .env, simulador de cola y starter de worker en TypeScript.

El recorrido de cinco minutos es sencillo: compara dos contratos, genera una sobrecarga y ejecuta las pruebas del starter. Cada recurso explica sus límites; la simulación no usa datos de producción. Hay materiales en portugués, inglés y español.

¿Qué decisión aparece más en tu equipo? Empieza por el kit y elige un experimento.

https://lagrotti.dev/es/recursos/campanhas/kit-engenharia?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d01-kit-es

---

## 2026-10-20 · WhatsApp

<!-- d02-json -->

¿Cambió un contrato?

Aquí tienes un comparador JSON que muestra campos añadidos, eliminados y modificados sin confundir el orden de claves con cambios. Pruébalo con ejemplos ficticios en el navegador para tu próxima revisión de payload.

https://lagrotti.dev/es/recursos/ferramentas/json?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d02-json-es

---

## 2026-10-21 · Comunidad de desarrollo

<!-- d03-fila-lab -->

Ejercicio abierto: predecir la acumulación antes de ejecutar

Comparto una demo didáctica de colas para discusión técnica. Desafío: configura 20 entradas/s, dos workers y 0% de fallos. Antes de avanzar diez pasos, anota cuánto trabajo esperas en la cola. Después detén las entradas y estima el tiempo de vaciado.

El modelo intenta un mensaje por worker por segundo; limita los reintentos a tres intentos. No incluye backoff, persistencia ni particiones. Sirve para discutir capacidad y recuperación, sin estimar el rendimiento de un broker real.

Si lo pruebas, ¿qué supuesto cambiarías primero: capacidad, duración del pico o rechazo? Comparte tu razonamiento con datos ficticios.

https://lagrotti.dev/es/recursos/demos/queue?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d03-fila-lab-es

---

## 2026-10-22 · LinkedIn

<!-- d04-backlog -->

Una cola compra tiempo; la capacidad paga la cuenta

En este modelo, 20 entradas por segundo y dos workers dejan 18 mensajes por segundo pendientes. Después de diez pasos hay 180 mensajes en la cola.

La cola absorbe el pico sin eliminar el trabajo. Con las entradas detenidas, dos workers necesitan otros 90 pasos para vaciarla. Si siguen llegando 20 mensajes/s, la acumulación crece.

El experimento permite cambiar las variables. Antes de elegir una cola, pregunta: ¿cuánto retraso tolera el producto y cuál es el plan para recuperar capacidad?

https://lagrotti.dev/es/recursos/laboratorio/sobrecarga?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d04-backlog-es

---

## 2026-10-23 · Propuesta para newsletter

<!-- d05-pitch-worker -->

Asunto: Recurso propuesto: worker TypeScript para explorar reintentos

Hola, equipo editorial.

Quisiera proponer un recurso gratuito para una edición sobre backend o sistemas orientados a eventos: un starter TypeScript ejecutable con pruebas, deduplicación en memoria, reintentos limitados y ejemplo de cola de fallos.

Texto sugerido: “Ejecuta un worker pequeño, provoca un fallo y observa el límite de reintentos. Un punto de partida para discutir idempotencia antes de adoptar un broker.”

Requiere Node.js 22 o superior y usa licencia MIT. El README explica la ejecución; la deduplicación es local al proceso y no es una solución lista para producción. Si encaja en su selección, el enlace reúne descarga y contexto.

Gracias por evaluarlo,
Yago Lagrotti Bracco

https://lagrotti.dev/es/recursos/templates/worker?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d05-pitch-worker-es

---

## 2026-10-24 · WhatsApp

<!-- d06-adr -->

Una decisión que se puede revisar

Una plantilla ADR para contexto, alternativas, decisión y consecuencias. Mi parte favorita es la condición de revisión: ¿qué tendría que cambiar para reconsiderar la elección? Descárgala y complétala en texto.

https://lagrotti.dev/es/recursos/templates/adr?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d06-adr-es

---

## 2026-10-25 · LinkedIn

<!-- d07-guia-filas -->

¿La respuesta necesita el resultado ahora?

Esa pregunta viene antes de elegir un broker. Si la respuesta necesita el resultado inmediato y el volumen y las dependencias caben en el presupuesto de latencia, una llamada directa puede bastar.

Una cola tiene sentido cuando recibir y terminar pueden ser etapas distintas, los picos superan la capacidad sostenida y el trabajo puede repetirse con seguridad. Añade decisiones sobre retención, orden, idempotencia y fallos.

Escribí una guía breve con criterios y límites. Úsala para revisar una decisión de tu contexto: ¿qué requisito exige procesamiento asíncrono?

https://lagrotti.dev/es/recursos/guias/filas?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d07-guia-filas-es

---

## 2026-10-26 · LinkedIn

<!-- d08-env -->

El nombre de una variable también es un contrato

Un despliegue puede fallar porque una clave obligatoria no llegó al entorno. Para revisar ese contrato, creé una herramienta que compara nombres de variables de una referencia .env.example con otra configuración.

El informe señala faltantes, extras, duplicados y líneas inválidas sin reproducir valores. El procesamiento ocurre en el navegador. Usa valores ficticios: no es un parser completo de dotenv ni verifica que un secreto sea correcto.

¿Qué revisión de configuración harías antes del próximo despliegue?

https://lagrotti.dev/es/recursos/ferramentas/env?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d08-env-es

---

## 2026-10-27 · WhatsApp

<!-- d09-idempotencia -->

¿Y si el mensaje llega dos veces?

Los reintentos plantean una pregunta: ¿repetir la operación repite su efecto? Esta explicación breve de idempotencia separa la identidad del mensaje del efecto de negocio. Lleva un ejemplo ficticio de pago o pedido al equipo.

https://lagrotti.dev/es/recursos/glossario/idempotencia?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d09-idempotencia-es

---

## 2026-10-28 · Comunidad de desarrollo

<!-- d10-worker-lab -->

Laboratorio pequeño: prueba fallos antes del broker

Propongo un ejercicio con el starter TypeScript de la biblioteca. Descárgalo y ejecuta npm install, npm test y npm start con Node.js 22+. Lee la prueba de deduplicación y el límite de intentos antes de cambiar código.

Describe dos escenarios: mensaje repetido en el mismo proceso y repetición después de reiniciarlo. Un Set en memoria no resuelve el segundo. ¿Qué almacenamiento y frontera transaccional conectarían el efecto de negocio con la clave de idempotencia?

El starter usa licencia MIT y es didáctico. Si compartes una solución, incluye prueba e hipótesis de fallo; no uses datos reales de clientes.

https://lagrotti.dev/es/recursos/templates/worker?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d10-worker-lab-es

---

## 2026-10-29 · LinkedIn

<!-- d11-clone -->

Un benchmark necesita contexto para ser útil

Comparar JSON.parse/stringify y structuredClone solo por el menor tiempo deja preguntas abiertas. ¿Qué tipos deben conservarse? ¿Qué tamaño tenían los datos? ¿Era el mismo runtime?

Publiqué un experimento con datos JSON sintéticos, calentamiento, alternancia del orden y muestras descargables. No prueba Date, Map, ciclos ni transferibles. Una medición local no convierte una estrategia en ganadora universal.

Lee el método, ejecuta el script en tu entorno y compara por tamaño. ¿Qué caso de uso cambiaría tu elección aunque tardara más?

https://lagrotti.dev/es/recursos/benchmarks/json-clone?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d11-clone-es

---

## 2026-10-30 · Propuesta para newsletter

<!-- d12-pitch-filas -->

Asunto: Para su selección: una cola que puedes sobrecargar

Hola, equipo editorial.

Quisiera proponer una demo interactiva para una edición sobre confiabilidad: permite ajustar entradas, workers y fallos para observar acumulación, reintentos y mensajes fallidos. No requiere cuenta.

Texto sugerido: “Antes de añadir una cola, predice la acumulación de un pico de diez segundos y comprueba la estimación en el navegador.”

El modelo es didáctico, sin datos de producción, backoff ni persistencia. La página declara esos límites y permite repetir el ejercicio. Puede complementar una discusión sobre capacidad. Comparto el enlace para evaluación.

Gracias,
Yago Lagrotti Bracco

https://lagrotti.dev/es/recursos/demos/queue?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d12-pitch-filas-es

---

## 2026-10-31 · WhatsApp

<!-- d13-reproduzir -->

Repite la medición en tu runtime

Aquí hay un experimento de copia de JSON con script y datos sintéticos. Ejecútalo en tu entorno y compara medianas por tamaño. Lo útil es registrar método y límites, en vez de elegir una API por un número aislado. Aquí está el guion.

https://lagrotti.dev/es/recursos/laboratorio/copias?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d13-reproduzir-es

---

## 2026-11-01 · LinkedIn

<!-- d14-caso-vmageste -->

Lee el flujo antes de elegir la herramienta

Una discusión sobre eventos se vuelve concreta al dibujar las etapas: dónde entran los datos, dónde se procesan y cómo llegan a las consultas. El caso de VMAGeste usa ese flujo como entrada a las decisiones de arquitectura.

Ejercicio de lectura: identifica una frontera asíncrona, anota qué supuesto atiende y busca qué habría que observar en operación. Usa el caso como contexto y la demo para probar capacidad con datos ficticios.

¿Qué buscas primero en un diagrama para entender la recuperación de un fallo?

https://lagrotti.dev/es/projetos/vmageste?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d14-caso-vmageste-es

---

## 2026-11-02 · LinkedIn

<!-- d15-oficina -->

Una hora para escribir una decisión defendible

Preparé un taller autoguiado con un problema delimitado: entran 20 pedidos/s, se procesan dos por segundo y el pico dura diez segundos. La tarea es modelar la acumulación y registrar una decisión en un ADR.

El guion divide una hora entre contexto, experimento, alternativas, escritura y revisión. Puedes hacerlo solo o en pareja, con navegador y editor de texto. Incluye ejercicios, resultados esperados y soluciones para guiar la discusión.

Es material disponible, sin inscripción ni evento programado. ¿Qué condición te haría rechazar trabajo en vez de encolarlo?

https://lagrotti.dev/es/recursos/campanhas/oficina-arquitetura?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d15-oficina-es

---

## 2026-11-03 · WhatsApp

<!-- d16-pico -->

Desafío de dos minutos

20 entradas/s, dos workers, 0% de fallos, diez segundos. ¿Cuánto queda pendiente? Predice antes de abrir la demo y después detén las entradas para medir recuperación. El ejercicio distingue un pico de un déficit permanente de capacidad.

https://lagrotti.dev/es/recursos/laboratorio/sobrecarga?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d16-pico-es

---

## 2026-11-04 · Comunidad de desarrollo

<!-- d17-adr-review -->

Revisión de ADR: ¿qué evidencia cambiaría tu decisión?

Ejercicio para una discusión de arquitectura: usa el escenario del taller autoguiado y escribe un ADR con contexto, dos alternativas, decisión, consecuencias y condición de revisión. Evita justificarlo solo por preferencia de herramienta.

Una alternativa puede mantener la capacidad y aceptar retraso; otra puede aumentar workers o rechazar entradas por encima de un límite. Compara recuperación, coste, duplicación y lo que percibe el usuario. Declara qué supuestos no midió el experimento.

Al revisar, busca una condición verificable que obligue a reconsiderar la elección. Hay una respuesta de ejemplo, sin presentar una única arquitectura correcta. ¿Qué supuesto falta en tu ADR?

https://lagrotti.dev/es/recursos/campanhas/oficina-arquitetura?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d17-adr-review-es

---

## 2026-11-05 · LinkedIn

<!-- d18-monolito -->

¿Un límite de código debe convertirse en servicio?

Separar responsabilidades es una decisión; separar despliegues es otra. Un límite puede empezar dentro de un monolito modular y después ganar operación independiente si aparece una necesidad concreta.

La guía compara autonomía, contratos y coste operativo entre monolito modular y servicios separados. Un proceso nuevo también añade red, observabilidad y fallos parciales.

Antes de dividir, escribe qué restricción resuelve la separación y cuándo revisarías la decisión. ¿Qué parte de tu sistema necesita autonomía operativa hoy?

https://lagrotti.dev/es/recursos/guias/monolito?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d18-monolito-es

---

## 2026-11-06 · Propuesta para newsletter

<!-- d19-pitch-oficina -->

Asunto: Material de estudio: taller de arquitectura de 60 minutos

Hola, equipo editorial.

Quisiera proponer material para una sección de estudio o actividades de equipo: un taller de 60 minutos para comparar alternativas y escribir un ADR basado en un experimento de capacidad.

Texto sugerido: “Un problema, una simulación y una decisión registrada. Trabaja solo o en pareja con navegador y editor de texto.”

La guía incluye tiempos, ejercicios, resultados esperados y soluciones. El escenario es ficticio y no requiere inscripción. Es una propuesta y material autoguiado disponible, sin afirmar que hubo una presentación o grupo anterior. El enlace reúne contexto y descargas para evaluación.

Gracias,
Yago Lagrotti Bracco

https://lagrotti.dev/es/recursos/palestras/arquitetura?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d19-pitch-oficina-es

---

## 2026-11-07 · WhatsApp

<!-- d20-env-check -->

Revisión rápida de configuración

Crea dos .env ficticios: una referencia con API_URL y WORKER_TOKEN, y otro con API_URL repetido. El revisor muestra la clave faltante y el duplicado sin reproducir valores en el informe. Aquí tienes la herramienta.

https://lagrotti.dev/es/recursos/ferramentas/env?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d20-env-check-es

---

## 2026-11-08 · LinkedIn

<!-- d21-caso-pulsewatch -->

¿Qué observar además de la longitud de la cola?

Dos colas del mismo tamaño pueden representar situaciones muy distintas. Una que se vacía rápido tras un pico pide una lectura; un mensaje antiguo que no avanza pide otra.

Para estudiar esa diferencia, lee el caso PulseWatch junto con la guía de colas. Úsalo como contexto de producto y operación sin convertir los números del simulador en métricas del proyecto.

Anota tres señales: edad del mensaje más antiguo, tasa de finalización y destino de fallos. ¿Qué señal ayudaría a elegir entre esperar, escalar e investigar?

https://lagrotti.dev/es/projetos/pulsewatch?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d21-caso-pulsewatch-es

---

## 2026-11-09 · LinkedIn

<!-- d22-retries -->

¿Adónde va el tercer fallo?

Un reintento necesita un límite y un destino posterior. En la demo didáctica, un mensaje que falla tres veces llega a la cola de fallos. Eso termina el ciclo automático del modelo, pero no explica cómo corregir la causa.

La discusión operativa debe decir quién investiga, cómo identificar el mensaje y cuándo es seguro reprocesarlo. No basta con cambiar un bucle infinito por un almacén de errores sin responsable.

El glosario explica DLQ y lo conecta con el ejercicio. Si un mensaje llegara hoy a la cola de fallos, ¿tu equipo sabría qué hacer después?

https://lagrotti.dev/es/recursos/glossario/dead-letter?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d22-retries-es

---

## 2026-11-10 · WhatsApp

<!-- d23-json-video -->

Mira un contrato cambiar

Una grabación breve muestra dos versiones de un evento y los campos que cambiaron. Puedes verla y repetir la comparación con ejemplos ficticios. Un punto de partida rápido para revisar contratos.

https://lagrotti.dev/es/recursos/videos/json?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d23-json-video-es

---

## 2026-11-11 · Comunidad de desarrollo

<!-- d24-benchmark-colab -->

Invitación abierta: reproducir un benchmark con método

Abrí un brief para reproducir el experimento de copia de JSON en otro runtime y comparar resultados con el mismo método. Incluye script, muestras y limitaciones.

Una contribución útil indica versión del runtime, sistema, CPU, comando y muestras brutas con datos sintéticos. Antes de comparar, revisa tamaños y garantías semánticas de cada API. Las diferencias motivan hipótesis; no prueban una regla universal.

El brief explica revisión y crédito. No hay coautores confirmados; cualquier publicación conjunta depende de revisar el método y obtener permiso. Si te interesa esta reproducción, lee el alcance y propón una contribución.

https://lagrotti.dev/es/recursos/colaboracoes/reproduzir-benchmark?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d24-benchmark-colab-es

---

## 2026-11-12 · LinkedIn

<!-- d25-caso-eurologado -->

Del payload al contexto del producto

Un diff muestra que un campo cambió. Decidir si importa requiere contexto: quién lo produce, quién lo consume y qué comportamiento depende de él.

Usa el caso Eurologado como ejercicio de lectura. Elige un flujo descrito y escribe un contrato ficticio mínimo. Después añade un campo y cambia un valor con el comparador JSON.

El ejercicio no reproduce contratos internos del proyecto. Conecta una herramienta con preguntas de producto: ¿el consumidor tolera el cambio? ¿La validación detectaría una incompatibilidad?

https://lagrotti.dev/es/projetos/eurologado?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d25-caso-eurologado-es

---

## 2026-11-13 · Propuesta para newsletter

<!-- d26-pitch-kit -->

Asunto: Propuesta para su selección: herramientas y ejercicios de ingeniería

Hola, equipo editorial.

Quisiera proponer el kit abierto de ingeniería para una selección de recursos prácticos. Reúne comparador JSON, revisor de claves .env, demo de cola, starter TypeScript y ejercicios de decisiones de arquitectura en portugués, inglés y español.

Texto sugerido: “Compara un contrato, provoca una sobrecarga y descarga un starter con pruebas. Una biblioteca para experimentar decisiones con datos ficticios.”

Los recursos explican sus límites y se exploran sin registro. No presento métricas de audiencia ni resultados de adopción; el enlace permite evaluar el material directamente. Si encaja en una edición, puedo aclarar método y alcance.

Gracias,
Yago Lagrotti Bracco

https://lagrotti.dev/es/recursos/campanhas/kit-engenharia?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d26-pitch-kit-es

---

## 2026-11-14 · WhatsApp

<!-- d27-charla -->

Guion de 30 minutos sobre colas

Preparé “Colas sin magia”: guion y material para discutir capacidad, reintentos, idempotencia y observabilidad en 30 minutos. Incluye ejercicios y soluciones. Propuesta disponible para invitaciones o estudio, sin evento programado.

https://lagrotti.dev/es/recursos/palestras/eventos?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d27-charla-es

---

## 2026-11-15 · LinkedIn

<!-- d28-decisao -->

Cambia “es mejor” por una condición observable

Un ADR útil no termina al elegir tecnología. Registra la restricción, la alternativa descartada y la señal que haría al equipo reconsiderar.

En el escenario ficticio del taller, una condición podría ser: si la cola no se vacía en el plazo requerido por el producto, revisar capacidad y política de admisión. El número debe venir del requisito o experimento, con los supuestos visibles.

La plantilla está en texto para adaptarla. Elige una decisión reciente: ¿qué consecuencia aceptaron y qué evidencia mostraría que su coste ya es demasiado alto?

https://lagrotti.dev/es/recursos/templates/adr?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d28-decisao-es

---

## 2026-11-16 · Comunidad de desarrollo

<!-- d29-comunidade -->

¿Usaste un recurso? Muestra una aplicación verificable

La biblioteca tiene una invitación abierta para quien aplique un recurso en una demostración pública. Una propuesta útil muestra qué recurso se usó, qué se adaptó y cómo otra persona puede verificar el resultado.

Puede ser una prueba de deduplicación, un ADR con experimento reproducible o una comparación de contratos con datos sintéticos. Incluye enlace público, crédito deseado y permiso de publicación. No compartas datos personales de terceros ni material confidencial.

Las propuestas se revisan; enviar no garantiza publicación. La página explica el proceso y permite preparar y revisar la propuesta antes de enviarla. ¿Qué adaptación haría el recurso más útil en tu contexto?

https://lagrotti.dev/es/recursos/comunidade/sua-aplicacao?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d29-comunidade-es

---

## 2026-11-17 · LinkedIn

<!-- d30-proximo -->

Elige un experimento y registra lo aprendido

Si llegaste a la biblioteca por una publicación, aquí va un recorrido de lectura a práctica: compara dos payloads ficticios, sobrecarga la cola, prueba el starter y escribe un ADR con condición de revisión.

No hace falta adoptar una tecnología nueva para aprovechar el ejercicio. El resultado puede ser confirmar que basta una llamada directa, descubrir un supuesto sin probar o explicar mejor la recuperación de un fallo.

El kit reúne recorridos y descargas en tres idiomas. ¿Qué experimento elegirías para tu próxima conversación de ingeniería? Anota la predicción antes de ejecutar y compara después.

https://lagrotti.dev/es/recursos/campanhas/kit-engenharia?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d30-proximo-es
