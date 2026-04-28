# Gema Cont Usuarios UUID Fix - Technical Design

## 1. Changes to route.ts

Reemplazar en todos los lugares:
```typescript
// ANTES:
user_id: 'be0fa692-a3b1-41b6-9b9c-2e29f20f77ea'

// DESPUÉS:
user_id: 'ca85a0bc-2e6e-4887-bf75-930f4dd34880'
```

---

## 2. Testing Checklist

- [ ] Enviar "Venta MacBook $1M Nequi"
- [ ] Logs muestran "Inserted:" sin error de FK
- [ ] Verificar en Supabase que la transacción existe
- [ ] npm run build pasa