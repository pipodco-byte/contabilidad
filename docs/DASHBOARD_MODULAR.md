# Dashboard Modular — Before & After

## Estructura Anterior (SPA con anclas)

```
/dashboard
├── page.tsx ( monolithic - todo en un archivo )
│   ├── AppShell wrapper
│   ├── KPI Cards
│   ├── Transacciones ( id="transacciones" )
│   ├── Gráficas ( id="graficas" )
│   ├── Informes ( id="informes" )
│   ├── Gema Import
│   └── Nueva Transacción Form
```

**Navegación:** Anchors (`#transacciones`, `#graficas`, etc.)
```tsx
// sidebar.tsx (antes)
const navItems = [
  { title: "Transacciones", href: "/dashboard#transacciones", icon: Receipt },
  { title: "Gráficas", href: "/dashboard#graficas", icon: BarChart3 },
  { title: "Informes", href: "/dashboard#informes", icon: FileText },
]
```

---

## Estructura Nueva (App Router modular)

```
/dashboard
├── layout.tsx          → Sidebar + Header wrapper
├── page.tsx            → KPIs + Quick Access Cards
├── loading.tsx         → Skeleton global
├── transacciones/
│   ├── page.tsx
│   └── loading.tsx
├── graficas/
│   ├── page.tsx
│   └── loading.tsx
├── informes/
│   ├── page.tsx
│   └── loading.tsx
└── config/
    ├── page.tsx        → Gema Import + Settings
    └── loading.tsx
```

**Navegación:** Rutas reales (`/dashboard/transacciones`, etc.)
```tsx
// sidebar.tsx (ahora)
const navItems = [
  { title: "Transacciones", href: "/dashboard/transacciones", icon: Receipt },
  { title: "Gráficas", href: "/dashboard/graficas", icon: BarChart3 },
  { title: "Informes", href: "/dashboard/informes", icon: FileText },
]
```

---

## Beneficios

| Antes | Después |
|-------|---------|
| Un archivo de 218 líneas | Páginas de ~20-50 líneas |
| Sin loading states | Skeletons por ruta |
| URL no compartible | URLs exactas por sección |
| Todo recargaba | Código splitting automático |
| Scroll suave interno | Navegación real SPA |

---

## Commits Relacionados

- `0ee1e4a` — feat: modular dashboard structure
- `1c2268e` — feat: add active:scale-95 and transitions to Gema buttons
