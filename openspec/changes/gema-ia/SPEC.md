# Spec: Copilot Assistant — Detalle de Comportamiento

## ADDED Requirements

### Requirement: FAB (Floating Action Button)

El sistema DEBE mostrar un FAB en la esquina inferior derecha del dashboard cuando no hay conversación activa.

**Comportamiento:**
- Posición: fixed, bottom-right, 24px margin
- Tamaño: 48x48px
- Icono: 💎 (placeholder hasta confirmar nombre)
- Estados: default, hover (scale up), active (pressed)
- Tooltip: "Asistente" on hover (300ms delay)

#### Scenario: FAB visible
- GIVEN usuario está en dashboard
- THEN FAB es visible en bottom-right
- AND tooltip muestra "Asistente" on hover

#### Scenario: FAB click opens assistant
- GIVEN usuario click en FAB
- THEN sidebar colapsa a 64px
- AND sheet se abre desde la derecha
- AND FAB stays visible but may change icon

---

### Requirement: Sidebar Collapse

Cuando el asistente está activo, el sidebar DEBE colapsar a 64px.

**Comportamiento:**
- Ancho collapsed: 64px (solo iconos visibles)
- Ancho expanded: 240px
- Transición: 300ms ease-out
- Estado persiste mientras sheet esté abierto

#### Scenario: Sidebar collapses
- GIVEN sheet está abierto
- THEN sidebar muestra solo iconos (64px)
- AND labels están ocultos
- AND toggle para expandir sigue funcionando

#### Scenario: Sidebar expands on close
- GIVEN sheet se cierra
- THEN sidebar vuelve a 240px
- AND animación suave

---

### Requirement: Sheet Lateral (Chat Panel)

El sistema DEBE mostrar un sheet en el lado derecho cuando el usuario activa el asistente.

**Comportamiento:**
- Ancho: 400px (desktop), 100% (mobile)
- Posición: fixed right, full height
- Overlay: bg-black/50 (click para cerrar)
- Animación: slide-in desde right, 300ms

#### Scenario: Sheet opens
- GIVEN usuario click en FAB
- THEN overlay aparece
- AND sheet slide desde right
- AND chat input visible en bottom

#### Scenario: Sheet closes
- GIVEN sheet está abierto
- WHEN usuario click en X
- OR usuario click en overlay
- THEN sheet se cierra con animación
- AND sidebar expande

---

### Requirement: Chat State

El chat DEBE mantener estado durante la sesión activa.

**Comportamiento:**
- Mensajes persisten mientras sheet esté abierto
- Historial visible con scroll
- Input para continuar conversación
- Reset on sheet close

#### Scenario: Conversation persists
- GIVEN usuario envió "Venta iPhone"
- AND asistente respondió
- WHEN usuario escribe otra cosa
- THEN historial completo visible

---

### Requirement: 9 Datos Parser (Tool Calling)

El asistente DEBE parsear los 9 datos obligatorios usando Tool Calling.

**Datos Obligatorios:**
1. fecha (DD/MM/YYYY)
2. descripcion (string)
3. categoria (enum)
4. sub_categoria (string, opcional)
5. monto (number > 0)
6. tipo (Ingreso | Egreso)
7. medio_pago (enum)
8. estado_iva (enum)
9. comentarios (string, opcional)

#### Scenario: Valid transaction parsed
- GIVEN usuario dice "Venta iPhone $2.500.000 Bold Exento"
- WHEN asistente procesa
- THEN Tool Calling genera objeto typed

#### Scenario: Missing data asks clarification
- GIVEN usuario dice "Venta iPhone $2.5M"
- WHEN falta medio_pago
- THEN asistente pregunta: "¿Cuál fue el Medio de Pago?"

---

### Requirement: Pre-visualization Card

ANTES de INSERT, el asistente DEBE mostrar una card con los datos parseados.

**Comportamiento:**
- Card estilo recibo
- Botón "Confirmar" → INSERT
- Botón "Corregir" → permite edición inline

#### Scenario: Pre-viz shown
- GIVEN asistente parseó transacción válida
- THEN Pre-viz Card aparece en chat
- AND botones "Confirmar" y "Corregir" visibles

#### Scenario: User confirms
- GIVEN Pre-viz Card mostrada
- WHEN usuario click "Confirmar"
- THEN INSERT a Supabase ejecuta
- AND asistente confirma: "Transacción #xxxxxx registrada"

---

### Requirement: Regla Bold (5% Auto-egreso)

Si medio_pago es "Bold", el asistente DEBE generar automáticamente un egreso del 5%.

**Comportamiento:**
- Segunda transacción (hija) con parent_id
- Monto: 5% del original
- Descripción: "Comisión Transacción Bold + Retenciones Est."
- ON DELETE CASCADE: si padre se borra, hija también

#### Scenario: Bold transaction
- GIVEN usuario: "Venta $2.000.000 Bold"
- WHEN asistente procesa
- THEN genera DOS transacciones:
  1. Ingreso: $2.000.000 (padre)
  2. Egreso: $100.000 (hija, parent_id → padre)

---

### Requirement: Micro-feedback

El asistente DEBE dar elogios breves profesionales en respuestas apropiadas.

**Comportamiento:**
- Cuando datos válidos y completos: "Excelente gestión hoy."
- Cuando cierre de caja exitoso: "¡Perfecto, como siempre!"
- No intrusivo, solo una línea

#### Scenario: Positive feedback
- GIVEN usuario proporciona datos válidos
- THEN asistente incluye: "Excelente, Felipe. Todo cuadra."

---

### Requirement: Output CSV

Cuando usuario pide "Descargar", asistente DEBE retornar CSV sin headers.

**Formato:**
```
DD/MM/YYYY;descripcion;categoria;sub_categoria;monto;tipo;medio_pago;estado_iva;comentarios
```

#### Scenario: CSV export
- GIVEN usuario dice "Descargar"
- THEN asistente retorna bloque de código CSV
- AND SIN encabezados de columna
