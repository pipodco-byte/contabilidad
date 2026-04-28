# AI SDK Upgrade v7+ - Specification

## 1. Overview

**Change Name:** AI SDK Upgrade v7+
**Type:** Dependency Upgrade
**Status:** Spec Draft
**Created:** 2026-04-27

---

## 2. Executive Summary

Upgrade de AI SDK de v6.0.168 a v7+ para habilitar soporte nativo de `toDataStreamResponse()` que permite multiplexar texto y tool calls en el stream de respuesta.

**Motivación:** El chat de Gema no funciona correctamente con tools porque `toTextStreamResponse()` no soporta tool invocations.

---

## 3. Problem Description

### Síntoma
- Chat no responde cuando se habilitan tools
- Network 200 OK pero response vacío
- Error: `Property 'toDataStreamResponse' does not exist`

### Causa Raíz
AI SDK v6.0.168 no tiene método `toDataStreamResponse()`. Solo soporta `toTextStreamResponse()` que no puede manejar tool calls.

---

## 4. Solution

### Upgrade a AI SDK v7+

```bash
npm install ai@latest
```

**Versión objetivo:** >= 7.0.0

---

## 5. Cambios Requeridos

### Backend: `route.ts`
1. Mantener `tools: tools as any` hasta verificar compatibilidad de tipos
2. Cambiar `toTextStreamResponse()` → `toDataStreamResponse()` después del upgrade

### Tipado
Remover `as any` en tools si el nuevo SDK lo soporta.

---

## 6. Scope

### Archivos a modificar:
- `package.json` - Upgrade ai SDK
- `src/app/api/assistant/chat/route.ts` - Cambiar método de response

### Verificar después del upgrade:
- `src/hooks/useAssistantChat.ts` - Compatibilidad de streaming
- `npm run build` - Sin errores de tipos

---

## 7. Success Criteria

1. ✅ AI SDK >= 7.0.0 instalado
2. ✅ `toDataStreamResponse()` reconocido por TypeScript
3. ✅ `npm run build` pasa sin errores
4. ✅ Chat responde correctamente con tools habilitadas
5. ✅ Tool calls se procesan sin errores