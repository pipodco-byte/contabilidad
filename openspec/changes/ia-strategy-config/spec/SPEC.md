# Spec: IA Strategy Configuration Panel + Trend Fix

## Change: `ia-strategy-config`

---

## 1. Overview

Panel de Configuración Operativa dentro del DataPanel de IA Strategy. Define saldo inicial, costos fijos y margen objetivo. Cash se estima automáticamente sumando transacciones desde la fecha configurada. Todo persiste en Supabase por cliente.

---

## 2. Requirements

### R1: Fix de Tendencia Repetida
- Solo "Profit Margin" muestra `trend={metrics.marginTrend}`
- Burn Rate, Runway, Break-even: sin prop `trend`
- Cambio en `MetricsGrid.tsx` (3 líneas)

### R2: Panel de Configuración Operativa (Collapsible)
- Sección **collapsible** al final del DataPanel
- Título: "⚙️ Configuración Operativa" con icono toggle
- Abierta por defecto si algún campo está vacío
- Cerrada por defecto si ya tiene datos configurados
- Estilo minimalista: `rounded-2xl bg-muted/5 border-border/10`

### R3: Inputs del Formulario
| Campo | Tipo | Default |
|-------|------|---------|
| Saldo inicial | number | 0 |
| Fecha del saldo | date | primer día del mes actual |
| Margen objetivo | number (%) | 18 |
| Costos fijos | CRUD list | Precargados del reporte |

- Inputs estilo pill: `rounded-2xl bg-muted/30 border-border/20 focus:ring-1 focus:ring-primary/20`
- Labels: `text-xs text-muted-foreground`
- Botón guardar: `rounded-full bg-primary text-primary-foreground`

### R4: Cash Estimado Automático (Opción D)
- Cálculo: `cash_actual = saldo_inicial + Σ(ingresos) - Σ(egresos)`
- El saldo_inicial y fecha vienen del formulario
- Ingresos y egresos se suman desde la fecha configurada hasta hoy
- Se usa en el cálculo de Runway
- Advertencia: label pequeño en gris debajo del valor

### R5: Advertencia Visual
```
⚠️ Cash estimado basado en saldo inicial + transacciones registradas.
   Verifica que todas las transacciones estén cargadas.
```
- Se muestra debajo del valor de Runway
- Texto `text-[10px] text-muted-foreground`
- Solo visible si `saldo_inicial > 0`

### R6: Costos Fijos (CRUD)
- Lista precargada con los 16 costos del REPORTE PRESUPUESTO PIPOD (~$18M)
- Cada fila: input concepto + input monto + botón eliminar
- Botón "+ Añadir costo fijo" al final
- Total acumulado visible

### R7: Persistencia en Supabase
- Tabla `cont_configuracion` con `user_id` como PK
- API: `GET /api/config` y `PUT /api/config`
- `useStrategyData` carga la config al montar
- Al guardar, hace upsert en la tabla

### R8: Estilo Visual Consistente
- Mismos patrones que el rediseño minimalista del chat
- Sin bordes pesados, sin sombras
- Misma paleta: `bg-muted/30`, `text-muted-foreground`, `border-border/20`

---

## 3. Scenarios

### S1: Primera visita (sin config)
**Given** el usuario abre IA Strategy por primera vez
**When** ve el DataPanel
**Then** la sección "Configuración Operativa" está abierta
**And** muestra los costos fijos precargados del reporte
**And** saldo inicial en $0 con hint "Configura tu saldo"

### S2: Configurar saldo inicial
**Given** el usuario ingresa saldo: $45.000.000 y fecha: 01/05/2026
**When** guarda
**Then** Runway se calcula con cash estimado = $45M + ingresos - egresos desde mayo
**And** aparece advertencia debajo: "Cash estimado basado en..."

### S3: Editar costos fijos
**Given** la lista de costos está cargada
**When** el usuario cambia "Arriendo" de $1.650.000 a $1.800.000
**And** guarda
**Then** Break-even se recalcula con el nuevo total de costos fijos

### S4: Collapsible cerrado
**Given** la config ya tiene datos
**When** el usuario cierra el collapsible
**Then** las métricas siguen visibles
**And** el panel no ocupa espacio innecesario

### S5: Tendencia corregida
**Given** 4 tarjetas de métricas visibles
**When** el usuario las mira
**Then** solo Profit Margin tiene flecha ↑ o ↓
**And** Burn Rate, Runway, Break-even no tienen ninguna flecha

---

## 4. Component Tree

```
DataPanel (derecha)
├── MetricsGrid
│   ├── MetricCard "Quema Mensual"     (sin trend)
│   ├── MetricCard "Respaldo"          (sin trend)
│   ├── MetricCard "Punto Equilibrio"  (sin trend)
│   └── MetricCard "Margen"            (con trend ✅)
├── TrendChart
├── GoalsList
└── StrategyConfig (NUEVO, collapsible)
    ├── Saldo inicial + fecha
    ├── Margen objetivo
    ├── Costos fijos (lista CRUD)
    │   └── CostoFijoRow (concepto + monto + 🗑)
    ├── Botón "+ Añadir"
    ├── Botón "Guardar Configuración"
    └── Advertencia cash estimado
```

---

## 5. API Endpoints

### `GET /api/config`
- Lee `cont_configuracion` por `user_id` (del auth)
- Retorna: `{ saldo_inicial, fecha_saldo, costos_fijos, margen_objetivo }`

### `PUT /api/config`
- Upsert en `cont_configuracion`
- Body: `{ saldo_inicial, fecha_saldo, costos_fijos, margen_objetivo }`

---

## 6. Acceptance Criteria

- [ ] Solo Profit Margin muestra trend arrow
- [ ] Collapsible de config dentro de DataPanel
- [ ] Costos fijos precargados del reporte (~$18M)
- [ ] Saldo inicial + fecha editables
- [ ] Cash estimado = saldo + transacciones
- [ ] Advertencia visible cuando saldo > 0
- [ ] Config persiste en Supabase (`cont_configuracion`)
- [ ] Métricas se recalculan al guardar
- [ ] Build exitoso
