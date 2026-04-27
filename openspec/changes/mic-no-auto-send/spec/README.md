# Mic No Auto-Send - Specification

## 1. Overview

**Change Name:** Mic No Auto-Send
**Type:** UX Fix
**Status:** Spec Draft
**Created:** 2026-04-25

---

## 2. Executive Summary

Corregir el comportamiento del micrófono para que **NO envíe automáticamente** cuando detecta silencio. El usuario tiene control total: revisa/edita el texto en el textarea y presiona Enter o el botón Send.

---

## 3. Problema Actual

Actualmente cuando el usuario deja de hablar:
1. Browser detecta silencio → auto-stop
2. Se dispara `onTranscript(finalText)`
3. Mensaje se envía **automáticamente**

Esto viola el principio de "Soberanía del Usuario" y puede causar errores por ruidos/muletillas.

---

## 4. Solución

### Flujo Corregido:

```
1. Felipe presiona Mic → startListening()
2. Felipe habla → texto aparece en textarea (live preview)
3. Felipe deja de hablar → auto-stop (mic se apaga)
4. Texto queda en textarea para revisión
5. Felipe edita si quiere (gracias al textarea expandible)
6. Felipe presiona Enter o botón Send → SE ENVÍA
```

### Principio:
**El Mic SOLO hace stopListening(). El envío es decisión del usuario.**

---

## 5. Scope

### Archivos a modificar:
- `src/components/assistant/AssistantMicButton.tsx`
- `src/lib/voice-utils.ts`

### No modificar:
- AssistantSheet.tsx (ya tiene el textarea y el handler de Enter)
- Otros componentes

---

## 6. Success Criteria

1. ✅ Mic button solo detiene, no envía
2. ✅ Texto queda en textarea después de micropausa
3. ✅ Usuario puede editar antes de enviar
4. ✅ Enter o botón Send envía el mensaje
5. ✅ No auto-send cuando browser detecta silencio