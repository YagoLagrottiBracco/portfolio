# Cuaderno de participante — colas y decisiones de arquitectura

Material para los guiones de 30 y 60 minutos. Escenario ficticio, sin inscripción ni evento programado. Guarda una copia en tu editor o imprime. No hace falta identificar a la persona. Usa datos ficticios; este archivo no envía nada.

## 1. Mi predicción antes de ejecutar

Entradas = 20/s; workers = 2; un intento exitoso por worker/s; pico = 10 s; después entradas = 0.

- Supuesto que pruebo: ____________________
- Entradas en diez segundos: ______
- Completados en diez segundos: ______
- Pendientes al final del pico: ______
- Segundos adicionales con dos workers: ______
- Cálculo: ____________________

## 2. Registro de observación

Reinicia y configura los tres controles cada vez. Sin conexión, completa usando conservación de mensajes.

| Ejecución | Entradas durante pico | Workers durante/después | Entradas | Completados al final del pico | Pendientes al final del pico | Recuperación adicional |
| --- | --- | --- | --- | --- | --- | --- |
| A | 20/s durante 10 s | 2 / 2 | ___ | ___ | ___ | ___ s |
| B | 20/s durante 10 s | 2 / 8 | ___ | ___ | ___ | ___ s |
| C | 20/s durante 20 s | 8 / 8, entradas continúan | ___ | ___ después de 10 s | ___ después de 10 y 20 s | ¿se vacía? ___ |

¿Qué cambió entre A y B? ____________________
¿Qué no midió el experimento? ____________________
Entradas = completados + pendientes + DLQ + rechazados. ¿Cierra mi contabilidad? ______

## 3. Fallos y repetición — charla de 30 minutos

Un mensaje entra en el primer paso; después, cero entradas. Un worker, fallos = 100%.

| Paso | Pendientes | Completados | DLQ |
| --- | --- | --- | --- |
| 1 | ___ | ___ | ___ |
| 2 | ___ | ___ | ___ |
| 3 | ___ | ___ | ___ |

Dibuja el intervalo: efecto registrado → caída antes de confirmar → entrega repetida.

- Clave de la operación de negocio: ____________________
- Qué debe sobrevivir al reinicio: ____________________
- Cómo evitar repetir un efecto externo: ____________________
- Quién investiga DLQ y cuándo reprocesar: ____________________

## 4. Matriz de alternativas — taller de 60 minutos

Requisito ficticio: completar lo aceptado en 30 s después del pico. Analiza el rechazo en papel; la demo no permite configurar esa política.

| Alternativa | Recuperación | Efecto para usuario | Coste/riesgo no medido | ¿Cumple? |
| --- | --- | --- | --- | --- |
| Mantener 2 workers | ___ | ___ | ___ | ___ |
| Usar 8 después del pico | ___ | ___ | ___ | ___ |
| Aceptar 2/s y rechazar el resto | ___ | ___ | ___ | ___ |

## 5. Mi ADR

**Título y estado:** ____________________

**Contexto y restricciones:** ____________________

**Alternativas y motivo para descartar una:** ____________________

**Decisión:** ____________________

**Evidencia con ejecución y números:** ____________________

**Consecuencias y supuesto no medido:** ____________________

**Condición observable de revisión:** ____________________

## 6. Revisión y salida

- [ ] Mi cálculo conserva mensajes.
- [ ] Comparé al menos dos alternativas con el plazo.
- [ ] Distinguí rechazo, finalización y pérdida.
- [ ] Registré un riesgo y un supuesto no medido.
- [ ] La condición de revisión es verificable.

Comentario de revisión: ____________________
Cambio que hice tras revisar: ____________________
Próxima prueba en entorno representativo: ____________________

Después de intentarlo, consulta las soluciones en [Colas sin magia](filas-30min.md) y [Taller de arquitectura](arquitetura-60min.md). No hace falta instalar el starter para terminar.
