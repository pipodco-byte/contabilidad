# Specification: IA Strategy - Real Data Integration (Fase 2 / T16)

## 1. Overview

**Change:** Fase 2 - Real Data Integration (T16)
**Type:** Feature Enhancement
**Status:** Spec Draft
**Created:** 2026-04-28

---

## 2. Problem Statement

IA Strategy currently uses manual inputs for financial calculations. It lacks access to real transaction data from `cont_transacciones` to calculate actual utility.

---

## 3. Requirements

### 3.1 Financial Constants

Create `strategy-constants.ts` with financial plan data:

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

### 3.2 SQL View

Create View for monthly financial summary:

```sql
CREATE VIEW vw_monthly_financial_summary AS
SELECT
  user_id,
  date_trunc('month', created_at) as mes,
  SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END) as ventas_totales,
  SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END) as egresos_totales,
  COUNT(*) as num_transacciones
FROM cont_transacciones
GROUP BY user_id, date_trunc('month', created_at);
```

### 3.3 Utility Calculation

```
Utilidad Neta = Ventas - Egresos - Gastos Fijos

Donde:
- Ventas = SUM(monto) WHERE tipo = 'Ingreso' (mes actual)
- Egresos = SUM(monto) WHERE tipo = 'Egreso' (mes actual)
- Gastos Fijos = $12,149,400 (de constants)
```

### 3.4 API Integration

Modify `/api/strategy/chat` to:
1. Query View for current month data
2. Calculate utility
3. Inject as JSON context in prompt

---

## 4. Data Flow

```
User asks: "¿Cómo voy este mes?"
        ↓
API /api/strategy/chat receives request
        ↓
Query vw_monthly_financial_summary for current month
        ↓
Calculate: Utilidad = Ventas - Egresos - $12.1M
        ↓
Build JSON context:
{
  "contexto_financiero_real": {
    "ventas": 15000000,
    "egresos": 2000000,
    "gastos_fijos": 12149400,
    "utilidad_neta": 850600,
    "mes": "2026-04"
  }
}
        ↓
Send to DeepSeek with context
        ↓
IA responds with real data analysis
```

---

## 5. Component Changes

### 5.1 New File: `src/lib/strategy-constants.ts`

```typescript
export const FINANCIAL_PLAN = { ... } as const;
export const FIXED_COSTS_BREAKDOWN = [...] as const;
```

### 5.2 Modified: `src/app/api/strategy/chat/route.ts`

**Changes:**
- Import FINANCIAL_PLAN
- Query `vw_monthly_financial_summary` for user_id + current month
- Calculate utility
- Inject context in prompt

### 5.3 New Migration: `supabase/migrations/xxx_create_vw_monthly_financial_summary.sql`

```sql
CREATE VIEW vw_monthly_financial_summary AS ...
```

---

## 6. Dependencies

- `cont_transacciones` table with data
- Supabase access for View creation

---

## 7. Success Criteria

- [ ] View SQL created and accessible
- [ ] strategy-constants.ts exports correct values
- [ ] API injects real financial data in prompt
- [ ] IA responds with: "Tu utilidad neta es $X"
- [ ] Build passes