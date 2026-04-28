# Tasks: UI Polish G3 V2

## Phase 0: Transacciones Smart Default (CRITICAL - Fix First)

- [x] 0.1 Modify `usePaginatedTransactions.ts` — change state from `selectedYear/selectedMonth` to `startDate/endDate` (30-day rolling window default)
- [x] 0.2 Update query logic — use `.gte('fecha', startDate).lte('fecha', endDate)` instead of month boundaries
- [x] 0.3 Keep `selectedYear`/`selectedMonth` computed from date range for UI selector display
- [x] 0.4 Ensure `setSelectedMonth(month)` recalculates date range boundaries for that month
- [x] 0.5 Add `showingLast30Days: boolean` flag to return object for UI messaging
- [x] 0.6 Verify hook works with existing `transacciones/page.tsx` filter selectors
- [x] 0.7 Test: load page → should show recent transactions (not empty for current month)

## Phase 1: Tailwind Config & CSS Foundation

- [x] 1.1 Add `duration-fast` (200ms) and `duration-smooth` (400ms) to `tailwind.config.ts` under `theme.extend`
- [x] 1.2 Verify all CSS tokens in `globals.css` are complete (background, card, foreground, border, input, muted, etc.)
- [x] 1.3 Add light mode scrollbar styles to `globals.css` (companion to existing `.dark ::-webkit-scrollbar`)

## Phase 2: Core Component Refactors (High Impact)

- [x] 2.4 Refactor `FilterSelectors.tsx` — replace `border-white/10` with `border-border`
- [x] 2.5 Refactor `Graficas.tsx` — replace tooltip hardcoded colors with CSS tokens; fix X-axis labels with `tickFormatter` (show every 5th label)
- [x] 2.3 Refactor `transaction-table.tsx` — replace hardcoded card/border colors (`bg-zinc-950/80` → `bg-card`)
- [x] 2.2 Refactor `transaccion-form.tsx` — same token mapping for inputs and surfaces
- [ ] 2.1 Refactor `assistant/AssistantSheet.tsx` — replace all `bg-zinc-9[0-5]` with `bg-background`/`bg-card`, `text-zinc-1xx` with `text-foreground`

## Phase 3: Secondary Component Refactors

- [x] 3.1 Refactor `kpi-card.tsx` — use `bg-card`/`text-foreground`; add `sr-only` span for trend arrows (e.g., `<span className="sr-only">Aumento del {value}%</span>`)
- [x] 3.2 Refactor `strategy/StrategyChat.tsx` textarea — replace dark-only styling with `bg-input border-border text-foreground`
- [x] 3.5 Refactor `dashboard/transacciones/page.tsx` — replace search bar `bg-zinc-900/50` with `bg-input`
- [ ] 3.3 Refactor `strategy/StrategyMiniChart.tsx` — replace hardcoded tooltip; change fixed `height={120}` to responsive
- [ ] 3.4 Refactor `MilestoneLine.tsx` — add font stack: `'JetBrains Mono', Menlo, Monaco, monospace`

## Phase 4: Header & Page Fixes

- [x] 4.1 Refactor `header.tsx` — remove inline SVG for Settings; import `<Settings />` from `lucide-react`
- [ ] 4.2 Refactor `dashboard/page.tsx` — replace dark-only textarea styling with theme tokens

## Phase 5: Accessibility Pass

- [ ] 5.1 Add `aria-label="Gráfico de evolución temporal mostrando tendencias del período seleccionado"` to AreaChart containers in `Graficas.tsx`
- [ ] 5.2 Add `aria-label` to all Recharts container components in `Graficas.tsx`
- [ ] 5.3 Verify all icon-only buttons have `aria-label` in header, sidebar, kpi-card
- [x] 5.4 Add `sr-only` labels to KPI trend arrows (↗↘)

## Phase 6: Verification

- [x] 6.1 Run `grep -r "bg-zinc-9[0-5]" src/components/` — expect zero matches
- [x] 6.2 Run `grep -r "text-zinc-[0-9][0-9]" src/components/` — expect zero matches (except text-muted-foreground variants that ARE token-based)
- [x] 6.3 Run `npm run build` — must pass without errors
- [ ] 6.4 Toggle dark mode manually — verify light mode renders correctly
- [ ] 6.5 Test transacciones page — should show recent data even on day 1 of month
- [ ] 6.6 Test VoiceOver/NVDA — verify trend arrows and charts are announced
- [ ] 6.7 Test month selector — changing month should override 30-day default correctly