# Delta for UI

## MODIFIED Requirements

### Requirement: Theme-Aware Components

All UI components that render surfaces (backgrounds, cards, inputs) MUST use semantic CSS design tokens instead of hardcoded Tailwind color utilities. The system MUST support both light and dark modes via the `dark` class on `<html>`.

**Mapping Table:**
| Hardcoded Class | Semantic Token | Purpose |
|-----------------|----------------|---------|
| `bg-zinc-950` | `bg-background` | Page background |
| `bg-zinc-900` | `bg-card` / `bg-secondary` | Card surfaces |
| `text-zinc-100` | `text-foreground` | Primary text |
| `text-zinc-400` | `text-muted-foreground` | Secondary text |
| `border-zinc-800` | `border-border` | Borders and dividers |
| `bg-zinc-950/80` | `bg-card/80` | Translucent card surfaces |
| `border-white/10` | `border-border` | Invisible borders fixed |
| `bg-zinc-900/50` | `bg-input` | Input backgrounds |

(Previously: Components used hardcoded `bg-zinc-9[0-5]` classes making light mode unusable)

#### Scenario: Dashboard renders in light mode

- GIVEN user has `dark` class removed from `<html>`
- WHEN dashboard page loads
- THEN all components use light theme tokens (`--background: 0 0% 100%`, `--foreground: 222.2 84% 4.9%`)
- AND all text is legible (contrast ≥ 4.5:1)
- AND all card surfaces use `--card` background

#### Scenario: Dashboard renders in dark mode

- GIVEN user has `dark` class present on `<html>`
- WHEN dashboard page loads
- THEN all components use dark theme tokens (`--background: 240 10% 3.9%`, `--foreground: 0 0% 98%`)
- AND all text is legible against dark background

### Requirement: Standardized Animation Durations

The system SHOULD define two global animation duration standards. All transitions MUST use these tokens.

**Duration Tokens:**
| Token | Value | Use Case |
|-------|-------|----------|
| `duration-fast` | 200ms | Hover states, simple micro-interactions |
| `duration-smooth` | 400ms | Modals, sheets, AI message entrances |

(Previously: Animation durations varied randomly: 200ms, 300ms, 500ms across components)

#### Scenario: Button hover animation

- GIVEN user hovers over a button
- WHEN the hover state changes
- THEN the transition completes in 200ms with `ease-out` timing

#### Scenario: Modal entrance animation

- GIVEN user triggers a modal
- WHEN the modal appears
- THEN the entrance animation completes in 400ms with `ease-out` timing

## ADDED Requirements

### Requirement: Smart Transaction Default (30-Day Rolling Window)

The transactions hook MUST default to showing the last 30 days of transactions, not the current calendar month. This prevents the "Empty Mall" effect where users see no data simply because it's early in the month.

(Previously: `usePaginatedTransactions` defaulted to `selectedYear = currentYear`, `selectedMonth = currentMonth`)

#### Scenario: User opens transacciones page with recent data

- GIVEN user has transactions in the last 30 days
- WHEN the user navigates to `/transacciones`
- THEN the page displays those recent transactions immediately
- AND no month filter change is required

#### Scenario: User opens transacciones page with no recent data

- GIVEN user has NOT recorded any transactions in the last 30 days
- WHEN the user navigates to `/transacciones`
- THEN the page shows EmptyState with message "Sin transacciones en los últimos 30 días"
- AND the month selector remains accessible to search older data

#### Scenario: Month selector overrides smart default

- GIVEN user has transactions in last 30 days
- WHEN the user manually selects a specific month (e.g., "Febrero 2026")
- THEN the filter applies that specific month, overriding the 30-day default
- AND the UI indicates "Mostrando: Febrero 2026"

### Requirement: Accessible Trend Indicators

KPI cards with trend arrows (↑/↓) MUST provide screen-reader alternative text. The system SHALL use visually hidden (`sr-only`) text.

(Previously: Trend arrows used unicode symbols without text alternatives)

#### Scenario: Positive trend announced to screen reader

- GIVEN a KPI card shows a positive trend
- WHEN a screen reader user focuses on the trend indicator
- THEN the screen reader announces "Aumento del X%" (Spanish, matching app locale)

### Requirement: Chart Accessibility

Charts MUST provide descriptive labels explaining purpose and key financial insight.

(Previously: Charts had no `aria-label` or accessible description)

#### Scenario: Screen reader announces chart

- GIVEN user focuses on chart
- THEN announces: "Gráfico de barras mostrando ingresos y egresos por categoría del período seleccionado"
- AND for AreaChart with milestones: includes break-even/meta reference

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

### Requirement: Lucide Icon Import

All icon components MUST be imported from `lucide-react`. Inline SVG definitions in component files are NOT permitted.

(Previously: `header.tsx` contained an inline SVG for Settings)

#### Scenario: Settings icon renders consistently

- GIVEN the header component loads
- WHEN the Settings icon is displayed
- THEN it uses `<Settings>` from `lucide-react` with standard 24px size and 2px stroke width

### Requirement: Light Mode Scrollbar Styling

The scrollbar styling MUST be available for both light and dark modes.

(Previously: `.dark ::-webkit-scrollbar` only targeted dark mode)

#### Scenario: User views app in light mode

- GIVEN the user has `dark` class removed from `<html>`
- WHEN the user scrolls content
- THEN the scrollbar uses styled appearance matching the light theme
