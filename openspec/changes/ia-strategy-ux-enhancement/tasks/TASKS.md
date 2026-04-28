# Tasks: IA Strategy - Real Data Integration (Fase 2 / T16)

## Phase: Apply - Fase 2 Real Data (T16)

---

## Task 1: Create strategy-constants.ts

**File:** `src/lib/strategy-constants.ts`

**Content:**
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

---

## Task 2: Create SQL Migration

**File:** `supabase/migrations/xxx_create_vw_monthly_financial_summary.sql`

**Content:**
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

**Note:** Run this SQL in Supabase Dashboard → SQL Editor

---

## Task 3: Modify API /api/strategy/chat

**File:** `src/app/api/strategy/chat/route.ts`

**Changes:**
- [ ] Import FINANCIAL_PLAN from strategy-constants
- [ ] Query vw_monthly_financial_summary for current month
- [ ] Calculate utility: ventas - egresos - fixedCosts
- [ ] Build financialContext JSON object
- [ ] Inject in system prompt

---

## Task 4: Build Verification

```bash
npm run build
```

---

## Task 5: Manual Testing

**Checklist:**
- [ ] Open IA Strategy page
- [ ] Ask: "¿Cómo voy este mes?"
- [ ] Verify IA responds with real numbers from transactions
- [ ] Check console for errors

---

## Files Summary

| File | Action |
|------|--------|
| `src/lib/strategy-constants.ts` | Create |
| `supabase/migrations/xxx_create_vw_monthly_financial_summary.sql` | Create |
| `src/app/api/strategy/chat/route.ts` | Modify |

---

## Effort Estimate

- Task 1: 10 min
- Task 2: 5 min (SQL in Supabase)
- Task 3: 45 min
- Task 4: 5 min
- Task 5: 10 min

**Total: ~1.5 hours**