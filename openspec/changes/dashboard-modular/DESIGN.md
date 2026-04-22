# Design: Dashboard Modular (App Router)

## Technical Approach

Refactorizar el dashboard de una página única con anclas (#) a estructura App Router con sub-rutas reales. Cada sección (transacciones, gráficas, informes, config) será una ruta separada bajo `/dashboard/`.

**Objetivo:** Mejorar mantenibilidad, permitir loading states específicos por ruta, y URLs compartibles.

## Architecture Decisions

### Decision: Estructura de rutas

**Choice**: App Router con layout anidado
**Alternatives considered**: Mantener SPA con anclas, usar query params
**Rationale**: Next.js nativo, mejor código splitting, loading states por ruta

### Decision: Layout wrapper

**Choice**: Crear `dashboard/layout.tsx` que envuelve Sidebar + Header
**Alternatives considered**: Reutilizar AppShell existente
**Rationale**: AppShell podría tener dependencias innecesarias. Layout nuevo es más limpio y controlable.

### Decision: Estado de filtros

**Choice**: Estado local en cada página (fase 1), URL params (fase 2)
**Alternatives considered**: Zustand/Context para filtros globales
**Rationale**: Simplicidad primero. Fase 2 permitirá deep linking.

## Data Flow

```
/dashboard
├── layout.tsx (Sidebar + Header wrapper)
├── page.tsx (KPIs overview + quick access)
├── transacciones/page.tsx
├── graficas/page.tsx
├── informes/page.tsx
└── config/page.tsx
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/app/dashboard/layout.tsx` | Create | Layout wrapper con Sidebar + Header |
| `src/app/dashboard/page.tsx` | Modify | Simplificar a overview KPIs |
| `src/app/dashboard/transacciones/page.tsx` | Create | TransactionTable |
| `src/app/dashboard/graficas/page.tsx` | Create | Graficas component |
| `src/app/dashboard/informes/page.tsx` | Create | ReportsTabs |
| `src/app/dashboard/config/page.tsx` | Create | Gema + Settings |
| `src/app/dashboard/loading.tsx` | Create | Skeleton global |
| `src/app/dashboard/*/loading.tsx` | Create | Skeletons por sección |
| `src/components/layout/sidebar.tsx` | Modify | Links # → /dashboard/... |
| `src/components/layout/app-shell.tsx` | Deprecate | Reemplazado por layout.tsx |

## Interfaces / Contracts

```typescript
// Layout recibe children de cada page
interface DashboardLayoutProps {
  children: React.ReactNode
}

// Sidebar nav items
interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Componentes individual | Jest/Shallow render |
| Integration | Navegación entre rutas | Playwright/Cypress |
| E2E | Flujo completo usuario | Navegar, verificar sidebar activo |

## Migration / Rollout

1. Crear estructura sin romper existente
2. Testear cada ruta individualmente
3. Eliminar anclas antiguas progresivamente
4. Deploy con rollback si hay issues

## Open Questions

- [ ] ¿Gema en /config o /registro dedicado?
- [ ] ¿Mantener AppShell o eliminar?
- [ ] ¿Transiciones animadas entre rutas?