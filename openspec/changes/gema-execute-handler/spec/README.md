# Gema Execute Handler - Specification

## 1. Overview

**Change Name:** Gema Execute Handler
**Type:** Bug Fix (Critical)
**Status:** Spec Draft
**Created:** 2026-04-27

---

## 2. Executive Summary

El modelo DeepSeek está invocando `registrar_lote_transacciones` correctamente, pero el `execute` handler falta. Esto causa que `toolResults: []` - la tool se invoca pero no ejecuta.

El fix requiere agregar un `execute` function handler que inserte las transacciones en Supabase.

---

## 3. Problem Description

### Current Behavior
```
[Gema] toolCalls: [{ toolName: 'registrar_lote_transacciones', input: { transacciones: [...] } }]
[Gema] toolResults: []  ← VACÍO - no se ejecutó nada
```

### Expected Behavior
```
[Gema] toolCalls: [{ toolName: 'registrar_lote_transacciones', input: { transacciones: [...] } }]
[Gema] toolResults: [{ resultado: {...} }]  ← Transacción insertada en Supabase
```

### Root Cause
La tool definition en `route.ts` solo tiene:
- `description`
- `inputSchema`

**Falta:**
- `execute` function que maneje la invocación

---

## 4. Solution

### 4.1 Crear función handleLoteTransaction

```typescript
async function handleLoteTransaction(transacciones: any[]) {
  const results = []

  for (const transaccion of transacciones) {
    const { data, error } = await supabase
      .from('transacciones')
      .insert({
        user_id: 'anonymous',
        fecha: parseDate(transaccion.fecha),
        descripcion: transaccion.descripcion,
        monto: transaccion.monto,
        tipo: transaccion.tipo,
        medio_pago: transaccion.medio_pago || 'Efectivo',
        categoria: transaccion.categoria,
        estado_iva: transaccion.estado_iva || 'Exento',
      })
      .select()
      .single()

    if (error) {
      console.error('[Gema] Insert error:', error)
    } else {
      results.push(data)
    }
  }

  return results
}
```

### 4.2 Agregar execute handler a la tool

```typescript
const tools = {
  registrar_lote_transacciones: {
    description: 'Registra múltiples transacciones a partir de un dictamen',
    inputSchema: zodSchema(LoteTransaccionesSchema),
    execute: async ({ transacciones }) => {
      console.log('[Gema] Executing lote with', transacciones.length, 'transactions')
      return await handleLoteTransaction(transacciones)
    },
  },
}
```

---

## 5. Scope

### Archivos a modificar:
- `src/app/api/assistant/chat/route.ts` - Agregar execute handler

### No modificar:
- Otros archivos

---

## 6. Success Criteria

1. ✅ Tool invocation genera toolResults con datos
2. ✅ Transacciones se insertan en Supabase
3. ✅ Logging muestra ejecución
4. ✅ `npm run build` pasa sin errores