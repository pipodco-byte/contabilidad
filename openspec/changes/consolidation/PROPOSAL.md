# Proposal: Pipod Contabilidad — Consolidation & Quality

## Context

UI Boutique + Dashboard Modular completados. Proyecto requiere:
1. Corrección de errores pendientes
2. Nuevos gráficos (Donut, Balance)
3. Funcionalidades core (búsqueda, validación, batch)
4. Optimización (tests, React Query)

## Vision

Sistema de contabilidad robusto con:
- UI Boutique pulida (zero errores visuales)
- Gráficos informativos (decisiones rápidas)
- Datos íntegros (validación fuerte)
- UX eficiente (búsqueda, batch, edición)

## Approach

### Fase 1: Errores (1 semana)
- E1-E4: Corrección de bugs críticos

### Fase 2: UX (1 semana)
- U1-U3: Transiciones, URL params, mobile

### Fase 3: Gráficos (1 semana)
- G1-G3: Donut, Balance, YoY

### Fase 4: Core (2 semanas)
- F1-F5: Validación, búsqueda, edición, batch

### Fase 5: Optimización (1 semana)
- O1-O4: React Query, tests

## Scope

**In Scope:**
- Corrección de errores existentes
- Nuevos gráficos (Donut Chart)
- Búsqueda avanzada
- Validación de imports
- Edición inline de transacciones
- Acciones en lote
- Tests unitarios

**Out of Scope:**
- PWA / Offline mode
- Notificaciones push
- RLS en Supabase

## Success Metrics

- Zero errores de build/lint/types
- >80% coverage en hooks críticos
- Donut chart funcional
- Búsqueda < 100ms respuesta

## Risks

- Contexto largo puede afectar rendimiento
- Batch actions con optimistic updates compleja

## Open Questions

1. ¿Donut chart filtra transacciones al hacer click?
2. ¿Búsqueda usa debounce o submit?
3. ¿Tests con Jest o Vitest?