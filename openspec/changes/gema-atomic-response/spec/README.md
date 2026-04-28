# Gema Atomic Response - Specification

## 1. Overview

**Change Name:** Gema Atomic Response
**Type:** Architecture Refactor
**Status:** Spec Draft
**Created:** 2026-04-27

---

## 2. Executive Summary

Cambiar de `streamText` a `generateText` en el API route para habilitar soporte correcto de tools en AI SDK v6.0.168. El streaming de texto se pierde, pero las transacciones se registrarán correctamente en Supabase.

**Trade-off:** UX fluida → Funcionalidad atómica

---

## 3. Problem Description

### Síntoma
- Chat funciona pero no registra transacciones
- `streamText` + tools = stream falla silenciosamente
- `toTextStreamResponse()` no puede transmitir tool call events

### Causa Raíz
En AI SDK v6.0.168, `toTextStreamResponse()` está diseñado para texto plano. Cuando el modelo intenta invocar una tool, el stream se rompe.

### Solución
Usar `generateText` que provee:
1. Cómputo completo antes de retornar
2. Tool calls ejecutados correctamente
3. Respuesta única con `text` + `toolResults`

---

## 4. Nuevo Flujo

```
Usuario: "Venta MacBook $1M Nequi"
  → generateText con tools
  → DeepSeek procesa, detecta tool call
  → API ejecuta handleTransaction
  → Supabase inserta transacción
  → generateText retorna { text, toolResults }
  → Frontend muestra confirmación + BatchCard
```

---

## 5. UX Premium Mientras Espera

Para compensar la pérdida del streaming:

### Skeleton Premium
- Gradiente animado indigo/zinc
- Mensajes rotativos:
  - "Analizando montos..."
  - "Sincronizando con Supabase..."
  - "Validando categorías..."

### Fade-in Animado
- Respuesta aparece con opacity + scale transition
- Se siente deliberado y elegante

---

## 6. Scope

### Archivos a modificar:
- `src/app/api/assistant/chat/route.ts` - streamText → generateText
- `src/hooks/useAssistantChat.ts` - Skeleton state + manejo de respuesta
- `src/lib/assistant-tools.ts` - Mantener (ya está bien)

### No modificar:
- `src/components/assistant/AssistantSheet.tsx`
- `src/components/assistant/BatchCard.tsx`

---

## 7. Success Criteria

1. ✅ Transacciones se registran en Supabase
2. ✅ Chat responde correctamente
3. ✅ Skeleton premium visible mientras espera
4. ✅ Fade-in cuando llega respuesta
5. ✅ `npm run build` pasa sin errores