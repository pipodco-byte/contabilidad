# DESIGN: G3 - Visual Milestones (Líneas de Meta en Gráficos)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ Graficas.tsx                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ AreaChart (Evolución Temporal)                            │  │
│  │  ├─ Area: Ingresos (emerald)                             │  │
│  │  ├─ Area: Egresos (rose)                                 │  │
│  │  ├─ ReferenceLine: Gastos Fijos ($12.1M) - Rose dashed   │  │
│  │  ├─ ReferenceLine: Break-even ($40.5M) - Indigo solid    │  │
│  │  └─ ReferenceLine: Meta Sana ($50M) - Emerald dashed     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ LineChart (Balance Neto)                                  │  │
│  │  ├─ Line: Balance                                        │  │
│  │  ├─ ReferenceLine: Gastos Fijos ($12.1M)                 │  │
│  │  ├─ ReferenceLine: Break-even ($40.5M)                  │  │
│  │  └─ ReferenceLine: Meta Sana ($50M)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ReferenceLines Component

### New Component: MilestoneLines.tsx (Optional Reusable)

**Path:** `src/components/MilestoneLines.tsx`

```tsx
import { ReferenceLine, ReferenceLineProps } from 'recharts';
import { FINANCIAL_PLAN } from '@/lib/strategy-constants';

interface MilestoneLineProps extends Omit<ReferenceLineProps, 'y'> {
  value: number;
  type: 'fixed' | 'breakEven' | 'meta';
}

export function MilestoneLine({ value, type, ...props }: MilestoneLineProps) {
  const config = {
    fixed: {
      stroke: '#fb7185', // rose-400
      strokeDasharray: '3 3',
      label: { value: `Fijos $${(value / 1e6).toFixed(0)}M`, fill: '#fb7185' },
    },
    breakEven: {
      stroke: '#6366f1', // indigo-500
      strokeDasharray: undefined, // solid
      label: { value: `Break-even $${(value / 1e6).toFixed(0)}M`, fill: '#6366f1' },
    },
    meta: {
      stroke: '#10b981', // emerald-500
      strokeDasharray: '5 5',
      strokeWidth: 2,
      label: { value: `Meta $${(value / 1e6).toFixed(0)}M`, fill: '#10b981' },
    },
  }[type];

  return (
    <ReferenceLine
      y={value}
      stroke={config.stroke}
      strokeDasharray={config.strokeDasharray}
      strokeWidth={config.strokeWidth}
      isFront={false}
      label={{
        ...config.label,
        position: 'insideTopRight',
        fillOpacity: 0.6,
        fontSize: 10,
        fontFamily: 'monospace',
      }}
      {...props}
    />
  );
}
```

### Usage in Graficas.tsx

```tsx
// Import
import { MilestoneLine } from '@/components/MilestoneLines';

// In AreaChart (Evolución Temporal)
<AreaChart data={datosAnuales} ...>
  <defs>...gradients...</defs>
  <CartesianGrid ... />
  <XAxis ... />
  <YAxis
    domain={[0, Math.max(dataMax, FINANCIAL_PLAN.businessGoal * 1.2)]}
    tickFormatter={formatCurrencyCompact}
  />
  <Tooltip contentStyle={tooltipStyle} />
  <Legend />
  <Area type="monotone" dataKey="ingresos" ... />
  <Area type="monotone" dataKey="egresos" ... />

  {/* Milestone Lines - isFront={false} para no obstruct data */}
  <MilestoneLine value={FINANCIAL_PLAN.fixedCosts} type="fixed" />
  <MilestoneLine value={FINANCIAL_PLAN.breakEven} type="breakEven" />
  <MilestoneLine value={FINANCIAL_PLAN.businessGoal} type="meta" />
</AreaChart>

// In BalanceLine (Balance Neto)
<LineChart data={mesesOrdenados} ...>
  <CartesianGrid ... />
  <XAxis ... />
  <YAxis
    domain={[0, Math.max(dataMax, FINANCIAL_PLAN.businessGoal * 1.2)]}
    tickFormatter={formatCurrencyCompact}
  />
  <Tooltip contentStyle={tooltipStyle} />
  <Legend />
  <ReferenceLine y={0} ... />
  <Line type="monotone" dataKey="balance" ... />

  {/* Milestone Lines */}
  <MilestoneLine value={FINANCIAL_PLAN.fixedCosts} type="fixed" />
  <MilestoneLine value={FINANCIAL_PLAN.breakEven} type="breakEven" />
  <MilestoneLine value={FINANCIAL_PLAN.businessGoal} type="meta" />
</LineChart>
```

