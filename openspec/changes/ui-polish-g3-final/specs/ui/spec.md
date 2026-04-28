# Delta for UI

## MODIFIED Requirements

### Requirement: Theme-Aware Components (Complete)

ALL UI components that render surfaces MUST use semantic CSS design tokens. The system MUST support both light and dark modes via the `dark` class on `<html>`.

**Mapping Table (Complete):**
| Hardcoded Class | Semantic Token | Purpose |
|-----------------|----------------|---------|
| `bg-zinc-950` | `bg-background` | Page background |
| `bg-zinc-950/80` | `bg-card/80` | Translucent card |
| `bg-zinc-900` | `bg-card` / `bg-secondary` | Card surfaces |
| `bg-zinc-900/50` | `bg-secondary` / `bg-muted` | Secondary surfaces |
| `text-zinc-100` | `text-foreground` | Primary text |
| `text-zinc-300` | `text-foreground` | Primary text (softer) |
| `text-zinc-400` | `text-muted-foreground` | Muted text |
| `text-zinc-500` | `text-muted-foreground` | Muted text |
| `border-zinc-800` | `border-border` | Borders |
| `border-zinc-800/50` | `border-border` | Translucent borders |
| `border-white/10` | `border-border` | Invisible borders |

(Previously: Components used hardcoded `bg-zinc-9[0-5]` making light mode broken)

#### Scenario: Login form renders in light mode

- GIVEN user has `dark` class removed from `<html>`
- WHEN the login page loads
- THEN auth-form uses light theme tokens (`--background: 0 0% 100%`, `--foreground: 222.2 84% 4.9%`)
- AND all inputs have `bg-input border-border text-foreground`
- AND all text is legible (contrast ≥ 4.5:1)

#### Scenario: Login form renders in dark mode

- GIVEN user has `dark` class present on `<html>`
- WHEN the login page loads
- THEN auth-form uses dark theme tokens
- AND all inputs have `bg-input` (dark variant) and `text-foreground` (light variant)

#### Scenario: AssistantSheet renders in light mode

- GIVEN user has `dark` class removed from `<html>`
- WHEN the Copilot sheet opens
- THEN the sheet container uses `bg-background border-border`
- AND all text uses `text-foreground` / `text-muted-foreground`
- AND the textarea uses `bg-input border-border`

#### Scenario: Graficas empty state renders in light mode

- GIVEN user has `dark` class removed from `<html>`
- WHEN the graficas page shows empty state
- THEN the empty state uses `bg-card border-border text-muted-foreground`

## ADDED Requirements

### Requirement: Accessible Chart Containers

Chart containers in `Graficas.tsx` MUST have `aria-label` attributes describing the chart's purpose for screen readers.

(Previously: Charts had no accessible labels)

#### Scenario: Screen reader reads chart purpose

- GIVEN an AreaChart displays "Evolución Temporal"
- WHEN a screen reader user navigates to the chart container
- THEN the container announces "Gráfico de evolución temporal mostrando tendencias del período seleccionado"

### Requirement: Light Mode Scrollbar

The scrollbar styling MUST be available for both light and dark modes.

(Previously: `.dark ::-webkit-scrollbar` only targeted dark mode)

#### Scenario: User scrolls in light mode

- GIVEN the user has `dark` class removed from `<html>`
- WHEN the user scrolls content
- THEN the scrollbar uses styled appearance matching light theme (`#f4f4f5` track, `#d4d4d8` thumb)