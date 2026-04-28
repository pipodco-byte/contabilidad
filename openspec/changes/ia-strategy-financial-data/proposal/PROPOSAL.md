# Proposal: IA Strategy - Financial Data Integration (T16)

## Intent

IA Strategy currently has manual inputs for fixed costs but lacks real "Utilidad Actual" calculation from transaction data. Integrate the `PLAN_FINANCIERO_PIPOD_2026.md` data and calculate real utility vs planned utility.

## Scope

### In Scope
- Load financial plan data (fixed costs $12.1M, break-even $40.5M, meta $50M)
- Fetch real transaction data from `cont_transacciones` for current month
- Calculate "Utilidad Real": `Ventas - Costo de Ventas - Gastos Fijos`
- Compare actual vs plan in MetricsGrid
- Add break-even indicator line to charts

### Out of Scope
- Historical trend analysis (future work)
- Multi-month projections (future work)
- PDF report generation (separate feature)

## Approach

1. **Create financial constants** from PLAN_FINANCIERO in `/lib/strategy-constants.ts`
2. **Extend `useStrategyData`** to fetch real transactions and calculate metrics
3. **Update `MetricsGrid`** to show actual vs plan comparison
4. **Add break-even line** to trend chart

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/strategy-constants.ts` | New | Financial plan constants |
| `src/hooks/useStrategyData.ts` | Modified | Fetch transactions + calc utility |
| `src/components/ia-strategy/MetricsGrid.tsx` | Modified | Show actual vs plan |
| `src/components/ia-strategy/TrendChart.tsx` | Modified | Add break-even line |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Query performance (large datasets) | Med | Add date range filter |
| Financial data hardcoded | Low | Load from file/API in future |

## Rollback Plan

Revert to previous `useStrategyData.ts` - localStorage data remains unchanged.

## Dependencies

- `cont_transacciones` table with correct `user_id` filter
- `PLAN_FINANCIERO_PIPOD_2026.md` (already exists)

## Success Criteria

- [ ] MetricsGrid shows "Utilidad Real" calculated from transactions
- [ ] Break-even line visible on trend chart
- [ ] Compare: "Ventas Reales vs Meta $50M"
- [ ] Build passes