# Gema Felipe UUID Fix - Technical Design

## 1. Changes to route.ts

### Ubicación 1: handleLoteTransaction
```typescript
// ANTES:
user_id: 'anonymous',

// DESPUÉS:
user_id: 'be0fa692-a3b1-41b6-9b9c-2e29f20f77ea',
```

### Ubicación 2: handleTransaction
```typescript
// ANTES:
user_id: request.headers.get('x-user-id') || 'anonymous',

// DESPUÉS:
user_id: 'be0fa692-a3b1-41b6-9b9c-2e29f20f77ea',
```

---

## 2. Testing Checklist

- [ ] Enviar "Venta MacBook $1M Nequi"
- [ ] Logs muestran "Inserted: <uuid>" sin error
- [ ] Verificar en Supabase que la transacción existe
- [ ] npm run build pasa