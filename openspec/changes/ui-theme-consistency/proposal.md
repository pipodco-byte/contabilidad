# Proposal: UI Theme Consistency — Dark Mode Tokens Migration

## Intent

Migrar 228+ clases `dark:` hardcodeadas en componentes UI a tokens semánticos del sistema de temas. Actualmente Graficas.tsx, kpi-card.tsx y otros usan `dark:bg-zinc-*`, `dark:border-zinc-*`, `dark:text-zinc-*` que rompen el soporte de temas. También corregiremos tooltips hardcodeados, colores hex en charts, loading states incorrectos, y scrollbar hiding incompleto.

## Scope

### In Scope
- Migrar `dark:bg-zinc-*` → `bg-card` / `bg-background`
- Migrar `dark:border-zinc-*` → `border-border`
- Migrar `dark:text-zinc-*` → `text-foreground` / `text-muted-foreground`
- Migrar `dark:shadow-black-*` → `shadow-foreground-*`
- Tooltips de charts con CSS variables (`var(--tooltip-bg)`)
- Loading skeletons que coincidan con layout real
- Filtros transacción con `bg-primary` en vez de `bg-emerald-500`
- Scrollbar hiding cross-browser (WebKit + Firefox)
- Shadow tokens en kpi-card

### Out of Scope
- Botones duplicados dashboard (Quick Win separado)
- Nuevas funcionalidades
- Cambios en lógica de negocio
- Backend/API

## Approach

**Fase 1 — Quick Fixes (30 min)**
- Loading states: 4 archivos
- Shadow kpi-card
- Filtros transacción

**Fase 2 — Migración Principal (2-3 hrs)**
- Graficas.tsx: 228+ ocurrencias `dark:`
- kpi-card.tsx: shadow hardcodeado
- Tooltip CSS variables
- Colores hex → tokens tema

**Fase 3 — Validación**
- Build pasa
- Light mode funciona
- Dark mode funciona
- No regresiones visuales

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Graficas.tsx` | Modified | 228+ dark: classes → tokens |
| `src/components/dashboard/kpi-card.tsx` | Modified | shadow, border, bg tokens |
| `src/components/tables/transaction-table.tsx` | Modified | filtros con primary, textos |
| `src/components/FilterCarousel.tsx` | Modified | scrollbar, bg tokens |
| `src/components/reports/reports-tabs.tsx` | Modified | bg tokens |
| `src/app/dashboard/loading.tsx` | Modified | skeleton correcto |
| `src/app/dashboard/graficas/loading.tsx` | Modified | 4 charts skeleton |
| `src/app/dashboard/informes/loading.tsx` | Modified | tabs skeleton |
| `src/app/dashboard/transacciones/loading.tsx` | Modified | table skeleton |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Build rompe | Low | git stash antes, reverting si falla |
| Regresión visual | Medium | Verificar manualmente antes/apués |
| Tokens no existen | Low | Verificar globals.css primero |

## Rollback Plan

```bash
git stash
git stash drop
# Restaurar estado anterior inmediato
```

## Dependencies

- Tokens semánticos ya definidos en `globals.css` (--background, --card, --foreground, etc.)
- Sistema de temas existente con `useTema` hook

## Success Criteria

- [ ] 0 ocurrencias de `dark:bg-zinc-*` en archivos activos
- [ ] 0 ocurrencias de `dark:border-zinc-*` en archivos activos
- [ ] Tooltips de charts usan CSS variables
- [ ] Loading skeletons coinciden con layout
- [ ] Build pasa sin errores
- [ ] Light mode funcional
- [ ] Dark mode funcional