---

## Tooltip Enhancement

### Custom Tooltip with Micro-Insights

```tsx
interface MilestoneTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

const formatTooltipInsight = (value: number): string => {
  const breakEven = FINANCIAL_PLAN.breakEven;
  const metaSana = FINANCIAL_PLAN.businessGoal;

  if (value < breakEven) {
    const falta = breakEven - value;
    return `Faltan $${(falta / 1e6).toFixed(1)}M para el Break-even`;
  }
  if (value < metaSana) {
    const pct = ((value - breakEven) / (metaSana - breakEven) * 100).toFixed(0);
    return `Superaste el Break-even. Vas ${pct}% camino a la Meta Sana`;
  }
  const exceso = value - metaSana;
  return `¡Meta alcanzada! Excediste por $${(exceso / 1e6).toFixed(1)}M`;
};

export function MilestoneTooltip({ active, payload, label }: MilestoneTooltipProps) {
  if (!active || !payload?.length) return null;

  const value = payload[0].value;
  const insight = formatTooltipInsight(value);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3">
      <p className="text-zinc-100 font-medium">{label}</p>
      <p className="text-zinc-300">
        {new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          notation: 'compact',
        }).format(value)}
      </p>
      <p className="text-emerald-400 text-sm mt-1">{insight}</p>
    </div>
  );
}
```

---

## Mobile Guardrails

### Siguiente Boya Logic

```tsx
const getSiguienteBoya = (currentValue: number) => {
  const fixed = FINANCIAL_PLAN.fixedCosts;
  const breakEven = FINANCIAL_PLAN.breakEven;
  const meta = FINANCIAL_PLAN.businessGoal;

  if (currentValue < fixed) {
    return { value: fixed, type: 'fixed', label: 'Suelo' };
  }
  if (currentValue < breakEven) {
    return { value: breakEven, type: 'breakEven', label: 'Break-even' };
  }
  if (currentValue < meta) {
    return { value: meta, type: 'meta', label: 'Meta Sana' };
  }
  return null; // Meta alcanzada - no mostrar línea
};

// In component
const isMobile = useMediaQuery('(max-width: 640px)');
const currentValue = data[data.length - 1]?.balance || 0;
const siguienteBoya = getSiguienteBoya(currentValue);

{!isMobile ? (
  <>
    <MilestoneLine value={fixed} type="fixed" />
    <MilestoneLine value={breakEven} type="breakEven" />
    <MilestoneLine value={meta} type="meta" />
  </>
) : siguienteBoya && (
  <MilestoneLine value={siguienteBoya.value} type={siguienteBoya.type} />
)}
```

---

## Data Flow

```
PLAN_FINANCIERO_PIPOD_2026.md
         ↓
strategy-constants.ts (FINANCIAL_PLAN)
         ↓
Graficas.tsx → AreaChart → MilestoneLine (3x)
         ↓
BalanceLine → MilestoneLine (3x)
         ↓
TrendChart.tsx (DataPanel) → MilestoneLine (3x)
```

---

## Dependencies

| Dependency | Source | Usage |
|------------|--------|-------|
| recharts | Existing | ReferenceLine, AreaChart, LineChart |
| strategy-constants.ts | Existing | FINANCIAL_PLAN.fixedCosts, .breakEven, .businessGoal |

---

## Testing Strategy

1. **Visual:** Verificar 3 líneas en AreaChart y BalanceLine
2. **Domain:** Mock con $5M data → Y-axis debe llegar a $60M
3. **Mobile:** Resize a `sm` → solo "Siguiente Boya" visible
4. **Tooltip:** Hover → verificar micro-insight correcto
5. **Build:** `npm run build` pasa sin errores