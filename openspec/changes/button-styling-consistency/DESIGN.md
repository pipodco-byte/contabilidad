# Design: Button Styling Consistency

## Changes

### 1. `/dashboard/page.tsx` — Reorder and Style

**Current (incorrect order):**
```tsx
<div className="space-y-8">
  <DashboardCards ... />  {/* KPIs ARRIBA */}
  <div className="flex flex-wrap gap-3">
    <Button>Gema</Button>  {/* Sin estilo */}
    <Button>Nueva Transacción</Button>  {/* Sin estilo */}
    <Button variant="outline">Informe Anual</Button>
    <Button variant="outline">Informe Mensual</Button>
  </div>
</div>
```

**Target:**
```tsx
<div className="space-y-8">
  {/* Botones ARRIBA */}
  <div className="flex flex-wrap gap-3">
    <Button
      onClick={() => setShowGema(!showGema)}
      className="bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200"
    >
      <Gem className="mr-2 h-4 w-4" />
      Gema
    </Button>

    <Button
      onClick={() => setShowForm(true)}
      className="bg-emerald-600 hover:bg-emerald-500 text-white"
    >
      Nueva Transacción
    </Button>

    <Button variant="outline" onClick={() => window.location.href = '/dashboard/informes'}>
      <FileText className="mr-2 h-4 w-4" />
      Informe Anual
    </Button>

    <Button variant="outline" onClick={() => window.location.href = '/dashboard/informes'}>
      <FileText className="mr-2 h-4 w-4" />
      Informe Mensual
    </Button>
  </div>

  {/* KPI Cards ABAJO */}
  <DashboardCards ... />
</div>
```

### 2. `/dashboard/config/page.tsx` — Remove Admin Badge

**Remove lines 61-67:**
```tsx
{/* DELETE THIS */}
{isAdmin && (
  <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
    <p className="text-sm text-primary">
      ✨ Acceso de administrador activado
    </p>
  </div>
)}
```

## Violet Gradient Constant

For reusability, the violet gradient could be extracted to a constant or component:

```tsx
const VIOLET_GRADIENT = "bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200"
```
