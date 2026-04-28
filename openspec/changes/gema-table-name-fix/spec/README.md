# Gema Table Name Fix - Specification

## 1. Overview

**Change Name:** Gema Table Name Fix
**Type:** Bug Fix (Critical)
**Status:** Spec Draft
**Created:** 2026-04-27

---

## 2. Executive Summary

El execute handler funciona correctamente, pero el nombre de la tabla en Supabase es incorrecto. Estamos usando `transacciones` cuando el nombre real es `cont_transacciones`.

---

## 3. Problem Description

### Error
```
Insert error: Could not find the table 'public.transacciones'
Hint: Perhaps you meant the table 'public.cont_transacciones'
```

### Causa
El código usa `.from('transacciones')` pero la tabla real se llama `cont_transacciones`.

---

## 4. Solution

Cambiar `'transacciones'` → `'cont_transacciones'` en todos los lugares del archivo `route.ts`.

---

## 5. Scope

### Archivos a modificar:
- `src/app/api/assistant/chat/route.ts` - 2 ubicaciones

---

## 6. Success Criteria

1. ✅ Insert en Supabase funciona
2. ✅ Transacciones aparecen en la tabla `cont_transacciones`
3. ✅ `npm run build` pasa sin errores