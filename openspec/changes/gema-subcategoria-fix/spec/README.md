# Gema Subcategoria Fix - Specification

## 1. Overview

**Change Name:** Gema Subcategoria Fix
**Type:** Bug Fix
**Status:** Spec
**Created:** 2026-04-27

---

## 2. Executive Summary

La columna `sub_categoria` en `cont_transacciones` no permite valores NULL. Cuando el modelo pasa `null` o string vacío, el insert falla. Fix: agregar lógica defensiva para cubrir `null`, `undefined`, y string vacío.

---

## 3. Problem Description

### Error
```
null value in column "sub_categoria" of relation "cont_transacciones" violates not-null constraint
```

### Análisis
El modelo YA infiere sub_categoria correctamente (ej: 'MacBook'). El problema es que cuando el modelo pasa `null` o `''`, el código no lo maneja bien.

---

## 4. Solution

En `handleLoteTransaction`, cambiar la lógica de `sub_categoria`:

```typescript
// ANTES:
sub_categoria: transaccion.sub_categoria || 'N/A',

// DESPUÉS:
sub_categoria: (transaccion.sub_categoria && transaccion.sub_categoria.trim()) 
  ? transaccion.sub_categoria 
  : 'N/A',
```

---

## 5. Scope

### Archivos a modificar:
- `src/app/api/assistant/chat/route.ts`

---

## 6. Success Criteria

1. ✅ Insert no falla por null en sub_categoria
2. ✅ `npm run build` pasa sin errores