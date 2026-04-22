# Proposal: Button Styling Consistency

## Context

Dashboard tiene inconsistencias en estilos de botones entre páginas. Algunos botones no tienen el estilo acordado (violet gradient), y el Admin Badge todavía existe en config.

## Vision

Botones consistentes en toda la aplicación con estilos claramente definidos:
- Violet gradient para acciones primarias (Gema, Enviar, Enviar a Felipe)
- Emerald para Nueva Transacción
- Outline para navegación (Informes)
- Botones siempre ARRIBA de KPI Cards en dashboard

## Approach

1. Mover botones arriba de KPI Cards en `/dashboard`
2. Aplicar violet gradient a botón Gema en dashboard
3. Aplicar emerald a botón Nueva Transacción en dashboard
4. Eliminar Admin Badge de `/dashboard/config`

## Scope

**In Scope:**
- Mover botones en dashboard page
- Aplicar estilos consolidados
- Eliminar Admin Badge

**Out of Scope:**
- Cambiar estructura de otras páginas
- Nuevas funcionalidades

## Status

- [x] BUTTON_STYLES.md creado
- [ ] SPEC.md
- [ ] DESIGN.md
- [ ] TASKS.md
- [ ] Apply
- [ ] Verify
