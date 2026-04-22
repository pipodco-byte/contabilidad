# Design: Consolidation & Quality

## Architecture

```
src/
├── components/
│   ├── tables/
│   │   └── transaction-table.tsx    # E1: Fix pagination
│   ├── Graficas.tsx                 # E2: Fix empty state
│   ├── FilterSelectors.tsx          # E3: onApply logic
│   └── layout/
│       └── sidebar.tsx             # E4: Logout tooltip
├── components/charts/
│   └── DonutChart.tsx              # G1: New donut chart
├── hooks/
│   ├── useSearch.ts                # F2: Búsqueda
│   └── useBatchActions.ts          # F5: Bulk operations
└── app/
    └── dashboard/
        └── transacciones/page.tsx   # U2: URL params
```

## Decisions

### D1: Fix Pagination
**Choice:** Usar `PaginationFirst` y `PaginationLast` de shadcn/ui
**Rationale:** Componente ya existe, semánticamente correcto

### D2: Donut Chart
**Choice:** Recharts PieChart con click-to-filter
**Rationale:** Misma librería que gráficos actuales, integración simple
**Interaction:** Click en sector → filtra transacciones por categoría

### D3: Búsqueda
**Choice:** Debounce 300ms + useSearch hook
**Rationale:** UX inmediata sin sobrecargar API

### D4: Batch Actions
**Choice:** Checkbox column + action bar flotante
**Rationale:** Patrón estándar, claro para usuarios

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/tables/transaction-table.tsx` | Modify | Fix E1, E3 |
| `src/components/Graficas.tsx` | Modify | Fix E2 |
| `src/components/FilterSelectors.tsx` | Modify | E3: onApply logic |
| `src/components/layout/sidebar.tsx` | Modify | E4: logout tooltip |
| `src/components/charts/DonutChart.tsx` | Create | G1: Donut chart |
| `src/hooks/useSearch.ts` | Create | F2: Búsqueda |
| `src/hooks/useBatchActions.ts` | Create | F5: Bulk delete |

## Testing Strategy

| Layer | Tool | Coverage |
|-------|------|----------|
| Hooks | Vitest | >80% |
| Components | React Testing Library | >60% |
| E2E | Playwright | Crítico paths |

## Open Questions

1. **Donut filter:** ¿Click filtra o navega?
2. **Search debounce:** ¿300ms óptimo?
3. **Batch delete:** ¿Confirmación por item o bulk?