# Design: Chart Polish Hybrid

## Technical Approach

Replace direct recharts usage in `Graficas.tsx` with shadcn/ui chart primitives wrapped in Framer Motion for entry animations. The shadcn charts library provides better styled defaults while maintaining recharts compatibility. Framer Motion adds fade-in + scale orchestration per the spec.

## Architecture Decisions

### Decision: Chart Component Source

**Choice**: shadcn/ui `@/components/ui/chart` (recharts-based)
**Alternatives considered**: Direct recharts with manual styling
**Rationale**: Shadcn charts wrap recharts with consistent styling tokens. Matches spec tooltip CSS requirements exactly (`bg-popover`, `border-border`, `text-foreground`). Preserves existing data hooks and structure.

### Decision: Framer Motion Wrapper Pattern

**Choice**: Motion.div wrapping each chart card container
**Alternatives considered**: Each chart component wrapped individually / motion component per chart type
**Rationale**: Cards are the natural animation boundary per spec (fade + scale 400ms). StaggerChildren at 0.05s creates staggered entrance effect across charts. Existing card structure in Graficas.tsx maps 1:1 to this pattern.

### Decision: Animation Config

**Choice**:
```
initial: { opacity: 0, scale: 0.95 }
animate: { opacity: 1, scale: 1 }
transition: { duration: 0.4, ease: "easeOut" }
staggerChildren: 0.05
```
**Rationale**: Spec-defined values. Scale 0.95 prevents layout shift vs 0.9. easeOut matches native feel.

### Decision: Palette Implementation

**Choice**: CSS variables from spec mapped to hardcoded hex in existing Graficas.tsx
**Rationale**: Shadcn charts use class-based theming. Financial charts require exact colors per category per spec. Direct hex values (already in codebase) ensure pixel-perfect match.

## Data Flow

```
useGraficas/useInformeAnual/useEvolucionMensual
         │
         ▼
    Graficas.tsx
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
 BarChart  AreaChart  PieChart  LineChart
 (shadcn)  (shadcn)  (shadcn)  (shadcn)
    │         │        │        │
    └─────────┴────────┴────────┘
              │
         Motion.div (fade+scale)
              │
         Tooltip (shadcn bg-popover)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/ui/chart.tsx` | Create | Shadcn chart primitives (BarChart, AreaChart, PieChart, LineChart, components) |
| `src/components/Graficas.tsx` | Modify | Replace recharts imports with shadcn charts, wrap card divs in motion.div |

## Component Interfaces

### ChartContainer (Motion wrapper)
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  className="bg-card border border-border backdrop-blur-md p-6 rounded-2xl shadow-sm"
>
  <h3 className="text-lg font-bold text-foreground mb-4" id="chart-{id}-title">{title}</h3>
  <div role="img" aria-labelledby="chart-{id}-title">
    {/* Chart content */}
  </div>
</motion.div>
```

### TooltipStyle (Shadcn tokens)
```tsx
const tooltipStyle = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  color: 'hsl(var(--popover-foreground))',
};
```

### Color Palette (from spec)
```tsx
const CHART_COLORS = {
  ingresos: '#10b981',    // Emerald
  egresos: '#fb7185',     // Rose
  balance: '#8b5cf6',     // Violet
  pie: ['#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337', '#fbbf24', '#f59e0b'],
} as const;
```

## Migration / Rollout

No migration required. Change is backward-compatible: same data hooks, same data shape, enhanced visuals only.

## Open Questions

None