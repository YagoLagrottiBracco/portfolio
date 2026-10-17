# Taller: una decisión defendible

## Objetivo, público y escenario

Taller propuesto de 60 minutos para personas que conocen HTTP, individual o en parejas. No representa un evento realizado, inscripción ni grupo confirmado. Entrega: un ADR que compara alternativas, usa un experimento y declara una condición de revisión. Solo requiere navegador y editor; la terminal es opcional.

Escenario completamente ficticio: un servicio recibe 20 pedidos/s durante diez segundos y luego no recibe nada. Dos workers procesan un mensaje/s cada uno, sin fallos. El requisito del ejercicio es terminar todos los pedidos aceptados en los 30 segundos posteriores al pico. El plazo se creó para el ejercicio y no describe un producto real. La capacidad cambia instantáneamente en la simulación; no se miden coste ni tiempo de aprovisionamiento.

Prepara demo, guía, plantilla ADR y cuaderno. Ejecuta el experimento antes de facilitar. Ofrece texto y lee contadores en voz alta. En parejas, elijan operador y revisor e intercambien al minuto 25. Nadie necesita compartir nombres, código privado o datos reales.

## Agenda e instrucciones de facilitación

| Minutos | Actividad | Pregunta | Entrega |
| --- | --- | --- | --- |
| 0–10 | Leer contexto y restricciones | “¿El plazo es para aceptar o terminar? ¿Qué sabemos y qué suponemos?” | Supuestos y criterio de aceptación. |
| 10–25 | Predecir y ejecutar | “¿Qué cálculo debe cerrar? ¿Qué cambiamos entre ejecuciones?” | Tabla de tres ejecuciones. |
| 25–40 | Comparar alternativas | “¿Quién espera, quién paga y quién puede repetir el efecto?” | Matriz de al menos dos alternativas. |
| 40–55 | Escribir ADR | “¿Qué evidencia apoya la decisión? ¿Qué riesgo queda abierto?” | ADR con condición de revisión. |
| 55–60 | Revisión en pareja o individual | “¿Qué invalidaría la recomendación?” | Un comentario y una revisión concreta. |

## Ejercicio 1 — supuesto y capacidad

Antes de abrir la demo, anota cuántos mensajes llegan, terminan durante el pico, quedan pendientes y cuánto tarda la recuperación con dos workers. Declara el supuesto “un intento exitoso por worker por segundo”. El requisito concierne a todos los pedidos aceptados; no lo cambies por “cola vacía” descartando trabajo.

## Ejercicio 2 — tres ejecuciones controladas

1. A: reinicia; entradas = 20, workers = 2, fallos = 0. Avanza diez segundos. Anota entradas, completados, pendientes y DLQ. Pon entradas = 0, mantén dos workers y observa hasta vaciar. Cuenta segundos adicionales.
2. B: reinicia y repite el pico con los mismos controles. Solo después de esos diez segundos, pon entradas = 0 y workers = 8. Avanza diez segundos dos veces y después tres pasos de un segundo. Anota cuándo se vacía.
3. C: reinicia; entradas = 20, workers = 8, fallos = 0 durante diez segundos. Anota pendientes. Mantén entradas = 20 otros diez segundos. ¿Disminuyeron? Explica qué indica sobre sobrecarga permanente.

Reiniciar borra el estado, sin cambiar necesariamente los controles: configura los tres cada vez. Sin conexión, usa pendientes = pendientes anteriores + entradas − completados; no puede haber más completados que trabajo disponible. No midas coste o latencia real con la demo.

## Ejercicio 3 — alternativas y consecuencias

Compara A, mantener dos workers y aceptar retraso; B, aceptar el pico y usar ocho después; C, aceptar solo dos pedidos/s y rechazar los demás. C es una política hipotética analizada en papel, no una opción de admisión configurable en la demo.

Para cada una, escribe plazo de finalización de lo aceptado, efecto para el usuario, idempotencia necesaria, coste desconocido y una señal de fallo. Añade otra alternativa solo si explicas los nuevos supuestos. Rechazar explícitamente requiere contrato de error y política segura de reintento; no es trabajo completado.

