# Gema Stream Stability Fix - Specification

## 1. Overview

**Change Name:** Gema Stream Stability Fix
**Type:** Bug Fix (Critical)
**Status:** Spec Draft
**Created:** 2026-04-27

---

## 2. Executive Summary

El chat de Gema no responde. El build está fallando porque intentamos usar `toDataStreamResponse()` que no existe en AI SDK v6.0.168. El fix requiere:
1. Revert a `toTextStreamResponse()`
2. Comentar temporalmente las tools para aislar el problema

---

## 3. Problem Description

### Síntoma
- Build falla: `Property 'toDataStreamResponse' does not exist`
- Chat no responde en frontend
- Network 200 OK pero response vacío

### Causa Raíz
- Intentamos usar método de v7+ en v6.0.168
- Las tools pueden estar causando que el stream falle

---

## 4. Solution

### Reversión + Aislamiento

1. **Revert:** `toDataStreamResponse()` → `toTextStreamResponse()`
2. **Disable Tools:** Comentar `tools: tools as any` y `toolChoice`
3. **Verify:** Chat funciona sin tools
4. **Diagnose:** Determinar por qué tools rompen el stream

---

## 5. Scope

### Archivos a modificar:
- `src/app/api/assistant/chat/route.ts` - Revert y deshabilitar tools

### No modificar:
- `src/lib/assistant-tools.ts` - Mantener schemas por ahora
- `src/components/assistant/*` - No tocar UI

---

## 6. Success Criteria

1. ✅ Build pasa sin errores
2. ✅ Chat responde mensaje de texto
3. ✅ Gema revive y puede conversar