# Gema Chat Stream Fix - Specification

## 1. Overview

**Change Name:** Gema Chat Stream Fix
**Type:** Bug Fix (Critical)
**Status:** Spec Draft
**Created:** 2026-04-27

---

## 2. Executive Summary

El chat de Gema no responde cuando se habilitan tools en `streamText`. La causa raíz es el uso de `toTextStreamResponse()` que no soporta tool calls multiplexados. El fix requiere cambiar a `toDataStreamResponse()` para permitir que texto y tool invocations fluyan correctamente.

---

## 3. Problem Description

### Síntoma
- Usuario envía mensaje → Gema no responde
- Network muestra 200 OK pero response vacío
- No hay errores en la consola del navegador

### Causa Raíz
En `route.ts`, línea 45:
```typescript
return result.toTextStreamResponse()
```

Cuando `streamText` tiene `tools` habilitadas, el modelo puede retornar:
1. Texto plano
2. Tool invocations (JSON)
3. Combinación de ambos

`toTextStreamResponse()` solo maneja texto plano. Cuando DeepSeek intenta enviar un tool call, el stream se rompe silenciosamente.

### Logs Esperados
```
[Copilot API Error]: TypeError: Cannot read properties of undefined (reading 'type')
at DataStreamParser.parse (...)
```

---

## 4. Solution Overview

### Cambio Backend
```typescript
// route.ts línea 45
return result.toDataStreamResponse()
```

`toDataStreamResponse()` permite multiplexar:
- Mensajes de texto
- Tool invocations
- Tool results

---

## 5. Scope

### Archivos a modificar:
- `src/app/api/assistant/chat/route.ts` - Cambio en línea 45

### Archivos a revisar:
- `src/hooks/useAssistantChat.ts` - Verificar parsing del stream
- `src/hooks/useRadarData.ts` - Blindaje contra userId vacío

### No modificar:
- `src/components/assistant/BatchCard.tsx`
- `src/components/assistant/AssistantSheet.tsx`

---

## 6. Supabase 404 Issue

### Síntoma
```
GET transacciones?select=tipo,monto&user_id=eq.:1
```

### Causa
`userId` está vacío o tiene valor incorrecto en hooks de datos.

### Fix
```typescript
// En useRadarData.ts
useEffect(() => {
  if (!userId || userId.length < 5) {
    setLoading(false)
    setData([])
    return
  }
  // ... resto
}, [userId])
```

---

## 7. Success Criteria

1. ✅ Chat responde con mensaje de texto
2. ✅ Tool calls se procesan correctamente
3. ✅ No más 404s de Supabase en hooks
4. ✅ `npm run build` pasa sin errores