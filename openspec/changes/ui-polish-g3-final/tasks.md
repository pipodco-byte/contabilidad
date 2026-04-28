# Tasks: UI Polish G3 Final

## Phase 1: Priority 1 — Critical Components

- [ ] 1.1 Refactor `forms/auth-form.tsx` — replace all `bg-zinc-950/80`, `bg-zinc-900/50`, `text-white`, `text-zinc-500` with tokens (`bg-card`, `bg-input`, `text-foreground`, `text-muted-foreground`)
- [ ] 1.2 Refactor `assistant/AssistantSheet.tsx` — replace all `bg-zinc-9xx`, `text-zinc-1xx`, `border-zinc-8xx` with tokens (35+ instances)
- [ ] 1.3 Refactor `Graficas.tsx` — replace empty state `bg-zinc-950/80` and chart container `bg-white dark:bg-zinc-900/50` with `bg-card border-border`
- [ ] 1.4 Refactor `dashboard/page.tsx` — replace Gema textarea `bg-zinc-900 border-zinc-700 text-zinc-100` with `bg-input border-border text-foreground`

## Phase 2: Priority 2 — Major Components

- [ ] 2.1 Refactor `reports-tabs.tsx` — replace `bg-zinc-950/80 border-zinc-800/50` in tabs wrapper and all cards with tokens
- [ ] 2.2 Refactor `tables/transaction-table.tsx` — replace remaining table container `bg-zinc-950/80` and pagination `text-zinc-400 hover:text-zinc-100` with tokens
- [ ] 2.3 Refactor `command/command-palette.tsx` — replace `bg-zinc-950/95 border-white/10 text-zinc-50` with tokens
- [ ] 2.4 Refactor `PaginationControls.tsx` — replace all `text-zinc-600 dark:text-zinc-400` and `text-zinc-900 dark:text-zinc-100` with tokens
- [ ] 2.5 Refactor `FilterCarousel.tsx` — replace `bg-white dark:bg-zinc-900/50` container and `text-zinc-500 dark:text-zinc-400` labels with tokens
- [ ] 2.6 Refactor `assistant/BatchCard.tsx` — replace `bg-zinc-900/50 border-indigo-500/30` with tokens

## Phase 3: Priority 3 — Minor Components

- [ ] 3.1 Refactor `empty-state.tsx` — replace `text-zinc-600` SVG stroke and `text-zinc-200` title with tokens
- [ ] 3.2 Refactor `strategy/StrategyMessage.tsx` — replace message bubble `bg-zinc-900/50 border-zinc-800` with `bg-secondary border-border`
- [ ] 3.3 Refactor `ui/skeleton.tsx` — replace `bg-zinc-900/50` skeleton backgrounds with `bg-muted`
- [ ] 3.4 Refactor `dashboard/kpi-card.tsx` — replace `bg-white dark:bg-zinc-950/80 border-zinc-200/50 dark:border-zinc-800/50` with `bg-card border-border`
- [ ] 3.5 Refactor `strategy/DataPanel.tsx` — replace `border-zinc-800/50 bg-zinc-900/10` with tokens
- [ ] 3.6 Refactor `dashboard/config/page.tsx` — replace `bg-zinc-950/80` containers with `bg-card`

## Phase 4: Root Layout & Landing

- [ ] 4.1 Refactor `app/layout.tsx` — replace `bg-slate-50 dark:bg-slate-950` with `bg-background`
- [ ] 4.2 Refactor `app/page.tsx` — replace `bg-slate-50 dark:bg-slate-950` body with `bg-background`

## Phase 5: Accessibility & Polish

- [ ] 5.1 Add `aria-label="Gráfico de evolución temporal mostrando tendencias del período seleccionado"` to AreaChart in `Graficas.tsx`
- [ ] 5.2 Add `aria-label` to BarChart, PieChart, LineChart containers in `Graficas.tsx`
- [ ] 5.3 Verify `globals.css` scrollbar styles work for both modes
- [ ] 5.4 Verify `tailwind.config.js` has `duration-fast` and `duration-smooth` tokens

## Phase 6: Verification

- [ ] 6.1 Run `grep -r "bg-zinc-9[0-5]" src/components/ | wc -l` — expect < 10 (only markdown/code intentional uses)
- [ ] 6.2 Run `npm run build` — must pass
- [ ] 6.3 Toggle dark mode manually — all components render correctly in both themes
- [ ] 6.4 Test transacciones page — 30-day default still works
- [ ] 6.5 Test AssistantSheet — Copilot opens and renders correctly in both modes