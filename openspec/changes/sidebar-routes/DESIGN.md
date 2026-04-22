# Design: Sidebar Navigation Routes Fix

## File Changes

| File | Change |
|------|--------|
| `src/components/layout/sidebar.tsx` | Update `navItems` and `bottomNavItems` hrefs |

## Changes Required

### sidebar.tsx - Lines 38-67

**Before:**
```typescript
const navItems = [
  {
    title: "Transacciones",
    href: "/dashboard#transacciones",
    icon: Receipt,
  },
  {
    title: "Gráficas",
    href: "/dashboard#graficas",
    icon: BarChart3,
  },
  {
    title: "Informes",
    href: "/dashboard#informes",
    icon: FileText,
  },
]

const bottomNavItems = [
  {
    title: "Configuración",
    href: "/dashboard#config",
    icon: Settings,
  },
]
```

**After:**
```typescript
const navItems = [
  {
    title: "Transacciones",
    href: "/dashboard/transacciones",
    icon: Receipt,
  },
  {
    title: "Gráficas",
    href: "/dashboard/graficas",
    icon: BarChart3,
  },
  {
    title: "Informes",
    href: "/dashboard/informes",
    icon: FileText,
  },
]

const bottomNavItems = [
  {
    title: "Configuración",
    href: "/dashboard/config",
    icon: Settings,
  },
]
```

## Notes

- The `isActive` check uses `pathname === item.href`
- With route-based links, active state will work correctly
- No other changes needed
