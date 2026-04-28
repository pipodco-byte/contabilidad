# Design: SimpleLegendContent

## Architecture

### Decision 1: Inline SVG vs Lucide React

**Choice:** Inline SVG
**Rationale:**
- Bundle size reducido (no dependencia adicional)
- Iconos simples (trending lines) no requieren la flexibilidad de Lucide
- Consistencia garantizada - no depende de versión de librería

### Decision 2: Props para Colors/Labels

**Choice:** Optional props con defaults
**Rationale:**
- Backwards compatible con uso actual
- Permite customización si needed en el futuro
- Mantiene API simple

### Decision 3: showBalance flag

**Choice:** Boolean flag en lugar de array de items
**Rationale:**
- Simpler API (no array manipulation)
- Coherent con los 3 charts que muestran balance (LineChart)

## Component Structure

```tsx
const SimpleLegendContent = React.forwardRef<HTMLDivElement, Props>(
  ({ colors, labels, showBalance }, ref) => {
    return (
      <div ref={ref} className="flex items-center justify-center gap-4 pt-3">
        <LegendItem icon="trending-up" color={colors.ingresos} label={labels.ingresos} />
        <LegendItem icon="trending-down" color={colors.egresos} label={labels.egresos} />
        {showBalance && (
          <LegendItem icon="bar-chart" color={colors.balance} label={labels.balance} />
        )}
      </div>
    )
  }
)
```

## Color Palette

| Series | Hex | Usage |
|--------|-----|-------|
| Ingresos | `#10b981` | emerald-500 |
| Egresos | `#fb7185` | rose-500 |
| Balance | `#8b5cf6` | violet-500 |

## Icon Specifications

### Trending Up (Ingresos)
```svg
<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
<polyline points="17 6 23 6 23 12" />
```

### Trending Down (Egresos)
```svg
<polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
<polyline points="17 18 23 18 23 12" />
```

### Bar Chart (Balance)
```svg
<line x1="12" y1="20" x2="12" y2="10" />
<line x1="18" y1="20" x2="18" y2="4" />
<line x1="6" y1="20" x2="6" y2="16" />
```

## Files Affected

| File | Change |
|------|--------|
| `src/components/ui/chart.tsx` | Add `SimpleLegendContent` + export |
| `src/components/Graficas.tsx` | Update import + 5 usages |
