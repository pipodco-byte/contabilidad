# Delta: informes-premium-upgrade

## ADDED Requirements

### Requirement: BarChart Visual Upgrade (Informe Mensual)

The chart component at `/dashboard/informes` (Mensual tab) MUST display with premium boutique styling.

The BarChart component MUST render with:
- Glassmorphism card container with `backdrop-blur-xl` and `border-border/50`
- Framer Motion fade-in + scale animation with stagger 0.1s between elements
- Emerald gradient fill for Ingresos bars using unique ID `informe-bar-ingresos`
- Indigo gradient fill for Egresos bars using unique ID `informe-bar-egresos`
- Spring animation (stiffness: 260, damping: 20)
- Minimalist axes with `axisLine: false, tickLine: false`

#### Scenario: BarChart renders with glassmorphism

- GIVEN user navigates to `/dashboard/informes`
- WHEN Monthly tab is selected
- THEN the BarChart container displays with backdrop blur effect
- AND Ingresos bars render with emerald gradient
- AND Egresos bars render with indigo gradient
- AND animation triggers with fade-in + scale effect

#### Scenario: Gradient IDs avoid conflicts

- GIVEN user has both `/dashboard/graficas` and `/dashboard/informes` open
- WHEN both pages render charts with gradients
- THEN no ID conflicts occur because Informes uses `informe-bar-*` prefix
- AND Graficas uses `bar-*` or other distinct prefixes

### Requirement: LineChart Visual Upgrade (Informe Anual)

The LineChart component MUST render with premium styling.

The LineChart component MUST include:
- Glassmorphism card container with `backdrop-blur-xl` and `border-border/50`
- Gradient strokes: `informe-line-ingresos` (green→emerald), `informe-line-egresos` (purple→indigo), `informe-line-balance` (amber→orange)
- ActiveDot with `shadow-2xl` effect
- Spring animation (stiffness: 260, damping: 20)
- Framer Motion fade-in animation
- Minimalist axes with `axisLine: false, tickLine: false`

#### Scenario: LineChart renders with gradient strokes

- GIVEN user navigates to `/dashboard/informes`
- WHEN Anual tab is selected
- THEN LineChart displays with three gradient-stroked lines
- AND Ingresos line uses green→emerald gradient
- AND Egresos line uses purple→indigo gradient
- AND Balance line uses amber→orange gradient

#### Scenario: ActiveDot with shadow effect

- GIVEN LineChart is rendered with gradient strokes
- WHEN user hovers over a data point
- THEN the activeDot displays with prominent shadow effect (shadow-2xl)

## Removed Requirements

None.

## Acceptance Criteria

- [ ] BarChart renders with glassmorphism, emerald/indigo gradients, Framer Motion
- [ ] LineChart renders with gradient strokes, activeDot shadow, spring animation
- [ ] All gradient IDs use `informe-*` prefix (no conflicts with Graficas.tsx)
- [ ] Build passes without errors
- [ ] Navigate between pages without visual glitches