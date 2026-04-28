# Delta for UI (Charts)

## ADDED Requirements

### Requirement: Shadcn Chart Components

The system SHALL replace Recharts components in `Graficas.tsx` with Shadcn Chart primitives wrapped in Framer Motion.

| Existing | Shadcn Chart | Props |
|----------|--------------|-------|
| `BarChart` + `Bar` | `<BarChart>` + `<Bar>` | `dataKey`, `fill`, `name` |
| `AreaChart` + `Area` | `<AreaChart>` + `<Area>` | `dataKey`, `stroke`, `fill`, gradient |
| `PieChart` + `Pie` + `Cell` | `<PieChart>` + `<Pie>` | `innerRadius`, `outerRadius`, `dataKey` |
| `LineChart` + `Line` | `<LineChart>` + `<Line>` | `dataKey`, `stroke`, `strokeWidth`, `dot` |
| `XAxis`, `YAxis`, `Tooltip`, `Legend` | Same primitives | Custom content preserved |

#### Scenario: BarChart renders with Shadcn

- GIVEN category data with `ingresos` and `egresos`
- WHEN "Ingresos vs Egresos por Categoría" renders
- THEN uses `<BarChart>` with fade + scale animation (200ms stagger)

### Requirement: Framer Motion Entry Animation

All chart containers MUST animate on initial render.

| Property | Value |
|----------|-------|
| `initial` | `{ opacity: 0, scale: 0.95 }` |
| `animate` | `{ opacity: 1, scale: 1 }` |
| `transition` | `{ duration: 0.4, ease: "easeOut" }` |
| `staggerChildren` | `0.05` |

#### Scenario: Chart fades in on page load

- GIVEN user navigates to dashboard
- WHEN page finishes loading
- THEN each chart animates from invisible to visible in 400ms

### Requirement: Enhanced Tooltip Styling

Tooltips MUST use Shadcn CSS variables. Preserved behavior: currency format (es-CO, COP), insight text.

| Element | Shadcn Token |
|---------|--------------|
| Background | `bg-popover` |
| Border | `border-border` |
| Text | `text-foreground` |

#### Scenario: Tooltip shows currency with insight

- GIVEN user hovers over a bar
- WHEN position is active
- THEN tooltip displays: label, COP currency, contextual insight (Break-even/Meta Sana)

### Requirement: Category Color Palette

| Chart | Category | Color |
|-------|----------|-------|
| Bar/Area | Ingresos | `#10b981` Emerald |
| Bar/Area | Egresos | `#fb7185` Rose |
| Pie | Cells 1-8 | Rose shades `#fb7185` → `#881337` |
| Line | Balance | `#8b5cf6` Violet |
| Reference | Break-even/Meta | Violet dashed |

#### Scenario: Pie uses rose palette

- GIVEN pie renders expense distribution
- THEN cells use ascending rose shades with legend labels

### Requirement: Chart Container Styling

Card: `bg-card border border-border backdrop-blur-md p-6 rounded-2xl shadow-sm`. Title: `text-lg font-bold text-foreground mb-4`. Accessibility: `role="img"` + `aria-labelledby`.

#### Scenario: Charts maintain card appearance

- GIVEN dashboard renders
- THEN each chart appears in styled card with consistent spacing

## MODIFIED Requirements

### Requirement: Chart Accessibility

(Previously: Basic `aria-label`)

Charts MUST provide descriptive labels explaining purpose and key financial insight.

#### Scenario: Screen reader announces chart

- GIVEN user focuses on chart
- THEN announces: "Gráfico de barras mostrando ingresos y egresos por categoría del período seleccionado"
- AND for AreaChart with milestones: includes break-even/meta reference