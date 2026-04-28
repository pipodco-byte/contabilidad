# Specification: IA Strategy - UX Enhancement (Fase 1)

## 1. Overview

**Change:** Fase 1 - Quick Wins UX
**Type:** UI Enhancement
**Status:** Spec Draft
**Created:** 2026-04-28

---

## 2. Requirements

### 2.1 Markdown Rendering

**Objective:** Render Markdown en mensajes del asistente con soporte para tablas y code blocks.

**Implementation:**
- Importar `react-markdown` y `remark-gfm`
- Crear `markdownComponents` object con estilos personalizados
- Aplicar estilos zinc-compatible para consistency

**Components:**
```typescript
// Elements a soportar
- p, strong, em, ul, ol, li
- h1, h2, h3
- blockquote
- code, pre
- table, thead, tbody, tr, th, td
- hr
```

**Styling:**
- User messages: Plain text (no markdown)
- Assistant messages: Full markdown rendering

### 2.2 Textarea Auto-grow

**Objective:** Input que crece automáticamente con el contenido.

**Implementation:**
- Textarea en vez de Input
- Auto-height basada en scrollHeight
- Max-height: 160px
- Overflow-y: auto cuando excede max

**Behavior:**
- Enter: Enviar mensaje
- Shift+Enter: Nueva línea
- Mantener placeholder visible

### 2.3 Delete Confirm Modal

**Objective:** Confirmación elegante para eliminar chat.

**Implementation:**
- Overlay con backdrop blur
- Escala animation (0.95 → 1)
- Botones Cancelar/Eliminar
- Cierre con X o click fuera

### 2.4 Hybrid Scrolling

**Objective:** Scroll instantáneo en primer load, suave en nuevos mensajes.

**Implementation:**
- State `isFirstLoad` boolean
- Primer mensaje: `behavior: 'instant'`
- Mensajes siguientes: `behavior: 'smooth'`

### 2.5 Loading State

**Objective:** Feedback visual mientras IA responde.

**Current:**
```tsx
<div className="flex items-center gap-2 text-muted-foreground">
  <Loader2 className="h-4 w-4 animate-spin" />
  <span className="text-sm">Pensando...</span>
</div>
```

**Keep as-is:** Ya tiene pulse animation correcto.

---

## 3. Component Changes

### 3.1 StrategyMessage.tsx

**Changes:**
- Add `react-markdown` and `remark-gfm` imports
- Add `markdownComponents` object
- Add conditional rendering (user = plain, assistant = markdown)

### 3.2 StrategyChat.tsx

**Changes:**
- Replace `Input` with `textarea`
- Add `isFirstLoad` state
- Add `textareaRef` for auto-grow
- Update scroll logic with hybrid behavior
- Enhance delete modal with backdrop blur

---

## 4. Dependencies

| Package | Purpose |
|---------|---------|
| `react-markdown` | Markdown rendering |
| `remark-gfm` | GitHub Flavored Markdown (tables, etc.) |

---

## 5. Success Criteria

- [ ] Mensajes de asistente renderizan Markdown (tablas, code, etc.)
- [ ] Textarea crece automáticamente hasta 160px
- [ ] Enter envia, Shift+Enter hace nueva línea
- [ ] Delete modal tiene backdrop blur
- [ ] Primer scroll es instant, siguientes son suaves
- [ ] Build pasa sin errores