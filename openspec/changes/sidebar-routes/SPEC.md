# Spec: Sidebar Navigation Routes Fix

## Goal

Update sidebar navigation from `#anchor` links to proper routes.

## Current State

```typescript
// sidebar.tsx - CURRENT (INCORRECT)
const navItems = [
  { title: "Transacciones", href: "/dashboard#transacciones" },
  { title: "Gráficas", href: "/dashboard#graficas" },
  { title: "Informes", href: "/dashboard#informes" },
]

const bottomNavItems = [
  { title: "Configuración", href: "/dashboard#config" },
]
```

## Target State

```typescript
// sidebar.tsx - TARGET (CORRECT)
const navItems = [
  { title: "Transacciones", href: "/dashboard/transacciones" },
  { title: "Gráficas", href: "/dashboard/graficas" },
  { title: "Informes", href: "/dashboard/informes" },
]

const bottomNavItems = [
  { title: "Configuración", href: "/dashboard/config" },
]
```

## Acceptance Criteria

- [ ] All sidebar links use `/dashboard/route` format
- [ ] No `#anchor` links in sidebar
- [ ] Navigation works correctly
- [ ] Build passes

## Routes to Create/Update

| Route | Status | Component |
|-------|--------|-----------|
| `/dashboard/transacciones` | Existing | TransactionTable |
| `/dashboard/graficas` | Existing | Graficas |
| `/dashboard/informes` | Existing | ReportsTabs |
| `/dashboard/config` | Existing | (inline in page) |

Note: If routes don't exist as separate pages, they will use the main dashboard page with anchor scrolling. The sidebar fix is the priority.
