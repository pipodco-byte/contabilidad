# Proposal: IA Strategy Configuration Panel + Trend Fix

## Change: `ia-strategy-config`

---

## 1. Intent

Dos fixes en uno:

**Parte A (Funcional):** Agregar config panel en IA Strategy para que el usuario defina costos fijos mensuales, cash actual y margen objetivo. Esto hará que las métricas **Break-even** y **Runway** muestren valores reales (ya no $0).

**Parte B (Visual):** Corregir el bug donde `marginTrend` se muestra repetido en las 4 tarjetas de métricas. Solo debe aparecer en "Profit Margin".

---

## 2. Scope

### In Scope
- Formulario de costos fijos (lista editable: añadir, editar, eliminar)
- Input numérico para cash actual en bancos
- Input numérico para margen objetivo
- Sección de configuración integrada en DataPanel
- Persistencia en localStorage vía `useStrategyData.updateManualInputs()`
- Fix: quitar `trend` de Burn Rate, Runway y Break-even

### Out of Scope
- Backend API (se mantiene localStorage por ahora)
- Conexión con datos bancarios reales
- Cambios en `strategy-calculations.ts`

---

## 3. Approach

### Config UI
- Nueva sección en `DataPanel` debajo de "Mis Metas"
- Diseño minimalista tipo pills (consistente con el chat)
- Botón "Guardar Configuración" que persiste los datos

### Trend Fix
- `MetricsGrid.tsx`: solo Profit Margin recibe `trend={metrics.marginTrend}`
- Las demás tarjetas: sin `trend` prop → no muestran flecha

### Data Flow
```
User edita config → updateManualInputs() → localStorage →
recalculateMetrics() → Métricas reflejan costos reales
```

---

## 4. Files to Modify

| File | Change |
|------|--------|
| `src/components/strategy/MetricsGrid.tsx` | Quitar trend de Burn/Runway/Break-even |
| `src/components/strategy/DataPanel.tsx` | Agregar StrategyConfig al panel |
| `src/components/strategy/StrategyConfig.tsx` | **NUEVO**: formulario de costos fijos + cash + margen |

---

## 5. Risks

| Risk | Mitigation |
|------|------------|
| localStorage se borra → config perdida | Ya es el comportamiento actual del chat |
| Inputs con formato colombiano (. como miles) | Usar `type="number"` + `parseFloat()` |
| User no configura → métricas en $0 | Mostrar placeholder "Configura tus costos fijos" |

---

## 6. Success Criteria

- [ ] Break-even muestra valor real cuando hay costos fijos
- [ ] Runway muestra meses reales cuando hay cash configurado
- [ ] Solo Profit Margin tiene flecha de tendencia
- [ ] Config persiste al recargar página
- [ ] Build exitoso
