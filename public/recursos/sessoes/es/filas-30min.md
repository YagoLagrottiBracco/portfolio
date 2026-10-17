# Colas sin magia

## Objetivos y preparación

Propuesta de charla de 30 minutos para desarrolladores backend que conocen HTTP. Material disponible para estudio o invitaciones; no documenta una charla realizada. Al terminar, la persona deberá predecir la acumulación, distinguir trabajo pendiente de pérdida y explicar reintentos limitados e idempotencia.

Prepara navegador, cronómetro y editor. Abre la demo, la guía de colas y este documento. Ejecuta los ejercicios antes de facilitar. Usa datos ficticios. No pidas credenciales ni registres nombres o respuestas sin acuerdo. En parejas, una persona opera y otra anota; intercambien a mitad. A solas, pausa el cronómetro para escribir la predicción antes de ejecutar.

## Guion del facilitador — 30 minutos

| Tiempo | Acción y frase sugerida | Evidencia de aprendizaje |
| --- | --- | --- |
| 0–5 min | Presenta: “Recibir un pedido no es terminar el trabajo”. Pregunta si la confirmación puede preceder al resultado. Delimita un pico sin atribuir métricas a un sistema real. | Distingue recepción de finalización. |
| 5–15 min | Ejecuta A. Pide predicción antes del clic. Avanza diez segundos, detén entradas y observa recuperación. | Predicción, cálculo y observación registrados. |
| 15–25 min | Dedica cuatro minutos a B y seis a C. Dibuja el intervalo entre efecto y confirmación. | Explica límite de intentos y duplicación. |
| 25–30 min | Pide la respuesta escrita y compárala con las soluciones. Pregunta “¿Qué te haría cambiar esta decisión?”. | Una elección con límites y condición de revisión. |

Apertura sugerida: “Usaremos un modelo pequeño para probar un supuesto, no para elegir el mejor broker. Una cola permite esperar; no crea capacidad de procesamiento”.

## Ejercicio A — capacidad y recuperación

1. Reinicia y configura explícitamente entradas = 20, workers = 2, fallos = 0. Reiniciar borra el estado sin cambiar necesariamente los controles.
2. Antes de avanzar, predice entradas, finalizaciones y pendientes después de diez segundos. Escribe el cálculo.
3. Avanza diez segundos una vez y anota contadores. Pon entradas = 0; mantén dos workers y fallos = 0.
4. Predice los segundos adicionales necesarios. Avanza diez segundos nueve veces y comprueba la cola vacía.
5. Discute qué pasa si nunca se detienen las 20 entradas/s.

Resultado esperado: usar conservación de mensajes para distinguir un pico de un déficit permanente. Si observas una diferencia, revisa controles y reinicia antes de repetir; no cambies resultados para acomodar la hipótesis.

## Ejercicio B — destino de los fallos

Reinicia; entradas = 1, workers = 1, fallos = 100. Avanza un segundo. Pon entradas = 0 y avanza dos segundos más, uno por vez. Anota pendientes, completados y DLQ tras cada paso. Pregunta: “¿DLQ significa que ocurrió el efecto? ¿Quién decide si es seguro reprocesar?”.

## Ejercicio C — una confirmación perdida

Dibuja: recibir pedido ficticio X → registrar el efecto → el proceso cae antes de confirmar → X vuelve a entregarse. Explica por qué un Set en memoria no protege tras reiniciar. Propón una clave de negocio y una frontera duradera y atómica para efecto y registro. Para efectos externos, como pagos, discute la clave de idempotencia de la API externa: una transacción local no cubre por sí sola ese efecto.

## Soluciones comentadas

- A: en diez pasos llegan 200 mensajes, terminan 20 y quedan 180. Saldo = (20 − 2) × 10. Sin entradas, 180 / 2 = 90 segundos adicionales; el reloj termina en 100. Si las entradas continúan, el saldo es +18/s y la cola no se vacía.
- B: tras el primer paso, pendientes = 1, completados = 0, DLQ = 0. El segundo tiene los mismos totales. En el tercero, pendientes = 0, completados = 0, DLQ = 1. Son tres intentos totales, no tres reintentos además del inicial. El mensaje salió del ciclo automático; aún hace falta investigar la causa y definir reprocesamiento.
- C: usa una clave estable para la misma operación de negocio. Para efectos en la misma base, impón unicidad y guarda efecto y deduplicación en una transacción duradera; prueba concurrencia y repetición tras reinicio. Un Set protege solo una ejecución local. Para efectos externos, usa la garantía idempotente del proveedor y una estrategia de conciliación; no prometas “exactly once” solo por tener reintentos.

## Límites, accesibilidad y salida

Cada paso representa un segundo y cada worker intenta un mensaje. Los fallos dependen del ID de forma determinista; no son una muestra aleatoria de disponibilidad. Hay tres intentos, límite de 5.000 pendientes, sin backoff, persistencia, particiones ni latencia de red. No extrapoles rendimiento a VMAGeste, PulseWatch o un broker real.

Lee contadores en voz alta y ofrece la tabla en texto. Sin navegador o red, usa el cuaderno: resta dos finalizaciones de veinte entradas por fila; las mismas soluciones permiten la sesión offline. C puede hacerse en papel. El starter es una ampliación opcional, no un requisito.

Salida individual: escribe (1) por qué 180 pendientes no prueban pérdida, (2) una señal además de cantidad y (3) una condición para limitar entradas. Respuesta aceptable: la contabilidad suma 200; observar edad del mensaje más antiguo y tasa de finalización; reconsiderar cuando el retraso supere el requisito del producto. Declara límites y supuestos sin inventar un requisito real.

## Recursos y preparación

- [Demo de cola](https://lagrotti.dev/es/recursos/demos/queue)
- [Guía de colas](https://lagrotti.dev/es/recursos/guias/filas)
- [Plantilla ADR](https://lagrotti.dev/es/recursos/templates/adr)
- [Starter de worker](https://lagrotti.dev/es/recursos/templates/worker)
- [Cuaderno de participante](caderno-participante.md)
