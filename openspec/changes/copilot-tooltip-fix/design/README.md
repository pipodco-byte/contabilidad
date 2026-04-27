# Copilot Tooltip Fix - Technical Design

## 1. File to Modify

**Archivo:** `src/app/dashboard/layout.tsx`

---

## 2. Changes

### Import
```typescript
import { TooltipProvider } from '@/components/ui/tooltip'
```

### JSX Change
```tsx
// ANTES:
return (
  <div className="flex h-screen overflow-hidden bg-background">
    ...
  </div>
)

// DESPUÉS:
return (
  <TooltipProvider delayDuration={0}>
    <div className="flex h-screen overflow-hidden bg-background">
      ...
    </div>
  </TooltipProvider>
)
```

---

## 3. Component Hierarchy After Fix

```
DashboardLayout
└── TooltipProvider
    ├── Sidebar (usa Tooltip en nav items)
    ├── Header
    ├── Main Content
    │   └── children
    ├── AssistantFAB
    └── AssistantSheet
        └── AssistantMicButton (usa Tooltip para el mic button) ✅
```

---

## 4. TooltipProvider de Radix

El `TooltipProvider` de Radix UI:
- Es un Context Provider
- Solo se necesita uno por árbol de componentes
- `delayDuration={0}` hace que el tooltip aparezca instantáneamente (sin delay)
- Es inofensivo si hay múltiples (Radix solo usa el más cercano)

---

## 5. No Breaking Changes

- No hay cambios de API
- No hay cambios de props
- No hay cambios de estilos
- No hay cambios de funcionalidad

---

## 6. Testing Checklist

- [ ] Build pasa
- [ ] Abrir Copilot en /dashboard
- [ ] Hover sobre botón de micrófono → tooltip aparece
- [ ] Hover sobre otros elementos con Tooltip → funcionan