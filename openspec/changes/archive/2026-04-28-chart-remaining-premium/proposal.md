# Proposal: Chart Remaining Premium Upgrade

## Intent

Aplicar estilo premium boutique a los gráficos restantes (#3 PieChart, #5 LineChart, #6 Tabla Comparativa): glassmorphism cards, spring animations, glows decorativos, y polish de UI.

## Scope

### In Scope
- Chart #3: PieChart/Donut con innerRadius fino, cornerRadius, glow indigo
- Chart #5: LineChart con gradient stroke green→red, activeDot premium
- Chart #6: Tabla HTML con TrendingUp/Down icons, delta badges

### Out of Scope
- Modificar charts #1, #2, #4 (ya premium)

## Approach

Mismo patrón visual premium con adaptaciones por tipo de chart:
- PieChart: Donut con espacio entre slices, glow indigo
- LineChart: Gradient stroke, domain controlado para Milestones
- Tabla: Icons TrendingUp/Down, hover states, badges con color

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Graficas.tsx` | Modified | Charts #3, #5, #6 con estilos premium |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Import TrendingUp/Down missing | Low | Agregar import lucide-react |
| Gradient ID conflict | Low | Usar IDs únicos |

## Rollback Plan

1. Git checkout de charts #3, #5, #6 en Graficas.tsx

## Success Criteria

- [ ] Build pasa sin errores
- [ ] PieChart muestra cornerRadius y glow indigo
- [ ] LineChart muestra gradient stroke y domain fijo
- [ ] Tabla muestra TrendingUp/Down icons y delta badges
