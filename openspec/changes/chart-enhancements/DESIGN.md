# Design: Chart Enhancement — Donut + Balance Line

## Architecture

### File Changes

| Acción | Archivo | Descripción |
|--------|---------|-------------|
| MODIFY | `src/components/Graficas.tsx` | Eliminar Radar, añadir Donut + Balance Line |
| MODIFY | `src/hooks/useEvolucionMensual.ts` | Eliminar división /1M |
| DELETE | `src/hooks/useRadarData.ts` | No usado después de remove radar |

---

## G1: Donut Chart Component

### Importaciones Recharts
```typescript
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
```

### Props del Componente
```typescript
interface DonutChartProps {
  data: { categoria: string; egresos: number }[];
  isDark: boolean;
}
```

### Colores (Tema Rose)
```typescript
const EGRESOS_COLORS = [
  '#fb7185', // rose-400
  '#f43f5e', // rose-500
  '#e11d48', // rose-600
  '#be123c', // rose-700
  '#9f1239', // rose-800
  '#881337', // rose-900
  '#fbbf24', // amber-400 (alternativa)
  '#f59e0b', // amber-500 (alternativa)
];
```

### Cálculo de Porcentajes
```typescript
const totalEgresos = data.reduce((sum, item) => sum + item.egresos, 0);

const dataConPorcentaje = data
  .filter(item => item.egresos > 0)
  .map(item => ({
    ...item,
    porcentaje: (item.egresos / totalEgresos) * 100,
  }))
  .sort((a, b) => b.egresos - a.egresos); // mayor primero

// Si > 8 categorías, agrupar en "Otros"
const MAX_CATEGORIES = 8;
let chartData = dataConPorcentaje;
let others = 0;

if (chartData.length > MAX_CATEGORIES) {
  const top = chartData.slice(0, MAX_CATEGORIES - 1);
  others = chartData.slice(MAX_CATEGORIES - 1).reduce((sum, item) => sum + item.porcentaje, 0);
  chartData = [...top, { categoria: 'Otros', egresos: 0, porcentaje: others }];
}
```

### Render
```tsx
<PieChart>
  <Pie
    data={chartData}
    cx="50%"
    cy="50%"
    innerRadius={80}
    outerRadius={140}
    paddingAngle={2}
    dataKey="egresos"
  >
    {chartData.map((entry, index) => (
      <Cell key={entry.categoria} fill={EGRESOS_COLORS[index % EGRESOS_COLORS.length]} />
    ))}
  </Pie>
  <Tooltip formatter={(value) => formatCurrency(value as number)} />
  <Legend
    formatter={(value, entry) => {
      const item = entry.payload as { categoria: string; porcentaje: number };
      return `${item.categoria} (${item.porcentaje.toFixed(1)}%)`;
    }}
  />
</PieChart>
```

---

## G2: Balance Line Chart Component

### Importaciones Recharts
```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
```

### Props del Componente
```typescript
interface BalanceLineChartProps {
  data: { mes: string; balance: number; ingresos: number; egresos: number }[];
  isDark: boolean;
}
```

### Ordenamiento
```typescript
const mesesOrdenados = [...data].sort(
  (a, b) => new Date(a.mes).getTime() - new Date(b.mes).getTime()
);
```

### Render con Break-Even
```tsx
<LineChart data={mesesOrdenados}>
  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
  <XAxis dataKey="mes" stroke={axisStroke} />
  <YAxis
    stroke={axisStroke}
    tickFormatter={(value) => formatCurrencyCompact(value)}
  />
  <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatCurrency(value as number)} />
  <Legend />

  {/* Break-even line */}
  <ReferenceLine
    y={0}
    stroke="#8b5cf6"
    strokeDasharray="5 5"
    label={{
      value: 'Punto de equilibrio',
      position: 'insideTopRight',
      fill: '#8b5cf6',
      fontSize: 12,
    }}
  />

  {/* Balance line - color dinámico basado en valor */}
  <Line
    type="monotone"
    dataKey="balance"
    stroke="#8b5cf6"
    strokeWidth={3}
    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
    activeDot={{ r: 6 }}
    name="Balance"
  />
</LineChart>
```

---

## Fix: useEvolucionMensual

### Cambio en Línea 54-55

```typescript
// ANTES
const mesData = MESES.map(mes => ({
  mes,
  Ingresos: Math.round((mapa[mes].Ingresos / 1000000) * 10) / 10 || 0,
  Egresos: Math.round((mapa[mes].Egresos / 1000000) * 10) / 10 || 0,
}));

// DESPUÉS
const mesData = MESES.map(mes => ({
  mes,
  Ingresos: mapa[mes].Ingresos || 0,
  Egresos: mapa[mes].Egresos || 0,
}));
```

### Actualización del YAxis en Graficas.tsx

```tsx
// El YAxis ya usa formatCurrencyCompact que maneja notation: 'compact'
<YAxis stroke={axisStroke} tickFormatter={(value) => formatCurrencyCompact(value)} />
```

---

## UI Layout en Graficas.tsx

### Orden de Gráficos (Propuesto)

```
1. Bar Chart          - Ingresos vs Egresos por Categoría
2. Donut Chart        - Distribución de Egresos (NUEVO)
3. Area Chart         - Evolución Temporal (INGRESOS - EGRESOS)
4. Balance Line Chart - Balance Neto + Break-Even (NUEVO)
5. Tabla              - Comparativa Mensual
```

### Remover
- Radar Chart (líneas 127-142 completas)

---

## Estado: Verificar Recharts Imports

En `Graficas.tsx` línea 9-25, verificar que estén:
```typescript
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,     // AGREGAR
  Pie,         // AGREGAR
  Cell,        // AGREGAR
  LineChart,   // AGREGAR
  Line,        // AGREGAR
  ReferenceLine, // AGREGAR
} from 'recharts';
```

---

## Dark Mode

Los colores violets/rose son iguales en dark y light mode. Solo ajustar:
- `axisStroke` (línea 66)
- `labelColor` (línea 67)
- `gridStroke` (línea 68)
