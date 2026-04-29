# Design: Chart Visual Upgrade

## Design Decisions

### Decision 1: Spring Animation vs EaseOut

**Choice:** Spring physics
**Rationale:**
- Más natural y premium feel
- Commonly used in Apple's iOS animations
- Stiffness: 260 (not too bouncy)
- Damping: 20 (smooth deceleration)

### Decision 2: Glassmorphism Card

**Choice:** `bg-card/50 border-border/60 backdrop-blur-xl`
**Rationale:**
- Modern UI trend (iOS, macOS Big Sur)
- Adds depth without obscuring content
- `rounded-3xl` for softer feel

### Decision 3: Bar Gradients

**Choice:** Vertical gradients with opacity fade
**Rationale:**
- Adds depth to bars (3D-ish feel)
- Gradient from solid (top) to transparent (bottom)
- Matches modern chart libraries (Apple, Bloomberg)

### Decision 4: Horizontal Grid Only

**Choice:** `vertical={false}`
**Rationale:**
- Cleaner visual
- Vertical lines would compete with bar heights
- Professional financial chart aesthetic

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| Ingreso | `#10b981` | Emerald gradient |
| Egreso | `#fb7185` | Rose gradient |
| Border | `hsl(var(--border))` | Card border |
| Muted | `hsl(var(--muted-foreground))` | Axis text |

## Typography

| Element | Style |
|---------|-------|
| Label | `text-sm uppercase tracking-[0.2em]` |
| Title | `text-2xl font-semibold tracking-tight` |

## Visual Comparison

```
ANTES                    DESPUÉS
─────────────────────────────────────────────
┌─────────────┐         ┌──────────────────┐
│ ▓▓▓ ▓▓▓   │         │ ●  ANALISIS      │
│ ▓▓▓ ▓▓▓   │         │    OPERATIVO     │
│ ▓▓▓ ▓▓▓   │         │                  │
│ Ingr  Egres │         │  ▓▓▓░░  ▓▓▓░░  │
└─────────────┘         │  Ingr   Egresos ●│
                         └──────────────────┘
```
