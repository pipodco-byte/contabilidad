# Proposal: informes-premium-upgrade

## Intent

Upgrade the charts in `/dashboard/informes` (BarChart mensual + LineChart anual) to premium boutique style, matching the visual quality achieved in `Graficas.tsx` v4.2. Apply glassmorphism cards, spring animations, gradients, glow effects, and Framer Motion.

## Scope

### In Scope
- **BarChart (Informe Mensual)**: Upgrade to premium with glassmorphism, emerald/indigo gradients fill, Framer Motion fade-in
- **LineChart (Informe Anual)**: Upgrade to premium with gradient strokes (green→emerald, purple→indigo, amber→orange), activeDot shadow, spring animation
- **Unique Gradient IDs**: Use `informe-bar-*` and `informe-line-*` prefixes to avoid conflicts with Graficas.tsx

### Out of Scope
- Changes to Graficas.tsx (already complete)
- Changes to KPI cards (already styled)
- Backend/hook changes

## Approach

Apply same visual upgrade pattern used in `chart-visual-upgrade` and `chart-area-premium` SDDs:
1. Wrap charts in glassmorphism cards with `backdrop-blur-xl border-border/50`
2. Add SVG `<linearGradient>` definitions with unique IDs
3. Integrate Framer Motion with `fadeIn` + `scale` + stagger 0.1s
4. Use `spring(stiffness: 260, damping: 20)` for animations
5. Minimalist axes: `axisLine: false, tickLine: false`
6. Enhanced tooltips with glow effects

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/reports/reports-tabs.tsx` | Modified | BarChart + LineChart upgrades |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Gradient ID conflicts with Graficas.tsx | High | Use `informe-*` prefixed IDs |
| Framer Motion import missing | Low | Already imported in project |

## Rollback Plan

1. Revert `reports-tabs.tsx` to previous version via git
2. Run `npm run build` to verify no broken state

## Dependencies

- Framer Motion (already in project)
- Recharts (already in project)
- `chart.tsx` component with SimpleLegendContent (already exists)

## Success Criteria

- [ ] BarChart renders with glassmorphism card, emerald/indigo gradients, Framer Motion
- [ ] LineChart renders with gradient strokes, activeDot shadow, spring animation
- [ ] No gradient ID conflicts with Graficas.tsx (IDs: `informe-bar-ingresos`, `informe-bar-egresos`, `informe-line-ingresos`, `informe-line-egresos`, `informe-line-balance`)
- [ ] Build passes without errors
- [ ] Navigate between Graficas and Informes pages without visual glitches