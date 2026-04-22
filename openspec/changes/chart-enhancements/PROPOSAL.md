# Proposal: Chart Enhancement — Donut + Balance Line

## Context

Después de UI Boutique y Dashboard Modular, el dashboard de gráficos necesita optimización:
1. **Radar Chart** es confuso y tiene bugs (categorías hardcoded, outlier detection corrupta datos)
2. **Redundancia visual** entre Area Charts
3. **Pérdida de precisión** por división arbitraria por 1M

## Vision

Dashboard de gráficos que cuenta la historia financiera del negocio:
- Gráficos informativos (decisiones rápidas)
- Visualización clara de distribución de gastos
- Tendencia de balance con punto de equilibrio visible
- Precisión numérica sin pérdida de información

## Approach

### Fase 1: Reemplazo Radar → Donut
- Crear Donut Chart de egresos por categoría
- Usa hook existente `useGraficas`
- Eliminar componente Radar

### Fase 2: Nuevo Balance Line Chart
- Crear Line Chart de balance mensual
- Usa hook existente `useInformeAnual`
- Añadir línea de break-even (Y=0) en violet

### Fase 3: Fix Precisión
- Corregir `useEvolucionMensual` - eliminar `/1_000_000`
- Usar `Intl.NumberFormat` con `notation: compact`

## Scope

**In Scope:**
- G1: Donut Chart (reemplaza Radar)
- G2: Balance Line Chart con Break-Even
- Fix: Intl.NumberFormat para precisión

**Out of Scope:**
- Metas/Hitos de negocio (para después)
- KPIs condicionales (Burn Rate, Runway) — requieren ≥3 meses datos
- Forecasting

## Success Metrics

- Zero errores de build/lint/types
- Donut chart muestra % de egresos por categoría
- Balance Line cruza Y=0 (break-even) visible
- Sin valores "0" por división incorrecta

## Risks

- Donut chart con muchas categorías puede verse saturado
- Balance Line requiere datos ordenados por fecha

## Open Questions

1. ¿Donut filtra transacciones al hacer click? → No, solo visualización
2. ¿Colores del Donut? → Usar tema (Rose para egresos)
