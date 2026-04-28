# Delta for UI Theme System

## MODIFIED Requirements

### Requirement: Dark Mode Token Migration

The system MUST use semantic CSS tokens for all component backgrounds, borders, text, and shadows in both light and dark modes.

The following Tailwind `dark:` prefixed classes MUST be replaced with semantic tokens:

| Old Pattern | New Token |
|------------|-----------|
| `dark:bg-zinc-900` | `bg-card` |
| `dark:bg-zinc-950` | `bg-background` |
| `dark:border-zinc-800` | `border-border` |
| `dark:text-zinc-100` | `text-foreground` |
| `dark:text-zinc-400` | `text-muted-foreground` |
| `dark:shadow-black/*` | `shadow-foreground/*` |

#### Scenario: Components render correctly in light mode

- GIVEN a component using semantic tokens
- WHEN rendered in light mode
- THEN background is white, text is dark, borders are visible

#### Scenario: Components render correctly in dark mode

- GIVEN a component using semantic tokens
- WHEN rendered in dark mode
- THEN background uses dark values, text is light, borders adapt

#### Scenario: Hardcoded dark: classes break theming

- GIVEN a component with `dark:bg-zinc-900`
- WHEN theme is light
- AND component is rendered
- THEN background may be incorrect because zinc-900 is always dark

### Requirement: Chart Tooltip Theming

Chart tooltips MUST use CSS variables for background, border, and text colors.

The tooltip style object MUST use:

```typescript
const tooltipStyle = {
  backgroundColor: 'var(--tooltip-bg, var(--card))',
  borderColor: 'var(--tooltip-border, var(--border))',
  color: 'var(--tooltip-color, var(--foreground))',
}
```

#### Scenario: Tooltip displays in light mode

- GIVEN chart with themed tooltip
- WHEN user hovers over data point in light mode
- THEN tooltip has light background, dark text

#### Scenario: Tooltip displays in dark mode

- GIVEN chart with themed tooltip
- WHEN user hovers over data point in dark mode
- THEN tooltip has dark background, light text

### Requirement: Loading Skeleton Accuracy

Loading skeleton components MUST match the actual page layout they represent.

#### Scenario: Dashboard loading shows correct skeleton

- GIVEN dashboard/loading.tsx is rendered
- WHEN page is loading
- THEN skeleton shows only KPI cards and form (no admin badge)

#### Scenario: Graficas loading shows all charts

- GIVEN dashboard/graficas/loading.tsx is rendered
- WHEN charts page is loading
- THEN skeleton shows 4+ chart placeholders matching actual layout

#### Scenario: Informes loading shows tabs skeleton

- GIVEN dashboard/informes/loading.tsx is rendered
- WHEN informes page is loading
- THEN skeleton shows tabs structure with content area

### Requirement: Transaction Table Filter Buttons

Transaction table filter buttons (Todos/Ingreso/Egreso) MUST use primary color tokens.

Active filter button MUST use:

```typescript
'bg-primary text-primary-foreground'
```

Inactive filter buttons MUST use:

```typescript
'text-muted-foreground hover:text-foreground hover:bg-accent'
```

#### Scenario: Active filter shows primary styling

- GIVEN user clicks "Ingreso" filter
- THEN Ingreso button shows `bg-primary` with white text

#### Scenario: Inactive filters show muted styling

- GIVEN "Ingreso" filter is active
- THEN "Egreso" button shows muted styling

### Requirement: Cross-Browser Scrollbar Hiding

Scrollbar hiding MUST work on WebKit browsers AND Firefox.

The implementation MUST include:

```css
/* WebKit */
[&::-webkit-scrollbar]:hidden

/* Firefox */
scrollbar-width: none
```

#### Scenario: Scrollbar hidden on WebKit

- GIVEN FilterCarousel with scrollbar hiding
- WHEN viewed on Chrome/Safari
- THEN scrollbar is hidden

#### Scenario: Scrollbar hidden on Firefox

- GIVEN FilterCarousel with scrollbar hiding
- WHEN viewed on Firefox
- THEN scrollbar is hidden

## ADDED Requirements

### Requirement: Chart Color Palette

Chart colors (emerald for income, rose for expense, violet for neutral) MAY remain as hex values if they represent semantic meaning (green=positive, red=negative).

However, the chart containers and tooltips MUST use theme tokens, not hardcoded dark: classes.

#### Scenario: Chart container adapts to theme

- GIVEN BarChart in Graficas.tsx
- WHEN rendered in light mode
- THEN container uses `bg-card border-border`

#### Scenario: Chart container adapts to dark mode

- GIVEN BarChart in Graficas.tsx
- WHEN rendered in dark mode
- THEN container uses dark values via theme tokens

### Requirement: KPI Card Shadows

KPI card shadow on hover MUST use foreground token.

```typescript
hover:shadow-foreground/20
// OR
dark:hover:shadow-foreground/40
```

NOT `shadow-black/*` which ignores theme.

#### Scenario: Card shadow visible in light mode

- GIVEN KPI card with token shadow
- WHEN hovered in light mode
- THEN shadow uses foreground at 20% opacity

#### Scenario: Card shadow visible in dark mode

- GIVEN KPI card with token shadow
- WHEN hovered in dark mode
- THEN shadow uses foreground at 40% opacity
