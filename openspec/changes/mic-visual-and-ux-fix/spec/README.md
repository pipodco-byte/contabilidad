# Mic Visual & UX Fix - Specification

## 1. Overview

**Change Name:** Mic Visual & UX Fix
**Type:** UX Improvement + Bug Fix
**Status:** Spec Draft
**Created:** 2026-04-25

---

## 2. Executive Summary

Dos fixes para el micrófono del Copilot:

1. **Visual:** Reemplazar `animate-pulse` rojo por wave animation custom cuando está grabando
2. **UX:** Mostrar el transcript en el input en tiempo real para que el usuario pueda ver/editar antes de enviar

---

## 3. Problemas Actuales

### Problema 1: Visual Feo
```tsx
// AssistantMicButton.tsx
isListening
  ? "bg-rose-500/20 text-rose-400 animate-pulse"
  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
```
- El `animate-pulse` hace un parpadeo rojo horrible
- Necesita algo más elegante

### Problema 2: Sin Live Preview en Input
```
1. Usuario habla
2. Se detiene automáticamente
3. Texto va DIRECTO al chat
4. No hay forma de editar o corregir
```

---

## 4. Solución

### Fix 1: Wave Animation Custom

Reemplazar `animate-pulse` por una wave animation custom con CSS:

```css
@keyframes wave {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}
.mic-wave {
  animation: wave 1.5s ease-in-out infinite;
}
```

Colores:
- Background: `bg-rose-500/20` (mantener)
- Text/Icon: `text-rose-400` (mantener)
- Animation: wave suave en lugar de pulse brusco

### Fix 2: Live Transcript in Input

Modificar el flujo para que el transcript aparezca en el input mientras graba:

**Componentes a modificar:**
1. `voice-utils.ts` - Exponer `interimTranscript` separado de `transcript`
2. `AssistantMicButton.tsx` - Props nuevas: `currentInput`, `onInputChange`
3. `AssistantSheet.tsx` - Pasar input actual al mic button, actualizar input con interim results

**Flujo esperado:**
```
1. Usuario hace clic en Mic
2. startListening() → comienza
3. onresult → interimTranscript se concatenar al input actual
4. Input muestra: "Hoy gasté 50 mil pe..." (mientras habla)
5. Usuario ve su texto, puede EDITAR si quiere
6. Usuario hace clic en Send → se envía lo que está en el input
```

---

## 5. Scope

### Archivos a modificar:
- `src/lib/voice-utils.ts` - Agregar `interimTranscript`
- `src/components/assistant/AssistantMicButton.tsx` - Props nuevas + CSS wave
- `src/components/assistant/AssistantSheet.tsx` - Integrar con input state

### No modificar:
- Otros componentes del Copilot
- API routes
- Hooks existentes (excepto voice-utils)

---

## 6. Success Criteria

1. ✅ Mic muestra wave animation suave cuando graba (no pulse feo)
2. ✅ Transcript aparece en tiempo real en el input mientras hablas
3. ✅ Usuario puede EDITAR el texto en el input antes de enviar
4. ✅ Usuario tiene CONTROL total sobre qué se envía
5. ✅ `npm run build` pasa sin errores