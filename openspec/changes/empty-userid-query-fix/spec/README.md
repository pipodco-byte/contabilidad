# Empty UserId Query Fix - Specification

## 1. Overview

**Change Name:** Empty UserId Query Fix
**Type:** Bug Fix (Critical)
**Status:** Spec Draft
**Created:** 2026-04-28

---

## 2. Problem Description

### Error
```
GET /rest/v1/cont_transacciones?user_id=eq. 400 (Bad Request)
{code: '22P02', message: 'invalid input syntax for type uuid: ""'}
```

### Causa
El hook `usePaginatedTransactions` ejecuta la query de Supabase incluso cuando `userId` está vacío (`''`). El campo `user_id` es de tipo UUID, y no acepta string vacío.

### Impacto
- Query falla con error 400
- Datos se resetean a `[]`
- UI muestra transacciones por 1 segundo y luego desaparecen

---

## 3. Solution

Agregar guard clause en `usePaginatedTransactions.ts` para no ejecutar la query si `userId` está vacío o no válido.

---

## 4. Scope

**Archivo a modificar:**
- `src/hooks/usePaginatedTransactions.ts`

**Verificar otros hooks:**
- `useListaTransacciones.ts` - similar patrón, verificar
- `useTransacciones.ts` - similar patrón, verificar

---

## 5. Success Criteria

1. ✅ Build pasa sin errores
2. ✅ No hay queries con `user_id=""` o `user_id=eq.`
3. ✅ UI /transacciones muestra datos persistentemente