# Design: Chart Remaining Premium

## Design Decisions

### Decision 1: PieChart Glow Color

**Choice:** Indigo (`bg-indigo-500/5`)
**Rationale:**
- Emerald para Time Analysis (Chart #2)
- Rose para Performance Snapshot (Chart #4)
- Indigo para Resource Allocation (Chart #3) - rompe monotonía

### Decision 2: LineChart Gradient Position

**Choice:** 50% offset (green on top, red on bottom)
**Rationale:**
- Balance positivo = green (arriba de Y=0)
- Balance negativo = red (abajo de Y=0)
- Punto de corte exactamente en Y=0 (ReferenceLine)

### Decision 3: Tabla Icons vs Text

**Choice:** TrendingUp/Down icons + percentage
**Rationale:**
- Iconos son más scaneables que texto
- Color del badge indica dirección
- Más premium que flechas Unicode

### Decision 4: Balance Row Highlight

**Choice:** `bg-secondary/10` + larger text
**Rationale:**
- Balance es el resultado final - merece jerarquía
- Separación visual clara de las métricas individuales

## Visual Comparison

```
PIECHART ANTES              PIECHART DESPUÉS
───────────────             ─────────────────
    ┌───┐                       ╱▔▔▔╲
   ╱  █  ╲                    ╱ ╱▔▔╲ ╲
  │ ███ │                    ▔▔╲███╱▔▔
   ╲  █  ╱                     ╲ ╱▔▔╲ ╱
    └───┘                       ╲▔▔▔╱
       vs                    Corner radius + glow

LINECHART ANTES              LINECHART DESPUÉS
───────────────             ──────────────────
  ─────────                  ══════════════
  ░░░░░░░░░                   ↑ green (arriba)
  ─────────                   ──────────── (Y=0)
  ░░░░░░░░░                   ↓ red (abajo)

TABLA ANTES                  TABLA DESPUÉS
───────────────             ─────────────────
 Ingresos    +5.2%         Ingresos    ↑ +5.2%
 Egresos     -3.1%          Egresos     ↓ -3.1%
 Balance     +12%          Balance    ● +12%
```

## Color Palette

| Chart | Glow | Icon/Accent |
|-------|------|-------------|
| PieChart #3 | Indigo | `#6366f1` |
| LineChart #5 | Violet gradient | `#8b5cf6` |
| Tabla #6 | Emerald/Red badges | `#10b981` / `#fb7185` |
