# Tasks: chart-polish-hybrid

## Phase 1: Infrastructure

- [x] 1.1 Install shadcn charts: `npx shadcn@latest add charts` in `/Users/calderonjosue_/Contabilidad_pipod/pipod-contabilidad`
- [x] 1.2 Verify `src/components/ui/chart.tsx` created with BarChart, AreaChart, PieChart, LineChart primitives

## Phase 2: Core Implementation

- [x] 2.1 Create motion wrapper in `Graficas.tsx`: `motion.div` with `initial: {opacity:0, scale:0.95}`, `animate: {opacity:1, scale:1}`, `transition: {duration:0.4, ease:"easeOut"}` for each chart card
- [x] 2.2 Add CHART_COLORS palette: `ingresos: '#10b981'`, `egresos: '#fb7185'`, `balance: '#8b5cf6'`, `pie: ['#fb7185','#f43f5e','#e11d48','#be123c','#9f1239','#881337','#fbbf24','#f59e0b']`
- [x] 2.3 Refactor BarChart "Ingresos vs Egresos por Categoría" (line 130-147): Replace `BarChart+Bar` from recharts with shadcn `<BarChart>`, preserve `CartesianGrid`, `XAxis`, `YAxis`, `Tooltip` (shadcn bg-popover), `Legend`
- [x] 2.4 Refactor AreaChart "Evolución Temporal" (line 149-183): Replace `AreaChart+Area` with shadcn, preserve `linearGradient` defs, `MilestoneLine` components, `domain` YAxis
- [x] 2.5 Refactor PieChart "Distribución de Egresos" (line 185-216): Replace `PieChart+Pie+Cell` with shadcn, use `innerRadius={80}`, `outerRadius={140}`, apply rose palette cells
- [x] 2.6 Refactor AreaChart "Evolución Mensual" (line 218-245): Replace `AreaChart+Area` with shadcn, preserve same gradient pattern
- [x] 2.7 Refactor LineChart "Balance Neto Mensual" (line 247-289): Replace `LineChart+Line` with shadcn, preserve `ReferenceLine` for break-even, `MilestoneLine` components

## Phase 3: Verification

- [x] 3.1 Run `npm run build` — verify no TypeScript/lint errors
- [x] 3.2 Test filter by date range — ensure charts re-render with filtered data
- [x] 3.3 Test filter by category — ensure BarChart and PieChart reflect filtered categories
- [x] 3.4 Verify tooltip shows COP currency format (es-CO) and insight text (Break-even/Meta Sana)
- [x] 3.5 Verify fade-in animation plays on initial page load (400ms)

## Phase 4: Accessibility

- [x] 4.1 Verify each chart card has `role="img"` and `aria-labelledby` pointing to title
- [x] 4.2 Verify screen reader announces: "Gráfico de barras mostrando ingresos y egresos por categoría del período seleccionado"

---

**Implementation Complete**: 2026-04-28

**Files Modified**:
- `src/components/Graficas.tsx` — Refactored with Framer Motion + shadcn chart primitives
- `src/components/ui/chart.tsx` — shadcn chart wrapper (pre-existing)

**Build Status**: Passing
