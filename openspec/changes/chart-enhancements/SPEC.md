# Spec: Chart Enhancement — Donut + Balance Line

## Goal

Reemplazar Radar Chart por Donut Chart y añadir Balance Line Chart con Break-Even para mejorar la toma de decisiones financieras.

---

## G1: Donut Chart (Reemplaza Radar)

### Descripción
Gráfico de dona que muestra la distribución porcentual de egresos por categoría.

### Use Cases

| UC# | Escenario | Resultado Esperado |
|-----|-----------|-------------------|
| UC1 | Usuario ve dashboard | Donut muestra % de egresos por categoría |
| UC2 | Usuario pasa mouse sobre segmento | Tooltip muestra categoría + monto + % |
| UC3 | Categoría tiene 0 egresos | No se muestra en donut (solo categorías con datos) |
| UC4 | Hay más de 8 categorías | Categorías combinadas en "Otros" |

### Datos
- **Fuente:** `useGraficas` → `datosPorCategoria`
- **Campo:** `egresos` por `categoria`
- **Cálculo:** Porcentaje individual / total de egresos

### Estados

| Estado | Visualización |
|--------|--------------|
| Loading | Skeleton circular |
| Empty | "No hay egresos registrados" |
| Con datos | Donut con leyenda |
| Error | Mensaje de error con retry |

---

## G2: Balance Line Chart con Break-Even

### Descripción
Gráfico de línea que muestra la evolución del balance (ingresos - egresos) mes a mes, con línea horizontal en Y=0 (break-even point).

### Use Cases

| UC# | Escenario | Resultado Esperado |
|-----|-----------|-------------------|
| UC5 | Usuario ve dashboard | Line chart con balance mensual |
| UC6 | Balance cruza Y=0 | Línea violeta de break-even visible |
| UC7 | Balance positivo | Línea sobre break-even (verde/zinc) |
| UC8 | Balance negativo | Línea bajo break-even (rojo/zinc) |
| UC9 | Usuario pasa mouse | Tooltip con mes + balance formateado |

### Datos
- **Fuente:** `useInformeAnual` → `datosAnuales`
- **Campo:** `balance` por `mes`
- **Orden:** Cronológico (sort por fecha)

### Break-Even Line
- **Posición:** Y = 0
- **Color:** Violet (#8b5cf6) del tema
- **Estilo:** dashed (5 5)
- **Label:** "Punto de equilibrio"

### Estados

| Estado | Visualización |
|--------|--------------|
| Loading | Skeleton lineal |
| Empty | "No hay datos para mostrar" |
| Con datos | Line chart + break-even |
| Un solo mes | Línea horizontal simple |

---

## Fix: useEvolucionMensual Precision

### Descripción
Eliminar división arbitraria por 1,000,000 que causa valores "0" para montos pequeños.

### Cambio
```typescript
// ANTES (incorrecto)
Ingresos: Math.round((mapa[mes].Ingresos / 1000000) * 10) / 10 || 0

// DESPUÉS (correcto) - mantener valor real, formatear en UI
Ingresos: mapa[mes].Ingresos || 0
```

### Cálculo de presentación
- Usar `Intl.NumberFormat` con `notation: 'compact'`
- Ejemplo: 1,500,000 → "1.5M"
- Máximo 1 decimal

---

## Acceptance Criteria

### G1: Donut Chart
- [ ] Reemplaza completamente el Radar Chart
- [ ] Muestra % de egresos por categoría
- [ ] Tooltip con categoría + monto + %
- [ ] Solo categorías con egresos > 0
- [ ] Leyenda identifica cada segmento
- [ ] Colores del tema (Rose para egresos)

### G2: Balance Line Chart
- [ ] Línea de balance mensual (no acumulado)
- [ ] Break-even line en Y=0 (violet, dashed)
- [ ] Label "Punto de equilibrio" visible
- [ ] Datos ordenados cronológicamente
- [ ] Tooltip con valores formateados

### Fix Precision
- [ ] `useEvolucionMensual` devuelve valores sin división
- [ ] `Intl.NumberFormat` formatea correctamente en UI
- [ ] Valores < 1M muestran decimales apropiados

---

## No Cambios

- Bar Chart se mantiene igual
- Area Chart "Evolución Temporal" se mantiene igual
- Tabla "Comparativa Mensual" se mantiene igual
