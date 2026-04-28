# Design: UI Polish G3 V2 — Theme System Refactor + Smart Transaction Defaults

## Technical Approach

### Two-Track Implementation

**Track A: Transacciones Smart Default (Phase 0)**
- Modify `usePaginatedTransactions` to use 30-day rolling window by default
- Change `selectedYear`/`selectedMonth` initial state to computed date range
- Add `dateRange: { start: Date, end: Date }` as primary filter concept
- Month selector remains functional to override the default

**Track B: Theme System Refactor (Phases 1-5)**
- Batch-replace hardcoded zinc colors with semantic CSS tokens
- Add duration tokens to tailwind.config
- A11y pass for charts and KPI indicators

## Architecture Decisions

### Decision: Hook Default Change (Track A)

**Choice**: Default to last 30 days instead of current month
**Alternatives considered**: Option B (fallback to last month with data) — more complex, less transparent
**Rationale**: "Últimos 30 días" always shows activity; user can override with month selector; simpler implementation

**Implementation approach:**
```typescript
// Before (lines 24-25)
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

// After: compute 30 days ago as default
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const defaultStartDate = thirtyDaysAgo.toISOString().split('T')[0];
const defaultEndDate = new Date().toISOString().split('T')[0];

// Change state to use date strings
const [startDate, setStartDate] = useState(defaultStartDate);
const [endDate, setEndDate] = useState(defaultEndDate);
// Keep selectedYear/selectedMonth for UI display but compute from date range
```

**Interface change**: The hook returns `selectedYear`/`selectedMonth` computed from `startDate`/`endDate` for display purposes, but queries use the date range.

### Decision: Token Mapping Strategy (Track B)

**Choice**: Map to existing `bg-*/text-*` utilities (`bg-background`, `text-foreground`)
**Alternatives considered**: Using raw `var(--background)` in className — less maintainable
**Rationale**: Tailwind utilities consume these tokens; using utilities keeps className readable and themeable

### Decision: Animation Duration Standard

**Choice**: Two tokens (`duration-fast: 200ms`, `duration-smooth: 400ms`) in `tailwind.config`
**Alternatives considered**: Using arbitrary values — inconsistent, no semantic meaning
**Rationale**: Semantic tokens communicate intent; future theming can adjust globally

### Decision: A11y for Trends

**Choice**: `sr-only` text span inside the trend indicator element
**Alternatives considered**: `aria-label` on parent — less flexible
**Rationale**: Screen readers read text content; works with existing layout

## Data Flow

### Track A: Transacciones Hook Change

```
usePaginatedTransactions
  ├── state: startDate (30 days ago), endDate (today)
  ├── state: selectedYear/selectedMonth (computed for UI display)
  │
  ├── Query: .gte('fecha', startDate).lte('fecha', endDate)
  │         (NOT filtering by month anymore as primary)
  │
  └── Return: { transacciones, selectedYear, selectedMonth, setSelectedMonth, ... }
              (selectedYear/Month recomputed from date range when user changes filters)
```

### Track B: Theme Refactor

No data flow changes — purely presentational.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/usePaginatedTransactions.ts` | Modify | 30-day default, date range state |
| `tailwind.config.ts` | Modify | Add duration-fast/duration-smooth |
| `src/app/globals.css` | Modify | Verify tokens; add light scrollbar |
| `src/components/Graficas.tsx` | Modify | Tooltip tokens; fix X-axis |
| `src/components/MilestoneLine.tsx` | Modify | Font stack fallback |
| `src/components/kpi-card.tsx` | Modify | Tokens + sr-only labels |
| `src/components/transaction-table.tsx` | Modify | Token refactor |
| `src/components/FilterSelectors.tsx` | Modify | Border tokens |
| `src/components/strategy/StrategyChat.tsx` | Modify | Textarea tokens |
| `src/components/strategy/StrategyMiniChart.tsx` | Modify | Tooltip + responsive |
| `src/components/assistant/AssistantSheet.tsx` | Modify | Full token refactor |
| `src/components/transaccion-form.tsx` | Modify | Input tokens |
| `src/app/dashboard/transacciones/page.tsx` | Modify | Search bar tokens |
| `src/app/dashboard/header.tsx` | Modify | Lucide import; remove SVG |
| `src/app/dashboard/page.tsx` | Modify | Textarea tokens |

## Interfaces / Contracts

### Hook Interface Change

**Before:**
```typescript
return {
  selectedYear, setSelectedYear,
  selectedMonth, setSelectedMonth,
  // ...
}
```

**After:**
```typescript
return {
  startDate, endDate,  // NEW: date range for query
  selectedYear, selectedMonth,  // COMPUTED from date range for UI
  setSelectedYear, setSelectedMonth,  // UPDATED: recompute date range
  // ...
}
```

**Backward compatibility**: `setSelectedMonth(month)` recomputes `startDate`/`endDate` to the first/last day of that month, preserving existing UI behavior.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Hook | 30-day default on mount | Log startDate/endDate on component mount |
| Hook | Month selector still works | Select "Febrero" → verify query uses Feb dates |
| Visual | Light mode components | Toggle dark class; screenshot |
| Visual | Dark mode preserved | Ensure no regressions |
| A11y | Screen reader trends | VoiceOver/NVDA test |
| Build | No TS errors | `npm run build` |
| Grep | No hardcoded zinc | `grep -r "bg-zinc-9[0-5]" src/` |

## Migration / Rollback

No migration needed. Rollback via `git stash` or `git revert`.

## Open Questions

- [ ] Should we show a banner "Mostrando últimos 30 días" when default is active?
- [ ] Do we need to preserve the "current month" behavior as an explicit option?
- [ ] Should we add ESLint rule to block `bg-zinc-9[0-5]`? (Recommended: yes, deferred)