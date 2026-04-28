# Gema Felipe UUID Fix - Specification

## 1. Overview

**Change Name:** Gema Felipe UUID Fix
**Type:** Bug Fix (Critical)
**Status:** Spec
**Created:** 2026-04-27

---

## 2. Executive Summary

El campo `user_id` en la tabla `cont_transacciones` es de tipo UUID, pero estamos pasando `"anonymous"` que es un string. Esto causa error de insert.

Fix: Reemplazar `'anonymous'` con el UUID real de Felipe: `be0fa692-a3b1-41b6-9b9c-2e29f20f77ea`

---

## 3. Problem Description

### Error
```
Insert error: invalid input syntax for type uuid: "anonymous"
```

### Causa
En `handleLoteTransaction` y `handleTransaction` usamos `user_id: 'anonymous'`.

---

## 4. Scope

### Archivos a modificar:
- `src/app/api/assistant/chat/route.ts` - Reemplazar 'anonymous' con UUID de Felipe

---

## 5. Success Criteria

1. ✅ Transacciones se insertan correctamente
2. ✅ `npm run build` pasa sin errores