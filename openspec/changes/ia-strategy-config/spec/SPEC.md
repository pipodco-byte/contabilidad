# Spec: IA Strategy Configuration Panel + Trend Fix

## Change: `ia-strategy-config`

---

## 1. Overview

Agregar un panel de configuración para definir costos fijos, cash actual y margen objetivo dentro del DataPanel de IA Strategy. Corregir el bug visual de tendencia repetida en las tarjetas de métricas.

---

## 2. Requirements

### R1: Fix de Tendencia Repetida
- Solo la tarjeta "Profit Margin" muestra la flecha de tendencia (`marginTrend`)
- Burn Rate, Runway y Break-even: **sin** `trend` prop → no muestran flecha
- El cambio es **solo en MetricsGrid.tsx** (3 líneas)

### R2: Formulario de Costos Fijos
- Lista editable de costos fijos mensuales
- Cada item: **concepto** (texto) + **monto** (número)
- Botón "Añadir costo fijo" al final de la lista
- Cada fila: input de concepto + input de monto + botón eliminar (🗑)
- Diseño compacto, pills minimalistas

### R3: Inputs de Cash y Margen
- **Cash actual:** input numérico, muestra formato de moneda colombiana
- **Margen objetivo:** input numérico, porcentaje (default: 20)
- Ambos con labels claros

### R4: Persistencia
- Al guardar, llama `updateManualInputs()` del hook `useStrategyData`
- Se guarda en localStorage automáticamente
- Las métricas se recalculan al instante (vía `useMemo` en el hook)

### R5: Integración en DataPanel
- Nueva sección "Costos Fijos" debajo de "Mis Metas"
- Collapsible opcional (mostrar/ocultar con toggle)
- Mismo estilo visual que el resto del panel

---

## 3. Scenarios

### S1: Configurar por primera vez
**Given** el usuario abre IA Strategy por primera vez
**When** ve la sección "Costos Fijos" en el panel derecho
**Then** ve campos vacíos con placeholder "Añadir costo fijo"
**And** cash actual en $0
**And** margen objetivo en 20%

### S2: Añadir un costo fijo
**Given** la sección de costos fijos está visible
**When** el usuario escribe "Arriendo" y "2000000" y presiona "Añadir"
**Then** el costo aparece en la lista
**And** el break-even se recalcula si había suficientes datos

### S3: Verificar tendencia corregida
**Given** el panel derecho muestra 4 tarjetas de métricas
**When** el usuario mira las tarjetas
**Then** solo "Profit Margin" tiene flecha de tendencia
**And** Burn Rate, Runway, Break-even no muestran ninguna flecha

### S4: Recargar página
**Given** el usuario configuró costos fijos y cash
**When** recarga la página
**Then** los valores configurados persisten
**And** las métricas se recalculan con esos valores

---

## 4. Component Tree

```
DataPanel
├── MetricsGrid (fix: solo Profit Margin con trend)
│   ├── MetricCard "Quema Mensual"     (sin trend)
│   ├── MetricCard "Respaldo"          (sin trend)
│   ├── MetricCard "Punto Equilibrio"  (sin trend)
│   └── MetricCard "Margen"            (con trend ✅)
├── TrendChart
├── GoalsList
└── StrategyConfig (NUEVO)
    ├── Input: Cash actual
    ├── Input: Margen objetivo
    ├── Lista de costos fijos
    │   └── CostoFijoRow (concepto + monto + eliminar)
    └── Botón: Añadir costo fijo
```

---

## 5. Acceptance Criteria

- [ ] Solo Profit Margin muestra trend arrow
- [ ] Formulario de costos fijos funcional (CRUD)
- [ ] Cash actual y margen objetivo editables
- [ ] Datos persisten en localStorage
- [ ] Métricas se recalculan al guardar
- [ ] Break-even > $0 cuando hay costos fijos + margen configurados
- [ ] Runway > 0 cuando hay cash configurado
- [ ] Build exitoso
