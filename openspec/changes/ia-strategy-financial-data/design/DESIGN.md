# Design: IA Strategy - Financial Data Integration

## 1. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    useStrategyData.ts                        │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │ localStorage     │    │ Transaction Calculator       │   │
│  │ (manual inputs) │    │ - fetchCurrentMonthTx()      │   │
│  │ - fixedCosts    │    │ - calculateUtility()         │   │
│  │ - currentCash   │    │ - compareToPlan()            │   │
│  └─────────────────┘    └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MetricsGrid.tsx                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Ventas Mes │  │ Util Bruta  │  │ Util Neta vs Meta   │  │
│  │ Real data  │  │ Calculated  │  │ % indicator        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Files to Modify/Create

### New File
| File | Purpose |
|------|---------|
| `src/lib/strategy-constants.ts` | Financial plan constants |

### Modified Files
| File | Changes |
|------|---------|
| `src/hooks/useStrategyData.ts` | Add `fetchCurrentMonthTransactions()`, update `recalculateMetrics()` |
| `src/components/ia-strategy/MetricsGrid.tsx` | Add new metric cards for actual data |
| `src/components/ia-strategy/TrendChart.tsx` | Add reference lines |

---

## 3. Implementation Details

### 3.1 strategy-constants.ts

```typescript
export const FINANCIAL_PLAN = {
  fixedCosts: 12149400,
  breakEven: 40498000,
  businessGoal: 50000000,
  targetMargin: 0.30,
  currency: 'COP',
  fixedCostDetails: [
    { label: 'Nóminas', amount: 8000000 },
    { label: 'Mensajero', amount: 1500000 },
    { label: 'Arriendo', amount: 1200000 },
    { label: 'Servicios', amount: 500000 },
    { label: 'Marketing', amount: 500000 },
    { label: 'Otros', amount: 394400 },
  ],
} as const;
```

### 3.2 useStrategyData.ts Changes

```typescript
// Add to useStrategyDataReturn interface
fetchTransactionsForMetrics: (userId: string) => Promise<Transaccion[]>

// New function
async function fetchCurrentMonthTransactions(userId: string): Promise<Transaccion[]> {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('cont_transacciones')
    .select('*')
    .eq('user_id', userId)
    .gte('fecha', startDate)
    .lte('fecha', endDate);

  if (error) throw error;
  return data || [];
}

// Update recalculateMetrics
function recalculateMetrics(transactions: Transaccion[]) {
  const ventas = transactions
    .filter(t => t.tipo === 'Ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const costos = ventas * 0.70; // 30% margin assumption
  const utilidadBruta = ventas - costos;
  const utilidadNeta = utilidadBruta - FINANCIAL_PLAN.fixedCosts;

  const calculated = {
    ...strategyData.calculatedMetrics,
    avgRevenue: ventas,
    profitMarginMonthly: utilidadNeta > 0 ? utilidadNeta / ventas : 0,
    // ... other metrics
  };

  setStrategyData(prev => ({ ...prev, calculatedMetrics: calculated }));
}
```

### 3.3 MetricsGrid Updates

```tsx
// New metric cards
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  <MetricCard
    label="Ventas del Mes"
    value={formatCurrency(ventasReales)}
    subtext="Real from transactions"
    trend={ventasReales / FINANCIAL_PLAN.businessGoal}
  />
  <MetricCard
    label="Utilidad Neta"
    value={formatCurrency(utilidadNeta)}
    trend={utilidadNeta / (ventasReales * 0.15)}
    alert={utilidadNeta < 0}
  />
  <MetricCard
    label="% vs Meta $50M"
    value={`${((ventasReales / FINANCIAL_PLAN.businessGoal) * 100).toFixed(1)}%`}
    status={ventasReales >= FINANCIAL_PLAN.businessGoal ? 'good' : 'warning'}
  />
  <MetricCard
    label="Break-even Status"
    value={ventasReales >= FINANCIAL_PLAN.breakEven ? '✓' : '✗'}
    subtext={ventasReales >= FINANCIAL_PLAN.breakEven ? 'Above break-even' : 'Below break-even'}
  />
</div>
```

### 3.4 TrendChart Reference Lines

```tsx
// In recharts ReferenceLine
<ReferenceLine
  y={FINANCIAL_PLAN.breakEven}
  stroke="#10b981"
  strokeDasharray="3 3"
  label="Break-even"
/>
<ReferenceLine
  y={FINANCIAL_PLAN.businessGoal}
  stroke="#6366f1"
  strokeDasharray="3 3"
  label="Meta $50M"
/>
```

---

## 4. Testing Checklist

- [ ] Query returns correct month transactions
- [ ] Utility calculation matches expected formula
- [ ] MetricsGrid displays all new cards
- [ ] TrendChart shows reference lines
- [ ] Error state handles empty transactions
- [ ] Build passes