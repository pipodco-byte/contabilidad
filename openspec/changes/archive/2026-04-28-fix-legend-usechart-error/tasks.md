# Tasks: fix-legend-usechart-error

## Phase 1: Implement SimpleLegendContent

- [x] 1.1 Add `SimpleLegendContent` component to `src/components/ui/chart.tsx`
- [x] 1.2 Export `SimpleLegendContent` from `src/components/ui/chart.tsx`

## Phase 2: Update Graficas.tsx

- [x] 2.1 Update import: `ChartLegendContent` → `SimpleLegendContent`
- [x] 2.2 Replace BarChart legend
- [x] 2.3 Replace AreaChart (Evolución) legend
- [x] 2.4 Replace PieChart legend
- [x] 2.5 Replace AreaChart (Mensual) legend
- [x] 2.6 Replace LineChart (Balance) legend with `<SimpleLegendContent showBalance />`

## Phase 3: Verification

- [x] 3.1 Run `npm run build` - verify no TypeScript errors
- [x] 3.2 Verify legend displays Ingresos (emerald), Egresos (rose), Balance (violet when applicable)
- [x] 3.3 No console errors about useChart

## Phase 4: Commit

- [ ] 4.1 Commit changes

---

**Implementation Complete**: 2026-04-28

**Build Status**: Passing

**Files Modified**:
- `src/components/ui/chart.tsx` — Added `SimpleLegendContent`
- `src/components/Graficas.tsx` — Updated 5 legend usages
