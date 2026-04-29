# Proposal: Chart Area Premium Upgrade

## Intent

Aplicar estilo premium boutique a los gráficos AreaChart (#2 Evolución Temporal y #4 Evolución Mensual): glassmorphism cards, spring animations, gradients con 3 stops, glow ambiental, y real-time indicators.

## Scope

### In Scope
- Chart #2: AreaChart "Evolución Temporal" con MilestoneLines
- Chart #4: AreaChart "Evolución Mensual" sin MilestoneLines
- Spring animation (stiffness: 180, damping: 20-22)
- Glassmorphism card (backdrop-blur-2xl, rounded-[2rem])
- Gradientes 3-stop con opacity fade
- Glow ambiental decorativo
- Real-time indicator badge

### Out of Scope
- Modificar BarChart #1 (ya premium)
- Modificar PieChart #3 o LineChart #5

## Approach

Mismo patrón visual que BarChart premium, adaptado para AreaChart:
- Area fills con gradientes de 3 stops
- Stroke width 3px (vs 1.5px en BarChart)
- ActiveDot con shadow
- Milestones a 40% opacity (reducidos)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Graficas.tsx` | Modified | Charts #2 y #4 con estilos premium |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Milestones compiten con data | Low | opacity:0.4 ya aplica |
| Gradientes troppo cargados | Medium | Usar opacity 0.3 no 0.8 |

## Rollback Plan

1. Git checkout de los charts #2 y #4 en Graficas.tsx

## Success Criteria

- [ ] Build pasa sin errores
- [ ] Chart #2 muestra spring + glow emerald + Milestones
- [ ] Chart #4 muestra spring + glow rose + badge "Año Fiscal 2026"
