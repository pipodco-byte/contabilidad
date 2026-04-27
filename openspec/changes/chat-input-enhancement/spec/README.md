# Chat Input Enhancement - Specification

## 1. Overview

**Change Name:** Chat Input Enhancement
**Type:** UX Improvement
**Status:** Spec Draft
**Created:** 2026-04-25

---

## 2. Executive Summary

Mejorar la experiencia del input de chat del Copilot para permitir edición fluida de texto dictato y envío rápido con teclado.

**Dos mejoras:**
1. **Textarea con altura dinámica** - Crece según el contenido, hasta 160px máximo
2. **Enter para enviar + Shift+Enter para nueva línea** - Interacción estándar de mensajería

---

## 3. Problema Actual

El input actual es un `<input type="text">` de una sola línea:
- Texto largo dictato se acumula en una línea sin scroll
- No se puede editar fácilmente el texto completo
- No hay feedback visual del crecimiento

---

## 4. Solución

### Fix 1: Textarea con altura dinámica

```tsx
const textareaRef = useRef<HTMLTextAreaElement>(null)

useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = 'inherit'
    const scrollHeight = textareaRef.current.scrollHeight
    textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`
  }
}, [input])
```

**Características:**
- Inicia pequeño (`rows={1}`)
- Crece hasta máximo 160px
- Scroll vertical si excede
- Transición suave de altura

### Fix 2: Lógica Enter + Shift+Enter

```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
```

**Comportamiento:**
- `Enter` → Enviar mensaje
- `Shift+Enter` → Nueva línea

---

## 5. Scope

### Archivos a modificar:
- `src/components/assistant/AssistantSheet.tsx`
  - Cambiar `<input>` a `<textarea>`
  - Agregar ref para altura dinámica
  - Agregar useEffect para ajustar altura
  - Agregar handler onKeyDown

### No modificar:
- Otros componentes
- API routes
- Hooks

---

## 6. Success Criteria

1. ✅ Textarea crece según contenido (hasta 160px)
2. ✅ Scroll vertical si el texto excede el máximo
3. ✅ Enter envía el mensaje
4. ✅ Shift+Enter crea nueva línea
5. ✅ Transición suave de altura
6. ✅ Build pasa sin errores