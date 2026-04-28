# Gema Execute Handler - Task Breakdown

## Phase: Apply

---

## Task 1: Add handleLoteTransaction function

**Archivo:** `src/app/api/assistant/chat/route.ts`

**Ubicación:** Después de `handleTransaction` function

**Código:**
```typescript
async function handleLoteTransaction(
  transacciones: Array<{
    fecha?: string
    descripcion: string
    monto: number
    tipo: 'Ingreso' | 'Egreso'
    medio_pago?: string
    categoria?: string
    estado_iva?: string
  }>
) {
  console.log('[Gema] handleLoteTransaction called with', transacciones.length, 'items')

  const results = []

  for (const transaccion of transacciones) {
    try {
      const { data, error } = await supabase
        .from('transacciones')
        .insert({
          user_id: 'anonymous',
          fecha: transaccion.fecha ? parseDate(transaccion.fecha) : new Date().toISOString().split('T')[0],
          descripcion: transaccion.descripcion,
          monto: transaccion.monto,
          tipo: transaccion.tipo,
          medio_pago: transaccion.medio_pago || 'Efectivo',
          categoria: transaccion.categoria || 'Otros',
          estado_iva: transaccion.estado_iva || 'Exento',
        })
        .select()
        .single()

      if (error) {
        console.error('[Gema] Insert error:', error)
        results.push({ error: error.message })
      } else {
        console.log('[Gema] Inserted:', data.id)
        results.push({ success: true, transaction: data })
      }
    } catch (err) {
      console.error('[Gema] Exception:', err)
      results.push({ error: 'Excepción' })
    }
  }

  return results
}
```

---

## Task 2: Update tool definition with execute

**Archivo:** `src/app/api/assistant/chat/route.ts`

**Ubicación:** En el bloque POST, donde se define `tools`

**Cambio:**
```typescript
const tools = {
  registrar_lote_transacciones: {
    description: 'Registra múltiples transacciones a partir de un dictamen',
    inputSchema: zodSchema(LoteTransaccionesSchema),
    execute: async ({ transacciones }) => {
      console.log('[Gema] execute called with', transacciones)
      return await handleLoteTransaction(transacciones)
    },
  },
}
```

---

## Task 3: Verify build

```bash
npm run build
```

---

## Files Summary

| Archivo | Acción |
|---------|--------|
| `route.ts` | Agregar handleLoteTransaction + execute handler |