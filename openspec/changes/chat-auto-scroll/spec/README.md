# Chat Auto-Scroll - Specification

## 1. Overview

**Change Name:** Chat Auto-Scroll
**Type:** UX Fix
**Status:** Spec Draft
**Created:** 2026-04-25

---

## 2. Executive Summary

Implementar auto-scroll en el chat del Copilot para que el usuario siempre vea el mensaje más reciente sin necesidad de hacer scroll manual.

**Scroll diferenciado:**
- Al abrir el chat: scroll `instant` (inmediato)
- Al recibir nuevo mensaje: scroll `smooth` (suave)

---

## 3. Problema Actual

Cuando:
1. Al entrar al chat, el scroll está al inicio
2. Al enviar/recibir mensaje nuevo, no hace scroll automático
3. El usuario tiene que hacer scroll manual constantemente

Esto rompe el flujo conversacional y se siente "pesado".

---

## 4. Solución

### Técnica: useRef + useEffect + scrollIntoView

```tsx
const messagesEndRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: isFirstLoad ? 'instant' : 'smooth'
  })
  setIsFirstLoad(false)
}, [messages])

// En el JSX:
<div className="flex-1 overflow-y-auto p-4 space-y-4">
  {messages.map(...)}
  <div ref={messagesEndRef} />
</div>
```

### Comportamiento diferenciado:

| Momento | behavior | Razón |
|--------|----------|-------|
| Al abrir chat | `instant` | Usuario ya quiere ver el último mensaje |
| Nuevo mensaje | `smooth` | El ojo puede seguir el movimiento |

---

## 5. Scope

### Archivo a modificar:
- `src/components/assistant/AssistantSheet.tsx`

### No modificar:
- Otros componentes
- API routes

---

## 6. Success Criteria

1. ✅ Al abrir el chat, scroll va instantáneamente al final
2. ✅ Al recibir mensaje nuevo, scroll va suavemente al final
3. ✅ No hay scroll manual requerido
4. ✅ Build pasa sin errores