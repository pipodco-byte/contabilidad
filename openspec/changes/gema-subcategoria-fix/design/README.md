# Gema Subcategoria Fix - Technical Design

## 1. Changes to route.ts

### En handleLoteTransaction:

```typescript
// ANTES:
sub_categoria: transaccion.sub_categoria || 'N/A',

// DESPUÉS:
sub_categoria: (transaccion.sub_categoria && transaccion.sub_categoria.trim()) 
  ? transaccion.sub_categoria 
  : 'N/A',
```

---

## 2. Testing Checklist

- [ ] Enviar "Venta MacBook $1M Nequi"
- [ ] Logs muestran "Inserted:" sin error
- [ ] Verificar en Supabase que sub_categoria tiene valor
- [ ] npm run build pasa