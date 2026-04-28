# Specification: IA Strategy - Financial Data Integration

## 1. Overview

**Change:** T16 - IA Strategy Financial Data Integration
**Type:** Feature Enhancement
**Status:** Spec Draft
**Created:** 2026-04-28

---

## 2. Problem Statement

IA Strategy needs real "Utilidad Actual" from transaction data to compare against the financial plan.

---

## 3. Requirements

### 3.1 Financial Plan Constants

From `PLAN_FINANCIERO_PIPOD_2026.md`:

| Constant | Value |
|----------|-------|
| Monthly Fixed Costs | $12,149,400 COP |
| Break-even Point | $40,498,000 COP |
| Business Goal (15% net) | $50,000,000 COP |
| Target Margin | 30% |

### 3.2 Utility Calculation

**Formula:**
```
Ventas = SUM(transacciones WHERE tipo='Ingreso')
Costo de Ventas = Calculated from margin (or flat 70% of sales)
Utilidad Bruta = Ventas - Costo de Ventas
Utilidad Neta = Utilidad Bruta - Gastos Fijos ($12,149,400)
```

### 3.3 UI Requirements

#### MetricsGrid Updates
- Show "Ventas del Mes" (from cont_transacciones)
- Show "Utilidad Bruta" calculated
- Show "Utilidad Neta" calculated
- Show "% vs Meta $50M"
- Show "% vs Break-even $40.5M"

#### TrendChart Updates
- Add horizontal line for break-even ($40.5M)
- Add horizontal line for goal ($50M)

---

## 4. Data Flow

```
User logs in
    ↓
useStrategyData loads
    ↓
fetchCurrentMonthTransactions(userId)
    ↓
calculateMetrics(transactions, FIXED_COSTS)
    ↓
Update MetricsGrid with real data
    ↓
Gema chat can reference real numbers
```

---

## 5. Component Changes

### 5.1 New File: `src/lib/strategy-constants.ts`

```typescript
export const FINANCIAL_PLAN = {
  fixedCosts: 12149400,
  breakEven: 40498000,
  businessGoal: 50000000,
  targetMargin: 0.30,
  currency: 'COP',
} as const;
```

### 5.2 Modified: `src/hooks/useStrategyData.ts`

**New function:**
```typescript
async function fetchCurrentMonthTransactions(userId: string): Promise<Transaccion[]>
```

**Modified:**
- `recalculateMetrics` to accept real transaction data
- Add loading state for transaction fetch

### 5.3 Modified: `src/components/ia-strategy/MetricsGrid.tsx`

**New metrics:**
- ventasMes: number
- utilidadBruta: number
- utilidadNeta: number
- pctVsMeta: number
- pctVsBreakEven: number

### 5.4 Modified: `src/components/ia-strategy/TrendChart.tsx`

**Add:**
- Reference lines for break-even and goal

---

## 6. Technical Notes

### 6.1 Date Filtering
- Current month transactions only
- Filter by `fecha` between month start and month end
- Use `user_id` filter for multi-user support

### 6.2 Error Handling
- If query fails, show last cached values
- Show "Sin datos" if no transactions for month

---

## 7. Success Criteria

| # | Criteria |
|---|----------|
| 1 | Build passes without errors |
| 2 | MetricsGrid shows real data from `cont_transacciones` |
| 3 | Break-even line visible on TrendChart |
| 4 | Chat can reference real utility numbers |
| 5 | Performance: query < 500ms |