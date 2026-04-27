# Copilot Tooltip Fix - Specification

## 1. Overview

**Change Name:** Copilot Tooltip Fix
**Type:** Bug Fix
**Status:** Spec Draft
**Created:** 2026-04-25

---

## 2. Executive Summary

Agregar `TooltipProvider` a `dashboard/layout.tsx` para que los `Tooltip` de Radix UI funcionen correctamente en todo el dashboard, específicamente en el componente `AssistantMicButton` del Copilot.

---

## 3. Problema

**Error:**
```
Error: `Tooltip` must be used within `TooltipProvider`
```

**Ubicación:**
- `AssistantMicButton.tsx` usa `Tooltip` de Radix UI
- `AssistantSheet.tsx` no tiene `TooltipProvider` envolviendo su contenido
- Cuando se abre el Copilot (FAB), el tooltip del micrófono falla

---

## 4. Solución

Envolver TODO el contenido de `dashboard/layout.tsx` con `<TooltipProvider delayDuration={0}>`.

**Antes:**
```tsx
// dashboard/layout.tsx
<div className="flex h-screen overflow-hidden bg-background">
  {/* Sidebar, Main, FAB, Sheet... */}
</div>
```

**Después:**
```tsx
import { TooltipProvider } from '@/components/ui/tooltip'

<TooltipProvider delayDuration={0}>
  <div className="flex h-screen overflow-hidden bg-background">
    {/* Sidebar, Main, FAB, Sheet... */}
  </div>
</TooltipProvider>
```

---

## 5. Scope

### Dentro del cambio:
- `src/app/dashboard/layout.tsx` - Agregar TooltipProvider

### Fuera del cambio:
- No cambia funcionalidad del Copilot
- No cambia otros componentes

---

## 6. Success Criteria

1. ✅ TooltipProvider envuelve todo el dashboard layout
2. ✅ `npm run build` pasa sin errores
3. ✅ Tooltip del micrófono funciona al abrir Copilot
4. ✅ Otros Tooltips en el dashboard también funcionan