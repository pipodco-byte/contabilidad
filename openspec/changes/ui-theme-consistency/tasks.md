# Tasks: UI Theme Consistency — Dark Mode Tokens Migration

## Phase 1: Quick Fixes (Loading States, Shadow, Filtros)

- [x] 1.1 Fix `dashboard/loading.tsx` — remover skeleton admin badge, solo KPI cards y form
- [x] 1.2 Fix `dashboard/graficas/loading.tsx` — 4 charts skeleton
- [x] 1.3 Fix `dashboard/informes/loading.tsx` — tabs skeleton
- [x] 1.4 Fix `dashboard/transacciones/loading.tsx` — table skeleton
- [x] 1.5 Fix `kpi-card.tsx` — `shadow-black` → `shadow-foreground`, `dark:` → tokens
- [x] 1.6 Fix `transaction-table.tsx` — `bg-emerald-500` → `bg-primary` en filtros activos

## Phase 2: Graficas.tsx Migration (228+ occurrences)

- [x] 2.1 Grep `src/components/Graficas.tsx` para `dark:bg-zinc-*` occurrences
- [x] 2.2 Reemplazar `dark:bg-zinc-900` → `bg-card`
- [x] 2.3 Reemplazar `dark:bg-zinc-950` → `bg-background`
- [x] 2.4 Reemplazar `dark:border-zinc-*` → `border-border`
- [x] 2.5 Reemplazar `dark:text-zinc-*` → `text-foreground` / `text-muted-foreground`
- [x] 2.6 Actualizar `tooltipStyle` para usar CSS variables
- [x] 2.7 Remover `dark:` classes residuales
- [x] 2.8 Run `npm run build` para verificar

## Phase 3: Other Component Files

- [x] 3.1 Fix `FilterCarousel.tsx` — `scrollbar-width: none` + `bg-card` tokens
- [x] 3.2 Fix `reports-tabs.tsx` — `dark:bg-zinc-*` → `bg-card`, `dark:border-*` → `border-border`
- [x] 3.3 Run `npm run build` después de cada archivo

## Phase 4: Verification

- [x] 4.1 Grep para `dark:bg-zinc-*` en archivos activos — 0 resultados
- [x] 4.2 Grep para `dark:border-zinc-*` — 0 resultados
- [x] 4.3 Grep para `dark:text-zinc-*` — 0 resultados
- [x] 4.4 Verificar `npm run build` pasa
- [ ] 4.5 Verificar light mode visualmente (dev server)
- [ ] 4.6 Verificar dark mode visualmente (dev server)

## Phase 5: Cleanup

- [ ] 5.1 Limpiar comments `// TODO: remove dark:` si existen
- [ ] 5.2 Commit cambios
