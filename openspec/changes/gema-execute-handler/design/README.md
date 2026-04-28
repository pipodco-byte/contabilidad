# Gema Execute Handler - Technical Design

## 1. Changes to route.ts

### 1.1 Add handleLoteTransaction function

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

### 1.2 Update tool definition with execute

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

### 1.3 Update logging

```typescript
console.log('[Gema] toolCalls:', result.toolCalls)
console.log('[Gema] toolResults:', result.toolResults)

if (result.toolResults && result.toolResults.length > 0) {
  console.log('[Gema] Transaction inserted:', result.toolResults[0])
}
```

---

## 2. Testing Checklist

- [ ] Send "Venta MacBook $1M Nequi"
- [ ] Check logs for `[Gema] execute called`
- [ ] Check logs for `[Gema] Inserted:`
- [ ] Verify Supabase has new row
- [ ] Check `toolResults` is not empty