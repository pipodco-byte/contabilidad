# Tasks: Dashboard Modular

## Phase 1: Foundation

- [ ] **T1.1**: Crear `src/app/dashboard/layout.tsx` con Sidebar + Header wrapper
- [ ] **T1.2**: Modificar `src/components/layout/sidebar.tsx` - cambiar `#anchors` a `/dashboard/ruta`

## Phase 2: Sub-rutas

- [ ] **T2.1**: Crear `src/app/dashboard/transacciones/page.tsx`
- [ ] **T2.2**: Crear `src/app/dashboard/graficas/page.tsx`
- [ ] **T2.3**: Crear `src/app/dashboard/informes/page.tsx`
- [ ] **T2.4**: Crear `src/app/dashboard/config/page.tsx`

## Phase 3: Simplificación Overview

- [ ] **T3.1**: Simplificar `src/app/dashboard/page.tsx` - solo KPIs + quick access cards
- [ ] **T3.2**: Mover lógica de Gema a `/dashboard/config`

## Phase 4: Loading States

- [ ] **T4.1**: Crear `src/app/dashboard/loading.tsx` (global skeleton)
- [ ] **T4.2**: Crear skeletons específicos por sección

## Phase 5: Cleanup

- [ ] **T5.1**: Verificar AppShell - eliminar o deprecar
- [ ] **T5.2**: Eliminar anclas antiguas del DOM (section ids)
- [ ] **T5.3**: Build y test

## Execution Order

```
T1.1 → T1.2 → T2.1 → T2.2 → T2.3 → T2.4 → T3.1 → T3.2 → T4.1 → T4.2 → T5.1 → T5.2 → T5.3
```

## Notes

- Gema button: Pending styling (violet gradient) - no mover hasta esté estilizado
- Filtros: Mantener estado local en cada página (fase 2 será URL params)