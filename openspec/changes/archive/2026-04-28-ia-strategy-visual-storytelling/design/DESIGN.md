# DESIGN: IA Strategy - Visual Storytelling

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ StrategyChat                                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ StrategyMessageList (scrollable)                    │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ StrategyMiniChart (Fase 4 - NEW)                     │  │
│  │  └─ AreaChart (recharts)                            │  │
│  │      ├─ Area: Ingresos (emerald)                    │  │
│  │      ├─ Area: Egresos (rose)                        │  │
│  │      ├─ Line: Gastos Fijos (zinc dashed)            │  │
│  │      └─ Line: Break-even (indigo solid)             │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ StrategyInput                                        │  │
│  │  └─ StrategyVoiceButton                             │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Fase 5: The Captain's Log (Narrative)

### File Changes

| File | Action | Change |
|------|--------|--------|
| `src/lib/strategy-prompt.ts` | Modify | Add Captain voice to `STRATEGY_ADVISOR_SYSTEM_PROMPT` |

### Strategy Prompt Update

```typescript
// Current structure (simplified)
export const STRATEGY_ADVISOR_SYSTEM_PROMPT = `...`;

// New structure with Captain's voice
export const STRATEGY_ADVISOR_SYSTEM_PROMPT = `Eres el Capitán del navío empresarial de Felipe...

REGLAS DE NARRATIVA:
1. Cuando analices números, cuéntales la historia - no solo los reportes
2. Estructura: Apertura (situación) → Desarrollo (números en contexto) → Cierre (acción)
3. Usa fechas específicas para anchored memories
4. Siempre da next recommended action

EJEMPLO DE TONO:
"Los vientos fueron favorables hoy, Felipe. Tu vela de ingresos capturó [15M COP]..."
`;
```

### Implementation Notes

- Modificar solo el system prompt (no crear archivo nuevo)
- Mantener backward compatibility
- Testear con mensajes de prueba

---

## Fase 4: Visual Insights (Data Viz)

### New Files

| File | Purpose |
|------|---------|
| `src/components/strategy/StrategyMiniChart.tsx` | Mini combo chart component |

### StrategyMiniChart.tsx

```tsx
import {
  AreaChart,
  Area,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DataPoint {
  month: string;
  ingresos: number;
  egresos: number;
  gastosFijos?: number;
  breakEven?: number;
}

interface StrategyMiniChartProps {
  data: DataPoint[];
  showLegend?: boolean;
}

export function StrategyMiniChart({ data, showLegend = false }: StrategyMiniChartProps) {
  return (
    <div className="h-[120px] w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          {/* Ingresos - Area Emerald */}
          <Area
            type="monotone"
            dataKey="ingresos"
            stroke="var(--color-emerald-500)"
            fill="var(--color-emerald-900)"
            fillOpacity={0.3}
            strokeWidth={1}
          />
          {/* Egresos - Area Rose */}
          <Area
            type="monotone"
            dataKey="egresos"
            stroke="var(--color-rose-400)"
            fill="var(--color-rose-900)"
            fillOpacity={0.3}
            strokeWidth={1}
          />
          {/* Gastos Fijos - Line Zinc Dashed */}
          <Line
            type="monotone"
            dataKey="gastosFijos"
            stroke="var(--color-zinc-400)"
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
          />
          {/* Break-even - Line Indigo Solid */}
          <Line
            type="monotone"
            dataKey="breakEven"
            stroke="var(--color-indigo-500)"
            strokeWidth={1}
            dot={false}
          />
          <XAxis dataKey="month" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: 'var(--color-zinc-900)',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Integration in StrategyChat

```tsx
// In StrategyChat.tsx - add above the input
import { StrategyMiniChart } from './StrategyMiniChart';

// Inside the component:
<div className="px-4 py-3 border-b border-zinc-800">
  <StrategyMiniChart data={monthlyData} />
</div>
```

### Data Flow

```
SQL View vw_monthly_financial_summary
         ↓
getFinancialContext() (existing - Fase 2)
         ↓
StrategyChat passes to StrategyMiniChart
         ↓
AreaChart renders 12 months
```

### Reusing Existing Infrastructure

- **recharts:** Already installed
- **AreaChart pattern:** Already exists in `Graficas.tsx`
- **Design tokens:** Already defined in CSS variables
- **Monthly data:** From `getFinancialContext()` (Fase 2)

---

## Dependencies

| Dependency | Source | Usage |
|------------|--------|-------|
| recharts | Existing | AreaChart, Line, Tooltip, etc. |
| strategy-constants.ts | Existing (Fase 2) | BREAK_EVEN, GASTOS_FIJOS values |
| getFinancialContext() | Existing (Fase 2) | Monthly financial data |
| StrategyChat.tsx | Existing (Fase 1) | Container component |

---

## Testing Strategy

### Narrative (Fase 5)
1. Send test message asking about finances
2. Verify response has: Apertura → Desarrollo → Cierre structure
3. Verify tone is "Capitán" (not generic AI)

### Visual (Fase 4)
1. Verify `StrategyMiniChart` renders without errors
2. Verify all 4 data series visible
3. Verify colors match Zinc aesthetic
4. Verify tooltips work on hover