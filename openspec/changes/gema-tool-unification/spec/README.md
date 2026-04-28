# Gema Tool Unification - Specification

## 1. Overview

**Change Name:** Gema Tool Unification
**Type:** Architecture Refactor
**Status:** Spec Draft
**Created:** 2026-04-27

---

## 2. Executive Summary

Unificar las tools de Gema a solo `registrar_lote_transacciones`. Eliminar `registrar_transaccion` para reducir ambigüedad y errores. El modelo debe usar tool con `toolChoice: 'auto'` y reinforced prompt.

---

## 3. Problem Description

### Síntoma
- Chat responde correctamente ✅
- No registra en Supabase ❌
- El modelo no invoca la tool

### Causas Identificadas

1. **Conflicto de Tools:** Dos tools (`registrar_transaccion` + `registrar_lote_transacciones`) causan confusión
2. **Sin Logging:** No sabemos qué retorna `generateText`
3. **Fecha Estática:** System prompt tiene fecha hardcoded, no dinámica
4. **Prompt Débil:** No hay "cláusula de silencio" que obligue a usar tool

---

## 4. Solution: Unificación + Logging + Dynamic Date

### 4.1 Unificar a UNA Tool
- Solo `registrar_lote_transacciones`
- Lote de 1 = lote de 1 = lote
- Eliminar `registrar_transaccion` completamente

### 4.2 Logging de Ingeniería
```typescript
console.log('[Gema] text:', result.text)
console.log('[Gema] toolCalls:', result.toolCalls)
console.log('[Gema] toolResults:', result.toolResults)
```

### 4.3 Fecha Dinámica
```typescript
const today = new Date().toLocaleDateString('es-CO')
// Pasa fecha actual al prompt
```

### 4.4 Cláusula de Silencio Narrativo
```
Si detectas datos financieros, tu respuesta DEBE ser una herramienta.
No expliques qué vas a hacer, simplemente hazlo.
```

---

## 5. Scope

### Archivos a modificar:
- `src/app/api/assistant/chat/route.ts` - Unificar tool + logging + dynamic date
- `src/lib/assistant-tools.ts` - Eliminar `registrar_transaccion`
- `src/lib/assistant-prompt.ts` - Cláusula de silencio + fecha dinámica

### No modificar:
- `src/components/assistant/*` - UI ya está bien
- `src/hooks/useAssistantChat.ts` - No necesita cambios

---

## 6. Success Criteria

1. ✅ Solo UNA tool: `registrar_lote_transacciones`
2. ✅ Logging detallado en cada paso del flujo
3. ✅ Fecha dinámica reemplazando hardcoded
4. ✅ Cláusula de silencio en prompt
5. ✅ `npm run build` pasa sin errores
6. ✅ Registro funciona en Supabase