# SPEC: G3 - Visual Milestones (Líneas de Meta en Gráficos)

## Overview

**Change:** `visual-milestones-g3`
**Type:** Enhancement (Data Visualization)
**Priority:** High

---

## Requirements

### R1: Reference Lines en Gráficos

**Archivos:** `src/components/Graficas.tsx`

| Gráfico | Reference Lines | Razón |
|---------|-----------------|-------|
| AreaChart (Evolución Temporal) | ✅ 3 líneas | "Pendiente" - ¿subimos suficientemente rápido? |
| BalanceLine (Balance Neto) | ✅ 3 líneas | "Termómetro de vitalidad" |
| BarChart (Categorías) | ❌ NO | "Ruido visual" - metas son globales |

**Single Source of Truth:** `strategy-constants.ts`

```typescript
// strategy-constants.ts (existing)
export const FINANCIAL_PLAN = {
  fixedCosts: 12149400,      // Gastos Fijos
  breakEven: 40498000,      // Break-even
  businessGoal: 50000000,   // Meta Negocio Sano
};
```

### R2: Estilo de Líneas (Radar de Navegación)

| Meta | Color | Estilo | isFront |
|------|-------|--------|---------|
| Gastos Fijos ($12.1M) | `rose-400` (#fb7185) | `strokeDasharray="3 3"` | `false` |
| Break-even ($40.5M) | `indigo-500` (#6366f1) | Sólida | `false` |
| Meta Sana ($50M) | `emerald-500` (#10b981) | `strokeDasharray="5 5"`, `strokeWidth={2}` | `false` |

**Jerarquía Visual:** `isFront={false}` asegura que datos reales sean siempre el protagonista.

### R3: Dominio Dinámico del Eje Y

**Problema:** Si Pipod lleva $5M facturados, la meta de $50M podría quedar "clipeada".

**Fórmula:**
```
Ydomain = [0, max(dataMax, businessGoal * 1.2)]
```

**Buffer 20% (1.2):**
> "El espacio negativo (aire) es sinónimo de lujo y claridad."

```typescript
// Implementación
const maxValue = Math.max(
  dataMax,
  FINANCIAL_PLAN.businessGoal * 1.2  // $60M
);
const yDomain: [number, number] = [0, maxValue];
```

### R4: Smart Labels

**Problema:** 3 etiquetas pueden amontonarse.

**Solución:**
- Posición: `position="insideTopRight"`
- Tipografía: Monoespaciada, `fontSize={10}`
- Opacidad: `fillOpacity={0.6}`
- Smart collapse: En hover revela label de Meta si está solapada

```typescript
<ReferenceLine
  y={FINANCIAL_PLAN.businessGoal}
  stroke="var(--color-emerald-500)"
  strokeDasharray="5 5"
  strokeWidth={2}
  label={{
    value: "Meta $50M",
    position: "insideTopRight",
    fill: "var(--color-emerald-500)",
    fillOpacity: 0.6,
    fontSize: 10,
    fontFamily: "monospace",
  }}
/>
```

### R5: Mobile Guardrails (Responsividad)

**Problema:** En `sm` (celular), 3 líneas + datos = ruido.

**Regla:** En pantallas pequeñas, mostrar solo la **"Siguiente Boya"**:
- Si valor actual < $12.1M → mostrar Gastos Fijos
- Si valor actual >= $12.1M Y < $40.5M → mostrar Break-even
- Si valor actual >= $40.5M Y < $50M → mostrar Meta Sana
- Si valor actual >= $50M → no mostrar líneas (meta alcanzada)

```typescript
// Mobile detection
const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

// En AreaChart/BalanceLine
{!isMobile && (
  <>
    <ReferenceLineGastosFijos />
    <ReferenceLineBreakEven />
    <ReferenceLineMetaSana />
  </>
)}
{isMobile && <SiguienteBoya />}
```

### R6: Tooltip Micro-Insights

**Lógica:**

```
SI valorActual < $40.5M:
  → Label: "Faltan $X para el Break-even"
  → Color: warning (indigo)

SI valorActual >= $40.5M Y < $50M:
  → Label: "Vas Y% camino a la Meta Sana"
  → Color: success (emerald)

SI valorActual >= $50M:
  → Label: "¡Meta alcanzada! Excediste por $X"
  → Color: success (emerald)
```

**Implementación:**
```typescript
const formatTooltipInsight = (value: number, label: string) => {
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
```

### R7: TrendChart en DataPanel (IA Strategy)

**Archivo:** `src/components/strategy/TrendChart.tsx`

Integrar ReferenceLines en el mini chart del DataPanel para consistencia.

---

## Acceptance Criteria

| ID | Criteria | Test |
|----|----------|------|
| AC1 | AreaChart muestra 3 ReferenceLines | Visual |
| AC2 | BalanceLine muestra "línea de flotación" | Visual |
| AC3 | Y-axis muestra buffer 20% cuando datos < meta | Visual con mock data |
| AC4 | Smart Labels tienen opacidad 0.6 | Visual |
| AC5 | Mobile muestra solo "Siguiente Boya" | Responsive test |
| AC6 | Tooltip muestra distancia a meta correcta | Hover test |
| AC7 | isFront={false} en todas las ReferenceLines | Code review |
| AC8 | Build pasa sin errores | `npm run build` |

---

## Design Tokens (Referencia)

```css
--color-emerald-500: #10b981;
--color-emerald-900: #064e3b;
--color-rose-400: #fb7185;
--color-rose-900: #881337;
--color-zinc-400: #a1a1aa;
--color-indigo-500: #6366f1;
--color-zinc-900: #18181b;
```

---

## Dependencies

| Deps | Source | Usage |
|------|--------|-------|
| recharts | Existing | ReferenceLine, Label, AreaChart, LineChart |
| strategy-constants.ts | Existing (Fase 2) | FINANCIAL_PLAN values |

---

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Líneas obstruct data | Med | isFront={false}, opacity tuning |
| Y-axis clipping | Low | Fórmula dinámica verificada |
| Mobile noise | Med | Mobile Guardrails implementados |
| Solapamiento labels | Med | Smart Labels con hover reveal |