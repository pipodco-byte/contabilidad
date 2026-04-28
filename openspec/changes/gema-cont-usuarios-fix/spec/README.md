# Gema Cont Usuarios UUID Fix - Specification

## 1. Overview

**Change Name:** Gema Cont Usuarios UUID Fix
**Type:** Bug Fix (Critical)
**Status:** Spec
**Created:** 2026-04-27

---

## 2. Executive Summary

El UUID de Felipe en `cont_usuarios` es `ca85a0bc-2e6e-4887-bf75-930f4dd34880`, no el de la tabla `usuarios`. El insert a `cont_transacciones` necesita FK a `cont_usuarios`.

---

## 3. Problem Description

### Error
```
Key (user_id)=(be0fa692-a3b1-41b6-9b9c-2e29f20f77ea) is not present in table "cont_usuarios"
```

### Causa
Usamos el UUID de la tabla `usuarios` (`be0fa692-...`) pero la FK apunta a `cont_usuarios`.

---

## 4. Solution

Reemplazar el UUID en todos los lugares de `route.ts`:
```
be0fa692-a3b1-41b6-9b9c-2e29f20f77ea → ca85a0bc-2e6e-4887-bf75-930f4dd34880
```

---

## 5. Scope

### Archivos a modificar:
- `src/app/api/assistant/chat/route.ts`

---

## 6. Success Criteria

1. ✅ Transacciones se insertan correctamente
2. ✅ `npm run build` pasa sin errores