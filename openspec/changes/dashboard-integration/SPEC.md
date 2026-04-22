# Spec: Dashboard Integration

## Goal

Integrate modular dashboard structure with action buttons, removing Quick Links and Admin Badge.

## Dashboard Structure

### `/dashboard` (Main Page)
```jsx
<div className="space-y-8">
  {/* KPI Cards */}
  <DashboardCards
    totalIngresos={resumen.totalIngresos}
    totalEgresos={resumen.totalEgresos}
    balance={resumen.balance}
    formatCurrency={formatCurrency}
  />

  {/* Action Buttons - RECUPERADOS */}
  <div className="flex flex-wrap gap-3">
    <Button>Gema</Button>
    <Button>Nueva Transacción</Button>
    <Button>Informe Anual</Button>
    <Button>Informe Mensual</Button>
  </div>
</div>
```

**ELIMINADO:**
- ✨ Admin Badge
- Quick Links (4 cards)

### `/dashboard/transacciones`
```jsx
<div>
  {/* Nueva Transacción Button */}
  <Button>Nueva Transacción</Button>

  {/* Filtros */}
  <FilterSelectors />

  {/* Tabla */}
  <TransactionTable />
</div>
```

### `/dashboard/graficas`
```jsx
<div>
  <Graficas userId={user.id} userRole={user.rol} />
</div>
```

### `/dashboard/informes`
```jsx
<div>
  <ReportsTabs userId={user.id} userRole={user.rol} />
</div>
```

### `/dashboard/config`
```jsx
<div>
  {/* Gema Import */}
  <Button>Gema</Button>
  <textarea>...</textarea>
</div>
```

## Acceptance Criteria

- [ ] Main dashboard has buttons (Gema, Nueva Transacción, Anual, Mensual)
- [ ] NO Quick Links cards
- [ ] NO Admin Badge
- [ ] transacciones page has Nueva Transacción button
- [ ] Donut Chart visible in graficas
- [ ] Balance Line with Break-Even visible in graficas
- [ ] Sidebar uses routes (not anchors)
- [ ] Build passes

## Files to Modify

| File | Change |
|------|--------|
| `/dashboard/page.tsx` | Add buttons, remove quick links + admin badge |
| `/dashboard/transacciones/page.tsx` | Add Nueva Transacción button |
