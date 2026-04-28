# Proposal: Chart Polish Híbrido

## Intent

Modernizar los gráficos de Pipod Contabilidad para alcanzar un nivel visual "Silicon Valley" usando Shadcn Charts (envoltorio sobre Recharts) + Framer Motion para animaciones de entrada, sin reescribir la lógica de negocio existente.

## Scope

### In Scope
- Instalar `shadcn charts` y sus dependencias
- Refactorizar `Graficas.tsx` para usar componentes Shadcn Charts
- Agregar animaciones de entrada con Framer Motion (fade-in + scale suave)
- Mejorar tooltips con estilos de Shadcn
- Palette de colores consistente por categoría

### Out of Scope
- Nuevos tipos de gráficos (solo optimizar existentes)
- Lógica de cálculos de utilidad neta (ya existe)
- Migración de otros componentes fuera de gráficos

## Approach

**Estrategia Híbrida:**
1. Shadcn Charts como base sólida (tooltips, colores, estructura)
2. Framer Motion SOLO como wrapper de entrada (no para animaciones internas)
3. Mantener Recharts como motor subyacente (no cambiar API de datos)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/Graficas.tsx` | Modified | Refactor a Shadcn Charts + Framer Motion |
| `src/components/charts/*` | New | Componentes wrapper de Shadcn |
| `package.json` | Modified | Nueva dependencia shadcn/charts |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking changes en gráficos existentes | Low | Testing exhaustivo con datos reales |
| Conflictos de estilos con tema existente | Medium | Usar CSS variables del tema actual |

## Rollback Plan

1. Revertir cambios de `Graficas.tsx` desde git
2. Eliminar componentes shadcn charts
3. `npm uninstall` dependencias nuevas

## Dependencies

- Shadcn/ui instalado (`npx shadcn@latest init`)
- Framer Motion ya instalado

## Success Criteria

- [ ] Gráficos cargan con fade-in elegante (Framer Motion)
- [ ] Tooltips mejorados con estilos shadcn
- [ ] Build pasa sin errores
- [ ] 0 regresiones en funcionalidad de filtros
