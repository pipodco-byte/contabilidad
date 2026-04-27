# Copilot Tooltip Fix - Task Breakdown

## Meta
Agregar `TooltipProvider` a `dashboard/layout.tsx` para arreglar el error `Tooltip must be used within TooltipProvider` cuando se abre el Copilot.

---

## T1: Agregar TooltipProvider al Layout
**Archivo:** `src/app/dashboard/layout.tsx`
**Status:** Pending

**Descripción:**
1. Importar `TooltipProvider` desde `@/components/ui/tooltip`
2. Envolver el `div` principal con `<TooltipProvider delayDuration={0}>`

**Checklist:**
- [ ] Importar TooltipProvider
- [ ] Envolver contenido con TooltipProvider
- [ ] Cerrar TooltipProvider después del div principal

---

## T2: Build & TypeCheck
**Dependencias:** T1
**Status:** Pending

**Descripción:**
Verificar que el build pasa.

**Checklist:**
- [ ] `npm run build` pasa
- [ ] No hay errores de TypeScript

---

## T3: Commit (sin push)
**Dependencias:** T2
**Status:** Pending

**Descripción:**
Commit los cambios en la rama develop, sin hacer push.

**Checklist:**
- [ ] git add -A
- [ ] git commit -m "fix: add TooltipProvider to dashboard layout"
- [ ] Sin git push

---

## Orden de ejecución

```
T1 (TooltipProvider) → T2 (Build) → T3 (Commit sin push)
```

---

## Notas

- Fix simple y localizado
- Solo afecta a dashboard/layout.tsx
- TooltipProvider es inofensivo si ya existe en el tree