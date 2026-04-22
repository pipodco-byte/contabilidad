# Design: Fix Radar Data Bugs

## Changes

### useRadarData.ts

**B3 Fix:**
```typescript
// REMOVE: outlier detection function
// REMOVE: detectarOutliers() call

// SIMPLIFY: fullMark calculation
const maxValor = Math.max(
  ...Object.values(mapa).flatMap(v => [v.Ingresos, v.Egresos])
);
const fullMark = Math.ceil(normalizar(maxValor) * 1.2) || 1;
```

**B4 Fix:**
```typescript
// DYNAMIC: Get unique categories from data
const categoriasUnicas = [...new Set(transacciones.map(t => t.categoria?.trim() || 'Otros'))];

// MAP: Only categories with data
const mapa = categoriasUnicas.reduce((acc, cat) => {
  acc[cat] = { Ingresos: 0, Egresos: 0 };
  return acc;
}, {} as Record<string, { Ingresos: number; Egresos: number }>);

// RADAR DATA: Only categories with values
const radarData = categoriasUnicas
  .filter(cat => mapa[cat].Ingresos > 0 || mapa[cat].Egresos > 0)
  .map(cat => ({
    subject: cat,
    Ingresos: normalizar(mapa[cat].Ingresos) || 0,
    Egresos: normalizar(mapa[cat].Egresos) || 0,
    fullMark,
  }));
```

## File Changes

| File | Change |
|------|--------|
| `src/hooks/useRadarData.ts` | Rewrite |

## Testing

- Manual: Verify radar shows only categories with data
- Manual: Verify values match actual data