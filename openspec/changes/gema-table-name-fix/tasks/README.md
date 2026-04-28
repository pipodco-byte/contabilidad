# Gema Table Name Fix - Task Breakdown

## Phase: Apply

---

## Task 1: Fix table name in route.ts

**Archivo:** `src/app/api/assistant/chat/route.ts`

**Cambios:**
1. En `handleLoteTransaction`: `.from('transacciones')` → `.from('cont_transacciones')`
2. En `handleTransaction`: `.from('transacciones')` → `.from('cont_transacciones')`

**Validación:** `npm run build`

---

## Files Summary

| Archivo | Acción |
|---------|--------|
| `route.ts` | Cambiar 'transacciones' → 'cont_transacciones' |