# Tasks: IA Strategy Configuration Panel + Trend Fix

## Change: `ia-strategy-config`

---

## Phase: Apply

---

## T1: Fix de Tendencia Repetida (MetricsGrid.tsx)

**Archivo:** `src/components/strategy/MetricsGrid.tsx`

**Cambios:**
1. Quitar `trend={metrics.marginTrend}` de Burn Rate (título "Burn Rate")
2. Quitar `trend={metrics.marginTrend}` de Runway (título "Runway")
3. Quitar `trend={metrics.marginTrend}` de Break-even (título "Break-even")
4. Mantener `trend={metrics.marginTrend}` solo en Profit Margin

**Antes:**
```tsx
<<MetricCard title="Burn Rate" treand={metrics.marginTrend} ... />
<<MetricCard title="Runway" trend={metrics.marginTrend} ... />
<<MetricCard title="Break-even" trend={metrics.marginTrend} ... />
<<MetricCard title="Profit Margin" trend={metrics.marginTrend} ... />
```

**Después:**
```tsx
<<MetricCard title="Burn Rate" ... />     // sin trend
<<MetricCard title="Runway" ... />         // sin trend
<<MetricCard title="Break-even" ... />     // sin trend
<<MetricCard title="Profit Margin" trend={metrics.marginTrend} ... />
```

**Verificación:** Solo Profit Margin muestra flecha ↓ o ↑ en el panel derecho.

---

## T2: Crear StrategyConfig Component

**Archivo:** `src/components/strategy/StrategyConfig.tsx` **(NUEVO)**

**Props:**
```typescript
interface StrategyConfigProps {
  fixedCosts: FixedCost[];
  currentCash: number;
  targetMargin: number;
  onUpdate: (inputs: Partial<ManualInputs>) => void;
}
```

**Estructura:**
```tsx
<div className="space-y-4">
  {/* Header */}
  <h3 className="text-sm font-medium text-muted-foreground">Configuración</h3>

  {/* Cash Actual */}
  <div>
    <label className="text-xs text-muted-foreground">Cash Actual</label>
    <Input type="number" value={currentCash} onChange={...} />
  </div>

  {/* Margen Objetivo */}
  <div>
    <label className="text-xs text-muted-foreground">Margen Objetivo (%)</label>
    <Input type="number" value={targetMargin} onChange={...} />
  </div>

  {/* Costos Fijos */}
  <div>
    <label className="text-xs text-muted-foreground">Costos Fijos Mensuales</label>
    {fixedCosts.map((fc, i) => (
      <div key={i} className="flex gap-2">
        <Input value={fc.label} onChange={...} />
        <Input type="number" value={fc.amount} onChange={...} />
        <Button variant="ghost" size="icon" onClick={eliminar}>🗑</Button>
      </div>
    ))}
    <Button variant="outline" size="sm" onClick={añadir}>+ Añadir costo fijo</Button>
  </div>
</div>
```

**Estilo:** Inputs en estilo pill (`rounded-xl bg-muted/30 border-border/20`), consistente con el chat.

**Lógica interna:**
- Estado local para fixedCosts, currentCash, targetMargin
- Inicializar desde props
- `onUpdate` al hacer submit/guardar

**Verificación:** El formulario se renderiza con los valores actuales.

---

## T3: Integrar StrategyConfig en DataPanel

**Archivo:** `src/components/strategy/DataPanel.tsx`

**Cambios:**
1. Agregar `StrategyConfig` al final del panel (después de GoalsList)
2. Pasar `updateManualInputs` del hook como prop

**Antes:**
```tsx
<div className="p-4 space-y-6">
  <MetricsGrid metrics={metrics} />
  <TrendChart data={historicalMargins} />
  <GoalsList goals={goals} />
</div>
```

**Después:**
```tsx
<div className="p-4 space-y-6">
  <MetricsGrid metrics={metrics} />
  <TrendChart data={historicalMargins} />
  <GoalsList goals={goals} />
  <StrategyConfig ... />
</div>
```

**Props necesarias desde page.tsx:**
- `fixedCosts`: `strategyData.manualInputs.fixedCosts`
- `currentCash`: `strategyData.manualInputs.currentCash`
- `targetMargin`: `strategyData.manualInputs.targetMargin`
- `onUpdate`: `handleUpdateManualInputs` (nueva función en page.tsx)

---

## T4: Conectar Config a useStrategyData (page.tsx)

**Archivo:** `src/app/dashboard/ia-strategy/page.tsx`

**Cambios:**
1. Importar `useStrategyData` (ya está)
2. Extraer `updateManualInputs` del hook
3. Pasar a DataPanel → StrategyConfig

```tsx
const { strategyData, updateManualInputs } = useStrategyData()

// ...

<DataPanel
  ...
  fixedCosts={strategyData.manualInputs.fixedCosts}
  currentCash={strategyData.manualInputs.currentCash}
  targetMargin={strategyData.manualInputs.targetMargin}
  onUpdateConfig={updateManualInputs}
/>
```

---

## T5: Build y Verificación

**Comandos:**
```bash
npm run build
```

**Verificaciones manuales:**
1. Solo Profit Margin tiene flecha de tendencia
2. Se pueden añadir/editar/eliminar costos fijos
3. Cash actual y margen objetivo editables
4. Break-even se recalcula al configurar costos
5. Runway se recalcula al configurar cash
6. Recargar página → valores persisten

---

## Files Summary

| Archivo | Cambio |
|---------|--------|
| `src/components/strategy/MetricsGrid.tsx` | Quitar trend de 3 tarjetas |
| `src/components/strategy/StrategyConfig.tsx` | **NUEVO**: formulario de config |
| `src/components/strategy/DataPanel.tsx` | Integrar StrategyConfig |
| `src/app/dashboard/ia-strategy/page.tsx` | Pasar updateManualInputs |

---

## Checklist

- [ ] T1: Trend solo en Profit Margin
- [ ] T2: StrategyConfig creado y funcional
- [ ] T3: Integrado en DataPanel
- [ ] T4: Conectado a useStrategyData
- [ ] T5: Build exitoso
- [ ] T5: Verificación manual completa
