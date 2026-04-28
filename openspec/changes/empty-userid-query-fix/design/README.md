# Empty UserId Query Fix - Technical Design

## 1. Fix Pattern

```typescript
// ANTES:
useEffect(() => {
  fetchTransactions();
}, [userId, ...]);

// DESPUÉS:
useEffect(() => {
  if (!userId || userId.length < 5) {
    setTransacciones([]);
    setLoading(false);
    return;
  }
  fetchTransactions();
}, [userId, ...]);
```

---

## 2. File to Modify

### Primary
- `src/hooks/usePaginatedTransactions.ts` - línea ~28-35

### Also Check
- `src/hooks/useListaTransacciones.ts`
- `src/hooks/useTransacciones.ts`

---

## 3. Verification

```bash
npm run build
```

Abrir DevTools → Console y verificar:
- No errores de `invalid input syntax for type uuid`
- Transacciones persisten en UI