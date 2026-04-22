# Tasks: Chart Enhancement — Donut + Balance Line

## Implementación

### T1: Fix useEvolucionMensual (Precisión)
**Archivo:** `src/hooks/useEvolucionMensual.ts`

- [ ] Línea 54: Cambiar `Math.round((mapa[mes].Ingresos / 1000000) * 10) / 10 || 0` por `mapa[mes].Ingresos || 0`
- [ ] Línea 55: Cambiar `Math.round((mapa[mes].Egresos / 1000000) * 10) / 10 || 0` por `mapa[mes].Egresos || 0`
- [ ] Verificar que `formatCurrencyCompact` en Graficas.tsx maneja valores grandes con `notation: 'compact'`

---

### T2: Importar Componentes Recharts
**Archivo:** `src/components/Graficas.tsx`

- [ ] Línea 9-25: Añadir imports:
  ```typescript
  import {
    // ... existentes ...
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ReferenceLine,
  } from 'recharts';
  ```

---

### T3: Crear Donut Chart
**Archivo:** `src/components/Graficas.tsx`

- [ ] Definir `EGRESOS_COLORS` array con 8 colores Rose/Amber
- [ ] Crear función helper para calcular percentages y agrupar "Otros" si >8 categorías
- [ ] Crear sección de Donut Chart (reemplaza líneas 127-142 del Radar)
  - [ ] Card container con título "Distribución de Egresos"
  - [ ] ResponsiveContainer height={400}
  - [ ] PieChart con innerRadius=80, outerRadius=140
  - [ ] Cells con colores del tema
  - [ ] Tooltip con formatCurrency
  - [ ] Legend con porcentaje

---

### T4: Crear Balance Line Chart
**Archivo:** `src/components/Graficas.tsx`

- [ ] Crear sección de Balance Line Chart (nueva, después del Area Chart)
  - [ ] Card container con título "Balance Neto Mensual"
  - [ ] ResponsiveContainer height={300}
  - [ ] Ordenar datos por fecha (`mesesOrdenados`)
  - [ ] LineChart con datos ordenados
  - [ ] ReferenceLine en y={0} con stroke="#8b5cf6", strokeDasharray="5 5"
  - [ ] Label "Punto de equilibrio"
  - [ ] Line con dataKey="balance", stroke="#8b5cf6"
  - [ ] Tooltip con formatCurrency

---

### T5: Eliminar Radar Chart
**Archivo:** `src/components/Graficas.tsx`

- [ ] Eliminar líneas 127-142 (componente Radar completo)
- [ ] Eliminar import de `useRadarData` (línea 5)
- [ ] Eliminar uso de `useRadarData` (línea 35)
- [ ] Actualizar loading check (línea 39) - remover `loadingRadar`
- [ ] Opcional: Eliminar archivo `src/hooks/useRadarData.ts`

---

### T6: Reordenar Gráficos
**Archivo:** `src/components/Graficas.tsx`

Orden final:
1. Bar Chart (líneas 93-108)
2. **Donut Chart** (nuevo - reemplaza donde estaba Radar)
3. Area Chart "Evolución Temporal" (líneas 110-125)
4. **Balance Line Chart** (nuevo)
5. Tabla Comparativa (líneas 195-237)

---

### T7: Verificar Dark Mode
**Archivo:** `src/components/Graficas.tsx`

- [ ] Verificar que Donut funciona con `isDark` igual que otros charts
- [ ] Verificar que Balance Line tiene estilos consistentes

---

### T8: Build y Lint
**Comandos:**

```bash
npm run build
npm run lint
```

- [ ] Zero errores de build
- [ ] Zero errores de lint

---

## Notas

- **No modificar** `useGraficas.ts` ni `useInformeAnual.ts` — ya devuelven los datos correctos
- **No modificar** Bar Chart, Area Chart, ni Tabla
- **Usar** `formatCurrencyCompact` existente para formateo en YAxis
