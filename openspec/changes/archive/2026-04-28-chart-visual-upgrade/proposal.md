# Proposal: Chart Visual Upgrade - BarChart Premium

## Intent

Mejorar la presentación visual del primer gráfico (BarChart "Ingresos vs Egresos por Categoría") con un estilo boutique premium: glassmorphism, spring animations, gradientes, y detalles de diseño polished.

## Scope

### In Scope
- Aplicar código visual mejorado al primer gráfico
- Spring animations en lugar de easeOut
- Glassmorphism card con backdrop-blur
- Gradientes en barras con rounded tops
- Grid horizontal-only, ejes minimalistas
- Header con jerarquía tipográfica

### Out of Scope
- Modificar otros gráficos (prueba de concepto)
- Cambiar lógica de datos o tooltip functionality

## Approach

**Estrategia:** Prueba de concepto - aplicar mejora visual al primer chart, verificar, y si funciona hacer rollback o expandir a otros.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Graficas.tsx` | Modified | Primer chart (BarChart) con nuevos estilos |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking chart rendering | Low | Build verification + visual check |
| Inconsistencia con otros charts | Medium | Serán actualizados después si prueba es exitosa |

## Rollback Plan

1. Git checkout del primer chart en Graficas.tsx

## Success Criteria

- [ ] Build pasa sin errores
- [ ] Primer chart muestra glassmorphism + spring animation
- [ ] Gradientes visibles en barras
