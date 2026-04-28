# Gema Tool Unification - Technical Design

## 1. Changes to assistant-tools.ts

### Remove registrar_transaccion

```typescript
// ANTES (lines 104-108):
export const tools = {
  registrar_transaccion: {
    description: '...',
    parameters: ...,
  },
  registrar_lote_transacciones: {
    description: '...',
    parameters: ...,
  },
}

// DESPUÉS:
export const tools = {
  registrar_lote_transacciones: {
    description: 'Registra múltiples transacciones a partir de un dictamen',
    inputSchema: zodSchema(LoteTransaccionesSchema),
  },
}
```

---

## 2. Changes to route.ts

### 2.1 Unificar tools (solo lote)
```typescript
const tools = {
  registrar_lote_transacciones: {
    description: 'Registra múltiples transacciones a partir de un dictamen',
    inputSchema: zodSchema(LoteTransaccionesSchema),
  },
}
```

### 2.2 Agregar logging detallado
```typescript
const result = await generateText({
  model: deepseek('deepseek-chat'),
  system: buildSystemPrompt(new Date()),
  messages,
  tools,
  toolChoice: 'auto',
})

console.log('[Gema] text:', result.text)
console.log('[Gema] toolCalls:', result.toolCalls)
console.log('[Gema] toolResults:', result.toolResults)

return Response.json({
  role: 'assistant',
  content: result.text,
})
```

### 2.3 Dynamic date en prompt
```typescript
// En route.ts:
const today = new Date()
const prompt = buildSystemPrompt(today)

// En assistant-prompt.ts:
export function buildSystemPrompt(currentDate: Date): string {
  const dateStr = currentDate.toLocaleDateString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })

  // Reemplazar hardcoded date con dateStr
  const SYSTEM_PROMPT = `...
  - "ayer" → ${dateStr - 1 día}
  ...`
}
```

---

## 3. Changes to assistant-prompt.ts

### 3.1 Eliminar referencias a registrar_transaccion
```diff
- INSTRUCCIONES PARA TOOL CALLING:
- Cuando tengas los 9 datos completos y quieras registrar la transacción,
- USA LA HERRAMIENTA 'registrar_transaccion'.
- No pidas confirmación antes de usar la herramienta.
```

### 3.2 Agregar Cláusula de Silencio
```
INSTRUCCIONES DE EJECUCIÓN:
Si detectas datos financieros (monto, descripción, medio de pago),
tu respuesta DEBE ser una invocación a registrar_lote_transacciones.
No explicues qué vas a hacer. No pidas confirmación.
Simplemente ejecuta la herramienta.
```

### 3.3 Actualizar fecha dinámica
```
3. FECHAS: Calcula fechas absolutas si detecta relativos:
   - "ayer" → Calcula restando 1 día de la fecha actual
   - "el lunes pasado" → Calcula el lunes anterior
   - "hace tres días" → Calcula restando 3 días
   Nota: La fecha de hoy se proporciona dinámicamente.
```

---

## 4. Response Flow with Logging

```
1. Request received
   └─ console.log('[Gema] Request:', messages)

2. generateText called
   └─ console.log('[Gema] Calling generateText with', tools)

3. Result received
   ├─ console.log('[Gema] text:', result.text)
   ├─ console.log('[Gema] toolCalls:', result.toolCalls)
   └─ console.log('[Gema] toolResults:', result.toolResults)

4. If tool was called
   └─ handleLoteTransaction() called
      └─ console.log('[Gema] Inserting to Supabase:', transactions)

5. Response sent
   └─ console.log('[Gema] Response:', response)
```

---

## 5. Testing Checklist

- [ ] Build pasa sin errores
- [ ] Logging visible en terminal
- [ ] Tool calls aparecen en logs
- [ ] Registro aparece en Supabase
- [ ] Chat responde correctamente