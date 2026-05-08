# Gema Tool Unification - Task Breakdown

## Phase: Apply

---

## Task 1: Update assistant-tools.ts

**Archivo:** `src/lib/assistant-tools.ts`

**Cambio:** Eliminar `registrar_transaccion`, dejar solo `registrar_lote_transacciones`

```typescript
export const tools = {
  registrar_lote_transacciones: {
    description: 'Registra múltiples transacciones a partir de un dictamen',
    inputSchema: zodSchema(LoteTransaccionesSchema),
  },
} as const
```

**Validación:** `npm run build`

---

## Task 2: Update route.ts

**Archivo:** `src/app/api/assistant/chat/route.ts`

**Cambios:**
1. Importar `Date` si no está
2. Crear `tools` simplificado (solo lote)
3. Agregar logging en cada paso
4. Pasar fecha al prompt

```typescript
const today = new Date()

const tools = {
  registrar_lote_transacciones: {
    description: 'Registra múltiples transacciones a partir de un dictamen',
    inputSchema: zodSchema(LoteTransaccionesSchema),
  },
}

const result = await generateText({
  model: deepseek('deepseek-v4-flash'),
  system: buildSystemPrompt(today),
  messages,
  tools,
  toolChoice: 'auto',
})

console.log('[Gema] text:', result.text)
console.log('[Gema] toolCalls:', result.toolCalls)
console.log('[Gema] toolResults:', result.toolResults)
```

**Validación:** `npm run build`

---

## Task 3: Update assistant-prompt.ts

**Archivo:** `src/lib/assistant-prompt.ts`

**Cambios:**
1. Eliminar sección "INSTRUCCIONES PARA TOOL CALLING"
2. Agregar "Cláusula de Silencio Narrativo"
3. Hacer que `buildSystemPrompt` acepte parámetro `Date`

```typescript
export function buildSystemPrompt(currentDate: Date = new Date()): string {
  const dateStr = currentDate.toLocaleDateString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })

  // Replace hardcoded dates with dateStr
  // Add "Cláusula de Silencio" section
  ...
}
```

**Validación:** `npm run build`

---

## Task 4: Test

Navegar a `/dashboard`, enviar "Venta MacBook $1M Nequi", verificar logs en terminal.

---

## Files Summary

| Archivo | Acción |
|---------|--------|
| `assistant-tools.ts` | Eliminar `registrar_transaccion` |
| `route.ts` | Logging + dynamic date + tool simplified |
| `assistant-prompt.ts` | Cláusula silencio + dynamic date |