# Design: Chart Area Premium

## Design Decisions

### Decision 1: Spring Parameters

**Choice:** `stiffness: 180, damping: 20-22`
**Rationale:**
- Más suave que BarChart (stiffness: 260)
- AreaCharts son "floater" - merecen animación más lenta
- damping: 20-22 para área de datos más tranquila

### Decision 2: Gradient 3-Stop vs 2-Stop

**Choice:** 3 stops (5%, 40%, 95%)
**Rationale:**
- 2-stop era muy abrupto (0.8 → 0.1)
- 3-stop permite transición más suave
- Opacity 0.3 en top (no 0.8) - menos saturación

### Decision 3: Glow Position

**Chart #2:** Top-right (emerald)
**Chart #4:** Bottom-left (rose)
**Rationale:** Contraposition visual - evita monotonía

### Decision 4: Milestone Opacity

**Choice:** 0.4 (40%)
**Rationale:**
- Bars pueden tener opacity 1 porque son filled
- Areas son más transparentes - milestones competirían
- 40% es visible pero no dominante

### Decision 5: Stroke Width 3px

**Choice:** strokeWidth={3}
**Rationale:**
- Areas necesitan más presencia que bars
- Líneas más gruesas se leen mejor con fill debajo
- ActiveDot más grande (r:6) para interactividad clara

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| Emerald | `#10b981` | Ingresos area |
| Rose | `#fb7185` | Egresos area |
| Emerald Glow | `bg-emerald-500/5` | Chart #2 ambient |
| Rose Glow | `bg-rose-500/5` | Chart #4 ambient |

## Visual Comparison

```
ANTES                          DESPUÉS
────────────────────────────────────────────────────────────
┌─────────────────┐        ┌──────────────────────────────────────┐
│  Evolución      │        │  TIME ANALYSIS         🔴 Live Data  │
│  Temporal       │        │  Evolución Temporal                   │
│                 │        │                                      │
│  ╱╲  ╱╲        │        │      ╱╲    ╱╲        ╱╲              │
│ ╱  ╲╱  ╲       │        │     ╱  ╲__╱  ╲    ╱  ╲              │
│╱    ╲    ╲____│        │  ___╱        ╲__╱    ╲___           │
│░░░░░░░░░░░░░░░│        │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░        │
│  - - - - - - - │        │     - - - Milestones (40%) - - -     │
└─────────────────┘        └──────────────────────────────────────┘
                                    ↑
                              Glow emerald top-right
```

## Animation Timing

| Chart | Delay | Duration | Damping |
|-------|-------|----------|---------|
| BarChart #1 | 0s | 600ms | 20 |
| AreaChart #2 | 0.1s | 2500ms | 20 |
| AreaChart #4 | 0.3s | 2000ms | 22 |
