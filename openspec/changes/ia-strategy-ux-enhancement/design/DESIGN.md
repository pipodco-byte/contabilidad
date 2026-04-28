# Design: IA Strategy - Real Data Integration (Fase 2 / T16)

## 1. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   strategy-constants.ts                       │
│  FINANCIAL_PLAN = {                                        │
│    fixedCosts: 12149400,                                  │
│    breakEven: 40498000,                                  │
│    businessGoal: 50000000                                 │
│  }                                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              supabase vw_monthly_financial_summary         │
│  SELECT user_id, mes, ventas_totales, egresos_totales      │
│  FROM cont_transacciones                                   │
│  GROUP BY date_trunc('month', created_at)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              /api/strategy/chat/route.ts                    │
│  1. Get user_id from session                               │
│  2. Query View for current month                           │
│  3. Calculate: utilidad = ventas - egresos - fixedCosts    │
│  4. Inject JSON context in prompt                         │
│  5. Send to DeepSeek                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Files to Create/Modify

### 2.1 New: `src/lib/strategy-constants.ts`

```typescript
export const FINANCIAL_PLAN = {
  fixedCosts: 12149400,
  breakEven: 40498000,
  businessGoal: 50000000,
  targetMargin: 0.30,
  currency: 'COP',
} as const;

export const FIXED_COSTS_BREAKDOWN = [
  { label: 'Nóminas', amount: 8000000 },
  { label: 'Mensajero', amount: 1500000 },
  { label: 'Arriendo', amount: 1200000 },
  { label: 'Servicios', amount: 500000 },
  { label: 'Marketing', amount: 500000 },
  { label: 'Otros', amount: 394400 },
] as const;
```

### 2.2 New: `supabase/migrations/xxx_create_vw_monthly_financial_summary.sql`

```sql
CREATE OR REPLACE VIEW vw_monthly_financial_summary AS
SELECT
  user_id,
  date_trunc('month', created_at)::date as mes,
  SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END) as ventas_totales,
  SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END) as egresos_totales,
  COUNT(*) as num_transacciones
FROM cont_transacciones
GROUP BY user_id, date_trunc('month', created_at);
```

### 2.3 Modified: `src/app/api/strategy/chat/route.ts`

```typescript
import { FINANCIAL_PLAN } from '@/lib/strategy-constants';
import { createServerClient } from '@/lib/supabase';

// In the handler:
const supabase = createServerClient();

// Get current month
const now = new Date();
const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

// Query View
const { data: financialData } = await supabase
  .from('vw_monthly_financial_summary')
  .select('*')
  .eq('user_id', user.id)
  .gte('mes', monthStart)
  .lte('mes', monthEnd)
  .single();

// Calculate utility
const ventas = financialData?.ventas_totales || 0;
const egresos = financialData?.egresos_totales || 0;
const utilidadNeta = ventas - egresos - FINANCIAL_PLAN.fixedCosts;

// Build context
const financialContext = {
  ventas,
  egresos,
  gastos_fijos: FINANCIAL_PLAN.fixedCosts,
  utilidad_neta: utilidadNeta,
  mes: now.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
  break_even: FINANCIAL_PLAN.breakEven,
  meta: FINANCIAL_PLAN.businessGoal,
};

// Inject in prompt
const systemPrompt = `
... existing prompt ...

## Contexto Financiero Real (Mes Actual)
${JSON.stringify(financialContext, null, 2)}

Usa estos datos reales para tu análisis.
`;
```

---

## 3. Testing Checklist

- [ ] View returns correct data for user
- [ ] Constants export correct values
- [ ] API calculates utility correctly
- [ ] Prompt includes financial context
- [ ] IA responds with real numbers
- [ ] Build passes

---

## 4. Error Handling

| Scenario | Handling |
|----------|----------|
| No transactions this month | Return zeros: `{ ventas: 0, egresos: 0 }` |
| View doesn't exist | Log error, continue without context |
| Query fails | Log error, continue without context |