# Gema Table Name Fix - Technical Design

## 1. Changes to route.ts

### Ubicación 1: handleLoteTransaction function
```typescript
// ANTES:
const { data, error } = await supabase
  .from('transacciones')

// DESPUÉS:
const { data, error } = await supabase
  .from('cont_transacciones')
```

### Ubicación 2: handleTransaction function
```typescript
// ANTES:
const { data: insertedParent, error: parentError } = await supabase
  .from('transacciones')

// DESPUÉS:
const { data: insertedParent, error: parentError } = await supabase
  .from('cont_transacciones')
```

---

## 2. Testing Checklist

- [ ] Enviar "Venta MacBook $1M Nequi"
- [ ] Logs muestran "Inserted: <uuid>" (sin error)
- [ ] Verificar en Supabase que la transacción existe
- [ ] npm run build pasa