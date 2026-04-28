# Spec: SimpleLegendContent Component

## Requirements

### REQ-1: SimpleLegendContent Component

**Type:** New Component
**File:** `src/components/ui/chart.tsx`

**Props:**
```typescript
interface SimpleLegendContentProps {
  colors?: {
    ingresos: string;   // default: '#10b981'
    egresos: string;   // default: '#fb7185'
    balance?: string;  // default: '#8b5cf6'
  }
  labels?: {
    ingresos: string;  // default: 'Ingresos'
    egresos: string;   // default: 'Egresos'
    balance?: string;  // default: 'Balance'
  }
  showBalance?: boolean;  // default: false
}
```

**Rendering:**
- Container: `flex items-center justify-center gap-4 pt-3`
- Cada item: `flex items-center gap-1.5`
- Icono SVG inline (trending up/down/balance)
- Color dot: `h-2 w-2 rounded-[2px]`
- Label: `text-xs text-muted-foreground font-medium`

### REQ-2: Iconos SVG

**Ingresos (emerald):**
- SVG trending-up line
- Stroke: `#10b981`

**Egresos (rose):**
- SVG trending-down line
- Stroke: `#fb7185`

**Balance (violet):**
- SVG bar-chart line
- Stroke: `#8b5cf6`

### REQ-3: Graficas.tsx Integration

**Import:**
```typescript
import { SimpleLegendContent } from '@/components/ui/chart';
```

**Usage Locations:**
| Chart | Props |
|-------|-------|
| BarChart | `<SimpleLegendContent />` |
| AreaChart (Evolución) | `<SimpleLegendContent />` |
| PieChart | `<SimpleLegendContent />` |
| AreaChart (Mensual) | `<SimpleLegendContent />` |
| LineChart (Balance) | `<SimpleLegendContent showBalance />` |

## Scenarios

### Scenario 1: Default render (Ingresos + Egresos)
- **Given** `SimpleLegendContent` sin props
- **When** renderiza
- **Then** muestra "Ingresos" (emerald) + "Egresos" (rose)

### Scenario 2: With Balance
- **Given** `SimpleLegendContent showBalance={true}`
- **When** renderiza
- **Then** muestra "Ingresos" + "Egresos" + "Balance" (violet)

### Scenario 3: Custom labels
- **Given** `SimpleLegendContent labels={{ ingresos: 'Ventas', egresos: 'Gastos' }}`
- **When** renderiza
- **Then** muestra "Ventas" + "Gastos"
