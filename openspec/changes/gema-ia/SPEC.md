# Spec: Gema IA — Detalle de Comportamiento

## ADDED Requirements

### Requirement: Bottom Bar (Collapsed State)

El sistema DEBE mostrar un input fijo en la parte inferior del dashboard cuando no hay conversación activa.

**Comportamiento:**
- Input placeholder: "💎 Escribe tu transacción..."
- Botón de micrófono (deshabilitado en V1)
- Fixed position, no se scrollea
- Altura: 48-56px (1 línea)

#### Scenario: Display bottom bar
- GIVEN usuario está en dashboard
- THEN bottom bar con input es visible
- AND placeholder muestra "💎 Escribe tu transacción..."

#### Scenario: Submit triggers sheet
- GIVEN usuario escribe "Venta iPhone $2.5M Bold"
- WHEN presiona Enter o hace click en enviar
- THEN sheet lateral se abre
- AND conversación aparece en sheet

---

### Requirement: Sheet Lateral (Expanded State)

El sistema DEBE mostrar un sheet en el lado derecho cuando el usuario activa Gema.

**Comportamiento:**
- Sheet se abre desde la derecha
- Ancho: 400-500px (óptimo para chat)
- Background semi-transparente overlay
- Botón X o "Cerrar" para colapsar
- Scroll interno para conversación

#### Scenario: Sheet opens
- GIVEN usuario hace submit en bottom bar
- THEN sheet aparece desde la derecha con animación
- AND conversación previa visible (si existe)
- AND input para continuar en bottom del sheet

#### Scenario: Sheet closes
- GIVEN sheet está abierto
- WHEN usuario click en X o "Cerrar"
- THEN sheet se oculta con animación
- AND bottom bar vuelve a estado collapsed

---

### Requirement: Gema Personality (System Prompt)

Gema DEBE comportarse con "Amabilidad Ejecutiva" según el prompt definido.

**Comportamiento:**
- Cálida pero estricta con datos
- Responde en español
- Usa confirmaciones cálidas: "Excelente, registrado", "Perfecto Felipe"
- Micro-feedback: "Excelente gestión hoy. Todo cuadra."
- Redirige off-topic amablemente

#### Scenario: Gema greeting
- GIVEN usuario escribe "Empezemos"
- THEN Gema responde con saludo cálido
- AND recuerda los 9 datos obligatorios

#### Scenario: Micro-feedback on good data
- GIVEN usuario proporciona datos válidos y completos
- WHEN Gema procesa exitosamente
- THEN incluye micro-feedback positivo

---

### Requirement: 9 Datos Parser (Tool Calling)

Gema DEBE parsear los 9 datos obligatorios usando Tool Calling de Gemini.

**Datos Obligatorios:**
1. fecha (DD/MM/YYYY)
2. descripcion (string)
3. categoria (enum: Venta Equipos, Accesorios, Reparación, Publicidad, Infraestructura, etc.)
4. sub_categoria (string, opcional)
5. monto (number > 0)
6. tipo (Ingreso | Egreso)
7. medio_pago (enum: Davivienda, Bold, Efectivo, Nequi, etc.)
8. estado_iva (enum: Exento, Incluido, Externo)
9. comentarios (string, opcional)

#### Scenario: Valid transaction parsed
- GIVEN usuario dice "Venta iPhone $2.500.000 Bold Exento"
- WHEN Gema procesa
- THEN Tool Calling genera: `{ fecha: HOY, descripcion: "Venta iPhone", monto: 2500000, tipo: "Ingreso", medio_pago: "Bold", estado_iva: "Exento" }`

#### Scenario: Missing data
- GIVEN usuario dice "Venta iPhone $2.5M"
- WHEN falta medio_pago
- THEN Gema pregunta: "¿Cuál fue el Medio de Pago?"

#### Scenario: Inference
- GIVEN usuario dice "Pagué el arriendo"
- THEN Gema infiere: categoria="Infraestructura", tipo="Egreso"
- AND confirma: "Registrado pago de arriendo en Infraestructura. ¿Correcto?"

---

### Requirement: Pre-visualization Card

ANTES de INSERT a Supabase, Gema DEBE mostrar una card con los datos parseados para confirmación.

**Comportamiento:**
- Card estilo recibo
- Muestra los 9 datos en formato legible
- Botón "Confirmar" → proceed con INSERT
- Botón "Corregir" → abre inline edit o permite reingresar

#### Scenario: Pre-viz shown
- GIVEN Gema parseó transacción válida
- THEN muestra Pre-viz Card con los 9 datos
- AND botones "Confirmar" y "Corregir"

#### Scenario: User confirms
- GIVEN Pre-viz Card mostrada
- WHEN usuario click "Confirmar"
- THEN INSERT a Supabase ejecuta
- AND Gema confirma: "Transacción registrada exitosamente"

#### Scenario: User corrects
- GIVEN Pre-viz Card mostrada
- WHEN usuario click "Corregir"
- THEN Gema permite especificar qué corregir
- AND procesa de nuevo

---

### Requirement: Regla Bold (5% Auto-egreso)

Si medio_pago es "Bold", Gema DEBE generar automáticamente un egreso del 5%.

**Comportamiento:**
- Genera segunda transacción (hija)
- Monto: 5% del ingreso original
- Descripcion: "Comisión Transacción Bold + Retenciones Est."
- Categoria: "Costos Venta"
- parent_id: referencia a transacción padre

#### Scenario: Bold transaction with auto-egreso
- GIVEN usuario registra: "Venta $2.000.000 Bold"
- WHEN Gema procesa
- THEN genera DOS transacciones:
  1. Ingreso: $2.000.000 (padre)
  2. Egreso: $100.000 (hija, parent_id → padre)

#### Scenario: Parent deleted
- GIVEN transacción Bold existe (padre con hija)
- WHEN usuario elimina transacción padre
- THEN hija también se elimina (ON DELETE CASCADE)

---

### Requirement: Output CSV (Export)

Cuando usuario pide "Cerrar caja", "Resumen" o "Descargar", Gema DEBE retornar CSV sin headers.

**Formato:**
```
DD/MM/YYYY;descripcion;categoria;sub_categoria;monto;tipo;medio_pago;estado_iva;comentarios
```

**Ejemplo:**
```
14/11/2025;Venta iPhone;Venta Equipos Nuevos;iPhones;2500000;Ingreso;Bold;Exento;Cliente nuevo
14/11/2025;Comisión Transacción Bold;Egresos Negocio;Costos Venta;125000;Egreso;Bold;N/A;Costo TTT 5%
```

#### Scenario: CSV export
- GIVEN usuario dice "Descargar"
- WHEN Gema procesa
- THEN retorna bloque de código con CSV
- AND SIN encabezados de columna

---

### Requirement: Stateful Conversation

Gema DEBE mantener contexto de la conversación durante la sesión.

**Comportamiento:**
- Historial de mensajes persiste mientras sheet está abierto
- Gema recuerda datos mencionados previamente
- Permite referencias como "quanto fue eso?" o "y el arriendo?"

#### Scenario: Conversation context
- GIVEN usuario: "Pagué el arriendo"
- AND Gema: "¿Cuánto fue?"
- WHEN usuario: "$1.200.000"
- THEN Gema tiene contexto de arriendo + monto
