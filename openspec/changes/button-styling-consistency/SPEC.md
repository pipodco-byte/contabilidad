# Spec: Button Styling Consistency

## Goal

Lograr consistencia total en estilos de botones en el dashboard.

## Dashboard Layout

### `/dashboard/page.tsx` — Orden Correcto

```tsx
<div className="space-y-8">
  {/* Action Buttons - ARRIBA DE KPI */}
  <div className="flex flex-wrap gap-3">
    <Button className="violet-gradient">Gema</Button>
    <Button className="emerald">Nueva Transacción</Button>
    <Button variant="outline">Informe Anual</Button>
    <Button variant="outline">Informe Mensual</Button>
  </div>

  {/* KPI Cards */}
  <DashboardCards ... />

  {/* Gema Import (expandible) */}
  {showGema && ...}

  {/* Nueva Transacción Form (expandible) */}
  {showForm && ...}
</div>
```

## Button Styles

### Violet Gradient (Primario)
```tsx
className="bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200"
```

### Emerald (Nueva Transacción)
```tsx
className="bg-emerald-600 hover:bg-emerald-500 text-white"
```

### Outline (Informes)
```tsx
variant="outline"
```

## Acceptance Criteria

- [ ] Botones ARRIBA de KPI Cards en `/dashboard`
- [ ] Gema usa violet gradient
- [ ] Nueva Transacción usa emerald
- [ ] Informes usan outline
- [ ] Admin Badge ELIMINADO de `/dashboard/config`
- [ ] Build pasa sin errores

## Files to Modify

| File | Change |
|------|--------|
| `src/app/dashboard/page.tsx` | Reorder buttons above KPI, apply styles |
| `src/app/dashboard/config/page.tsx` | Remove Admin Badge |