## Ejercicio 4 — ADR y revisión

Completa título/estado, contexto/restricciones, alternativas, decisión, evidencia, consecuencias y condición de revisión. Incluye una alternativa descartada y el motivo. El revisor debe encontrar la ejecución que apoya la elección, un supuesto no medido y una señal que la invalidaría. A solas, lee el ADR como si otra persona fuera a operar el sistema.

## Soluciones de cálculo

- Pico con dos workers: 200 entradas, 20 completados, 180 pendientes, cero DLQ. Recuperación A = 90 s; supera el requisito de 30 s.
- B: los mismos 180 pendientes al terminar el pico. Ocho workers completan 176 en 22 s y los cuatro restantes en el segundo 23. Reloj total = 33 s; recuperación = 23 s, dentro del requisito. Tras 20 s adicionales, quedan 20 pendientes. Hay siete segundos de margen en el modelo, sin medir aprovisionamiento ni I/O.
- Ejecución C: ocho workers durante el pico dejan (20 − 8) × 10 = 120 pendientes. Otros diez segundos con entradas continuas dejan 240: +12/s. Ocho workers no resuelven una entrada sostenida de 20/s.
- Política en papel: aceptar dos/s durante diez segundos permite completar 20 y rechazar explícitamente 180 bajo los supuestos del modelo. Cumple el plazo de los aceptados, pero no acepta todos los pedidos. Requiere acuerdo de producto; rechazar no es perder en silencio ni completar.

## Ejemplo de ADR completo

**Título/estado:** Recuperar un pico con capacidad temporal — propuesta para el escenario ficticio.

**Contexto:** 200 pedidos en diez segundos; dos workers completan 20 durante ese intervalo. Lo aceptado debe terminar en 30 s después del pico. Sin entradas posteriores ni fallos en las pruebas.

**Alternativas:** dos workers recuperan en 90 s y no cumplen; rechazar por encima de dos/s cambia el contrato de aceptación; subir a ocho tras el pico recupera en 23 s en el modelo.

**Decisión/evidencia:** elegir ocho workers después del pico para este ejercicio, con admisión y capacidad limitadas. Ejecución B: 180 pendientes, 176 completados en 22 s, cuatro en el siguiente paso. No afirmar que el escalado real sea instantáneo.

**Consecuencias:** mayor coste durante recuperación; requiere capacidad disponible, clave idempotente duradera, intentos limitados y procedimiento DLQ. Aprovisionamiento, latencia, orden, persistencia y coste quedan por validar en un entorno representativo. Los efectos externos necesitan garantías propias además de una transacción local.

**Condición de revisión:** antes de producción, validar el plazo incluyendo aprovisionamiento e I/O; si lo aceptado supera 30 s tras el pico, o las entradas no cesan, revisar capacidad y admisión. Observar edad del mensaje más antiguo, tasa de finalización, DLQ y rechazos, además de cantidad.

## Criterio de finalización y ampliación

El ADR pasa si conserva los 200 mensajes, compara al menos dos alternativas, relaciona la decisión con el plazo, reconoce un supuesto no medido e incluye una condición verificable de revisión. Otras decisiones son válidas si explicitan el compromiso de producto y sostienen el cálculo; las soluciones no definen una arquitectura universal.

Si sobra tiempo, introduce un fallo después del efecto y antes de confirmar. Explica por qué repetir requiere idempotencia y por qué el Set del starter no sobrevive al reinicio. Como estudio posterior, ejecuta el starter y escribe una prueba de repetición. Queda fuera de los 60 minutos y no hace falta instalar nada para completar el taller.

## Recursos y preparación

- [Demo de cola](https://lagrotti.dev/es/recursos/demos/queue)
- [Guía de colas](https://lagrotti.dev/es/recursos/guias/filas)
- [Plantilla ADR](https://lagrotti.dev/es/recursos/templates/adr)
- [Starter de worker](https://lagrotti.dev/es/recursos/templates/worker)
- [Cuaderno de participante](caderno-participante.md)
