# Proposal: UI Polish G3 V2 — Theme System Refactor + Smart Transaction Defaults

## Intent

Fix two critical UX bugs and establish a scalable, theme-aware UI infrastructure:

1. **Bug de Confianza (CRITICAL)**: `usePaginatedTransactions` filtra por el mes **actual**. Si no hay transacciones en abril (o cualquier mes sin datos), el usuario ve "Sin transacciones aún" y piensa que perdió sus datos. El fix: **"Últimos 30 días"** como default.

2. **Light Mode Roto (CRITICAL)**: Componentes usan `bg-zinc-950`, `text-zinc-100` hardcoded. En modo claro son invisibles. Los tokens CSS ya están definidos en `globals.css` pero nadie los usa.

## Scope

### In Scope
- **Transacciones Smart Default**: Hook usa "últimos 30 días" en lugar de mes actual
- Token mapping: `bg-zinc-9[0-5]` → `bg-background`/`bg-card` en todos los componentes
- Light mode funcional en todas las superficies
- Animaciones estandarizadas (200ms / 400ms)
- A11y pass: `sr-only` labels en KPIs, `aria-label` en charts
- Limpiar inline SVG en header (usar lucide-react)
- Fix X-axis label overlap en Graficas.tsx
- Scrollbar styling para light mode

### Out of Scope
- Nuevas features o lógica de negocio
- Cambios en schema de base de datos
- API contract changes
- Mobile-first layout refactor (futuro SDD)

## Approach

### Phase 0: Bug Fix Prioritario
1. Modificar `usePaginatedTransactions` para default: últimos 30 días
2. UI: mensaje claro "Mostrando últimos 30 días"

### Phase 1-5: Theme Refactor (como estaba, batch replace por componente)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/usePaginatedTransactions.ts` | Modified | Smart default (30 días), no mes actual |
| `src/app/globals.css` | Modified | Tokens completos; scrollbar light mode |
| `tailwind.config.ts` | Modified | `duration-fast` / `duration-smooth` |
| `src/components/Graficas.tsx` | Modified | Tooltip tokens, X-axis overlap |
| `src/components/MilestoneLine.tsx` | Modified | Font stack fallback |
| `src/components/kpi-card.tsx` | Modified | Tokens + `sr-only` trend labels |
| `src/components/transaction-table.tsx` | Modified | Hardcoded → tokens |
| `src/components/strategy/StrategyChat.tsx` | Modified | Textarea tokens |
| `src/components/strategy/StrategyMiniChart.tsx` | Modified | Tooltip + responsive height |
| `src/components/assistant/AssistantSheet.tsx` | Modified | Full token refactor |
| `src/components/transaccion-form.tsx` | Modified | Input tokens |
| `src/components/FilterSelectors.tsx` | Modified | Border tokens |
| `src/app/dashboard/transacciones/page.tsx` | Modified | Search bar tokens |
| `src/app/dashboard/header.tsx` | Modified | Lucide import; remove inline SVG |
| `src/app/dashboard/page.tsx` | Modified | Textarea tokens |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Light mode revela bugs ocultos | Medium | Verificar cada componente post-refactor |
| Hook change rompe filtros existentes | High | Testear selector de mes/año después del fix |
| Inconsistent token usage post-change | High | Grep check al final |

## Rollback Plan

```bash
git stash
# or
git revert <commit>
```
Cambios son refactores puros. Rollback restaura estado visual previo sin afectar lógica.

## Dependencies

- `tailwindcss` con `darkMode: 'class'`
- `lucide-react` para iconos

## Success Criteria

- [ ] Hook muestra últimos 30 días por defecto (no mes actual)
- [ ] "Sin transacciones" solo cuando no hay datos en 30 días
- [ ] Todos los componentes renderizan bien en light AND dark mode
- [ ] `grep -r "bg-zinc-9[0-5]" src/` = zero matches
- [ ] KPI trend arrows con `sr-only` labels
- [ ] Charts con `aria-label`
- [ ] Animations usan tokens globales (200ms / 400ms)
- [ ] Build pasa sin errores