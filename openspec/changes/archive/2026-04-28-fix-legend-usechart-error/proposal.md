# Proposal: Fix Legend useChart Error

## Intent

Corregir el error de runtime "useChart must be used within a <ChartContainer />" que ocurre al usar `ChartLegendContent` de shadcn/ui charts en `Graficas.tsx`, sin requerir envolver cada chart en `ChartContainer`.

## Scope

### In Scope
- Crear componente `SimpleLegendContent` standalone (sin dependencia de `ChartContext`)
- Actualizar `Graficas.tsx` para usar `SimpleLegendContent`
- Mantener look shadcn/ui consistente con el tema

### Out of Scope
- Modificar `ChartContainer` o `ChartTooltipContent`
- Cambiar la estructura de datos de los charts
- Agregar tests (mantener como es)

## Approach

**Estrategia:** Crear `SimpleLegendContent` - wrapper que:
- No usa `useChart()` ni `ChartContext`
- Renderiza legend items estáticos con colores hardcoded
- Incluye iconos SVG inline (trending up/down) para look boutique
- Acepta props opcionales para colors y labels

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/ui/chart.tsx` | Modified | Agregar `SimpleLegendContent` |
| `src/components/Graficas.tsx` | Modified | Reemplazar `ChartLegendContent` → `SimpleLegendContent` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking existing chart rendering | Low | Build verification + visual check |
| Colors hardcoded vs theme mismatch | Low | Usar colores del tema existente (#10b981, #fb7185, #8b5cf6) |

## Rollback Plan

1. Revertir cambios en `Graficas.tsx` (git checkout)
2. Remover `SimpleLegendContent` de `chart.tsx`

## Dependencies

Ninguna - shadcn charts ya instalado.

## Success Criteria

- [x] Build pasa sin errores
- [x] Legend muestra Ingresos (emerald) + Egresos (rose) + Balance (violet)
- [x] No errors en consola del navegador
