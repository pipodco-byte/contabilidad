# Proposal: IA Strategy Configuration Panel + Trend Fix + Cash Estimado

## Change: `ia-strategy-config`

---

## 1. Intent

Tres mejoras en un mismo batch:

**Parte A (Funcional):** Agregar un panel de **Configuración Operativa** dentro del DataPanel de IA Strategy para que el usuario defina saldo inicial de bancos, costos fijos mensuales y margen objetivo. Las métricas se calculan con datos reales del negocio.

**Parte B (Smart):** Cash actual se **estima automáticamente** como `saldo_inicial + Σ(ingresos) - Σ(egresos)` desde la fecha configurada. Se muestra una advertencia explicativa.

**Parte C (Visual):** Corregir el bug donde `marginTrend` se muestra repetido en todas las tarjetas. Solo debe aparecer en "Profit Margin".

Everything in one place: configuración y métricas, todo dentro de IA Strategy.

---

## 2. Scope

### In Scope
- Formulario **collapsible** de configuración operativa dentro del DataPanel
- Inputs: saldo inicial + fecha, costos fijos (CRUD), margen objetivo
- Cash estimado automáticamente (Opción D + advertencia)
- Persistencia en **Supabase** (tabla `cont_configuracion`) — por cliente
- Costos fijos precargados del REPORTE PRESUPUESTO PIPOD
- Fix: quitar `trend` de Burn Rate, Runway y Break-even
- Recálculo automático de métricas al guardar

### Out of Scope
- Página de configuración separada
- Integración bancaria automática (Plaid, etc.)
- Multi-tenant admin

---

## 3. Approach

### Ubicación: DataPanel Collapsible
```
DataPanel (derecha)
├── MetricsGrid
├── TrendChart
├── GoalsList
└── ⚙️ Configuración Operativa (collapsible)
    ├── Saldo inicial + fecha
    ├── Margen objetivo
    ├── Costos fijos (CRUD)
    └── Cash estimado automático + ⚠️ warning
```

### Cash Estimado (Opción D)
```typescript
cash_actual = saldo_inicial 
  + Σ(ingresos desde fecha_saldo)
  - Σ(egresos desde fecha_saldo)
```

Advertencia:
> ⚠️ Cash estimado basado en saldo inicial + transacciones registradas.
> Verifica que todas las transacciones estén cargadas.

### Estilo Visual
- Consistente con el rediseño ChatGPT/minimalista
- Inputs: `rounded-2xl bg-muted/30 border-border/20`
- Botones: `rounded-full`, sin sombras
- Labels: `text-xs text-muted-foreground`
- Collapsible tipo acordeón limpio

### Data Flow
```
User edita config → API upsert cont_configuracion → 
useStrategyData lee de DB → calcular métricas con cash estimado →
DataPanel se actualiza automáticamente
```

---

## 4. Database

```sql
CREATE TABLE cont_configuracion (
  user_id UUID PRIMARY KEY REFERENCES cont_usuarios(id),
  saldo_inicial NUMERIC DEFAULT 0,
  fecha_saldo DATE,
  costos_fijos JSONB DEFAULT '[]',
  margen_objetivo NUMERIC DEFAULT 18,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 5. Files to Modify

| File | Change |
|------|--------|
| `src/components/strategy/MetricsGrid.tsx` | Quitar trend de Burn/Runway/Break-even |
| `src/components/strategy/StrategyConfig.tsx` | **NUEVO**: formulario operativo collapsible |
| `src/components/strategy/DataPanel.tsx` | Integrar StrategyConfig |
| `src/app/dashboard/ia-strategy/page.tsx` | Pasar data + handlers de config |
| `src/hooks/useStrategyData.ts` | Fetch config desde DB + calcular cash estimado |
| `src/app/api/config/route.ts` | **NUEVO**: API GET/PUT para cont_configuracion |

---

## 6. Risks

| Risk | Mitigation |
|------|------------|
| Sin saldo inicial → Runway no se puede estimar | Mostrar "Configura tu saldo inicial" en lugar de badge CRÍTICO |
| DB no existe → fallback a localStorage | Opcional: primera versión en localStorage, luego migrar |
| Cash estimado impreciso | Advertencia clara: "saldo inicial + transacciones registradas" |

---

## 7. Success Criteria

- [ ] Break-even calculado con costos fijos reales (no $0)
- [ ] Runway calculado con cash estimado (saldo + transacciones)
- [ ] Solo Profit Margin tiene flecha de tendencia
- [ ] Config persiste en DB por cliente
- [ ] Formulario con estilo minimalista consistente
- [ ] Costos fijos precargados del reporte
- [ ] Build exitoso
