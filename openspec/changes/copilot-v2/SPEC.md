# Spec: Copilot V2 — Feature Specifications

## Feature 1: Voice Input

### Requirement: Microphone Button

El sistema DEBE mostrar un botón de micrófono junto al input de texto.

**Comportamiento:**
- Icono: Mic cuando idle
- Estado "listening": Mic con animación pulse + texto "Escuchando..."
- Click para start/stop
- Si browser no soporta → botón disabled (grayed out)

#### Scenario: Voice recognition funciona
- GIVEN usuario click en Mic
- THEN muestra "Escuchando..." + animación
- WHEN usuario habla
- THEN texto aparece en input
- WHEN usuario click Mic de nuevo (o silence)
- THEN stop recognition

#### Scenario: Browser no soporta
- GIVEN browser no soporta Web Speech API
- THEN Mic button disabled
- AND tooltip: "Mic no disponible en este navegador"

---

## Feature 2: Analytics Chat

### Requirement: Keyword Detection

El asistente DEBE detectar comandos analytics y responder con datos reales.

**Comandos reconocidos:**
- "resumen de [mes]"
- "total de [categoria] en [mes]"
- "cuánto vendí en [mes/año]"
- "dame el balance de [período]"

#### Scenario: Usuario pide resumen
- GIVEN usuario: "¿Total de ventas en febrero?"
- WHEN Copilot detecta keyword "total" + "mes"
- THEN consulta useResumen para febrero
- THEN formatea respuesta como markdown
- AND muestra: "En febrero registraste:\n- Ventas: $X\n- Egresos: $Y\n- Balance: $Z"

#### Scenario: Analytics con datos
- GIVEN usuario pide analytics
- WHEN hook returns data
- THEN muestra tabla/resumen formateado

---

## Feature 3: Image Upload + Extract

### Requirement: Upload Screenshot → Extract Data

El sistema DEBE permitir subir imagen (screenshot bancario) y extraer datos.

**Comportamiento:**
- Botón de imagen/paperclip junto al input
- Click → file picker (image/*)
- Preview de imagen seleccionada
- Copilot extrae datos del screenshot

**Datos extraídos del screenshot:**
| Campo | Ejemplo | Cómo se parsea |
|-------|---------|-----------------|
| monto | "$150.000,00 COP" | regex: \$[\d\.,]+ |
| fecha | "13 de abril de 2026" | parse fecha natural |
| medio_pago | "DaviPlata / Nequi / Bre-B" | keyword detection |
| referencia | "252476" | regex: aprobación: \d+ |

**Defaults automáticos:**
- tipo: Ingreso
- descripcion: "Ref: [número_aprobación]"
- estado: "Exitosa" (no se pregunta)

**Usuario debe confirmar:**
- categoria: Dropdown
- estado_iva: Dropdown (Exento/Incluido/Externo)

#### Scenario: Image upload exitoso
- GIVEN usuario click en image button
- WHEN selecciona imagen (screenshot)
- THEN preview aparece en chat
- AND Copilot extrae datos
- THEN muestra PreVizCard con datos extraídos

#### Scenario: Image extract parcial
- GIVEN imagen con datos incompletos
- WHEN Copilot no puede extraer todo
- THEN pregunta: "¿Qué categoría?" (ejemplo)
- THEN usuario responde
- THEN continúa con PreVizCard

#### Scenario: Image extract falla
- GIVEN imagen no legible
- THEN Copilot dice: "No pude leer la imagen. ¿Ingresa los datos manualmente?"

---

## Feature 4: CSV Generation

### Requirement: Generate CSV without context

El sistema DEBE generar CSV cuando usuario lo pida.

**Comandos:**
- "Dame el CSV"
- "Genera CSV de hoy"
- "Descargar CSV"

**Formato:**
```
DD/MM/YYYY;descripcion;categoria;monto;tipo;medio_pago;estado_iva;comentarios
SIN ENCABEZADOS
```

#### Scenario: CSV generation
- GIVEN usuario: "Dame el CSV de hoy"
- WHEN Copilot detecta keyword "CSV"
- THEN consulta transacciones del día
- THEN genera CSV sin guardar en contexto
- AND muestra en chat (bloque de código)

---

## Feature 5: Auto-Reset After INSERT

### Requirement: Nueva sesión después de INSERT exitoso

El sistema DEBE limpiar el chat después de registrar una transacción.

**Comportamiento:**
- Después de INSERT exitoso
- Mostrar "Nueva sesión" o limpiar automáticamente
- Opcional: preguntar "¿Nueva transacción?"

#### Scenario: Auto-reset after INSERT
- GIVEN usuario confirma PreVizCard
- WHEN INSERT exitoso
- THEN mostrar mensaje de éxito + "Nueva transacción?"
- AND limpiar mensajes (opcional)
- OR mostrar botón "Nueva sesión"

---

## Feature 6: localStorage Persistence (20 exchanges = 40 mensajes)

### Requirement: Chat History (Browser-only)

El sistema DEBE guardar los últimos 20 exchanges (40 mensajes) en localStorage.

**Comportamiento:**
- Al enviar mensaje → guardar en localStorage
- Al abrir sheet → cargar mensajes desde localStorage
- Límite: 20 exchanges (40 mensajes)
- Al llegar al límite → borrar más antiguo
- Auto-reset after INSERT ayuda a no saturar

#### Scenario: Persistencia funciona
- GIVEN usuario tiene chat con 5 mensajes
- WHEN cierra sheet
- AND abre sheet de nuevo
- THEN los 5 mensajes siguen ahí

#### Scenario: Límite alcanzado
- GIVEN hay 20 exchanges (40 mensajes)
- WHEN nuevo mensaje llega
- THEN oldest mensaje se borra
- AND localStorage tiene siempre max 40 mensajes

---

## Feature 7: Delete Chat

### Requirement: Clear History Button

El sistema DEBE permitir borrar el historial de chat.

**Comportamiento:**
- Botón 🗑️ en header del sheet
- Click → confirmación: "¿Borrar historial?"
- Confirm → limpia localStorage
- Notificación: "Chat borrado"

#### Scenario: Delete confirmation
- GIVEN usuario click en 🗑️
- THEN muestra modal/confirmation
- WHEN usuario confirma
- THEN localStorage.clear()
- AND chat se resetea

#### Scenario: Notification after delete
- GIVEN usuario borró chat
- THEN toast notification: "Historial eliminado"

---

## Feature 8: Notification Before Delete

### Requirement: Confirm Delete

El sistema DEBE mostrar confirmación antes de borrar.

**Comportamiento:**
- "Borrar historial?"
- [Cancelar] [Borrar]
- Botón "Borrar" rojo

#### Scenario: User cancels
- GIVEN modal de confirmación
- WHEN usuario click "Cancelar"
- THEN modal se cierra
- AND nothing happens

---

## Edge Cases

| Case | Handling |
|------|----------|
| Browser sin Web Speech API | Mic disabled |
| Image no se puede leer | Mensaje de error + manual entry |
| localStorage lleno | Auto-clean oldest + auto-reset after INSERT |
| Analytics sin datos | "No hay datos para este período" |
| CSV sin transacciones | "No hay transacciones para este período" |
| Solo español | Todo en español, sin multi-idioma |