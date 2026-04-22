# Design: Dashboard Integration

## Rebase Strategy

```
Step 1: git reset --hard origin/main  (modular base)
Step 2: git cherry-pick b65afa0       (Donut + Balance)
Step 3: git cherry-pick 876c58e       (Sidebar routes)
Step 4: git cherry-pick 1c2268e       (active:scale-95)
```

Note: 876c58e (Sidebar routes) may have conflicts since the modular sidebar.tsx is different.

## /dashboard/page.tsx Changes

### Current (from main):
```tsx
<div className="space-y-8">
  {/* Admin Badge - REMOVE */}
  {isAdmin && (
    <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
      <p className="text-sm text-primary">✨ Acceso de administrador activado</p>
    </div>
  )}

  {/* KPI Cards */}
  <DashboardCards ... />

  {/* Quick Links - REMOVE */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <Link href="/dashboard/transacciones">
      <Button>Transacciones</Button>
    </Link>
    ...
  </div>
</div>
```

### Target:
```tsx
<div className="space-y-8">
  {/* KPI Cards */}
  <DashboardCards
    totalIngresos={resumen.totalIngresos}
    totalEgresos={resumen.totalEgresos}
    balance={resumen.balance}
    formatCurrency={formatCurrency}
  />

  {/* Action Buttons - ADD */}
  <div className="flex flex-wrap gap-3">
    <Button>Gema</Button>
    <Button>Nueva Transacción</Button>
    <Button>Informe Anual</Button>
    <Button>Informe Mensual</Button>
  </div>
</div>
```

## /dashboard/transacciones/page.tsx Changes

### Current (from main):
```tsx
export default function TransaccionesPage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div>
      <TransactionTable userId={user.id} userRole={user.rol} />
    </div>
  )
}
```

### Target:
```tsx
export default function TransaccionesPage() {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Nueva Transacción Button - ADD */}
      <div className="flex gap-3">
        <Button onClick={() => setShowForm(true)}>
          Nueva Transacción
        </Button>
      </div>

      {/* Form - ADD */}
      {showForm && (
        <TransaccionForm
          userId={user.id}
          onSuccess={() => setShowForm(false)}
        />
      )}

      <TransactionTable userId={user.id} userRole={user.rol} />
    </div>
  )
}
```

## /dashboard/config/page.tsx

Already has Gema import from main. Keep as is.

## /dashboard/informes/page.tsx

Already has ReportsTabs from main. Keep as is.

## /dashboard/graficas/page.tsx

Already imports Graficas. After cherry-pick of b65afa0, will have Donut + Balance Line.
