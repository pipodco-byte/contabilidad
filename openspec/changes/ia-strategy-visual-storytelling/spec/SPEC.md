# SPEC: IA Strategy - Visual Storytelling (Fase 4 + Fase 5)

## Overview

**Change:** `ia-strategy-visual-storytelling`
**Type:** Enhancement (Narrative + Data Visualization)
**Fast Track:** Fase 5 (Narrative) - immediate value with existing infrastructure

---

## Fase 5: The Captain's Log (Narrativa Estratégica)

### Context

IA Strategy ya tiene acceso a datos reales vía `getFinancialContext()` (Fase 2). El objetivo es que la IA no solo procese números, sino que los **contextualice narrativamente** con un tono distintivo de "Capitán del navío empresarial".

### Requirements

#### R1: System Prompt con Voz de Capitán
- **File:** `src/lib/strategy-prompt.ts`
- **Current:** `STRATEGY_ADVISOR_SYSTEM_PROMPT` genérico
- **Target:** Prompt con instrucciones de narrativa estratégica

#### R2: Estructura de Respuesta Narrativa
Cada respuesta del Capitán debe seguir:
1. **Apertura:** Situación general (buenos/malos vientos)
2. **Desarrollo:** Números en contexto narrativo
3. **Cierre:** Rumbo recomendado (siguiente acción)

#### R3: Tono y Estilo
- Profesional pero cálido
- Analogías marítimas sutiles (opcionales)
- Siempre orientado a la acción
- Datosanchored (fechas específicas, no vaguedades)

#### R4: Metadatos de Contexto
La IA debe poder interpretar:
- Ingresos vs Egresos (¿positivos o negativos?)
- Distance to break-even (¿arriba o abajo?)
- Trend direction (¿mejorando o empeorando?)
- Burn rate implications

### Example Output

```
┌─────────────────────────────────────────────────────────┐
│ Capitán: Reporte del 15 de Abril                        │
├─────────────────────────────────────────────────────────┤
│ Los vientos fueron favorables hoy, Felipe.              │
│                                                     │
│ Tu vela de ingresos capturó [15M COP], un 12%       │
│ más que tu promedio semanal. Las corrientes de        │
│ egresos trajeron [2M COP], dentro de lo esperado.    │
│                                                     │
│ El viento a tu espalda: Llevas [85%] de tu meta       │
│ de [50M COP] para un negocio sano.                  │
│                                                     │
│ La sombra en el horizonte: Tu burn rate aceleró       │
│ ligeramente. Si la tendencia continúa, el cierre     │
│ de mes estaría [6%] debajo del punto de equilibrio.  │
│                                                     │
│ Rumo recomendado: Considera ajustar las velas        │
│ de gastos operacionales esta semana.                  │
└─────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- [ ] AC5.1: IA responde con tono de Capitán (no genérico)
- [ ] AC5.2: Estructura: Apertura → Desarrollo → Cierre
- [ ] AC5.3: Datos interpretados (no solo reportados)
- [ ] AC5.4: Próxima acción recomendada siempre presente

---

## Fase 4: Visual Insights (Data Viz)

### Context

Agregar gráficos迷你 (mini charts) al componente `StrategyChat` para visualizar tendencias. Ya existe infraestructura de recharts en `Graficas.tsx`.

### Requirements

#### R6: Componente StrategyMiniChart
- **File:** `src/components/strategy/StrategyMiniChart.tsx`
- **Type:** `ComboChart` (Área + Línea)
- **Library:** recharts (ya instalado)

#### R7: Data Series
| Serie | Tipo | Color |
|-------|------|-------|
| Ingresos | Area (fill) | emerald-500 / emerald-900 |
| Egresos | Area (fill) | rose-400 / rose-900 |
| Gastos Fijos | Line (dashed) | zinc-400 |
| Break-even | Line (solid) | indigo-500 |

#### R8: Estética Zinc Minimalista
- Líneas: 1px stroke
- Sin bordes de contenedor
- Tooltips: Minimalistas, solo valor
- Paleta: zinc, emerald, rose, indigo (del design system)

#### R9: Integración en StrategyChat
- Ubicación: Debajo del input, arriba del historial
- Tamaño: 100% width, 120px height
- Scroll: Hidden overflow

### Component Specs

```tsx
interface StrategyMiniChartProps {
  data: {
    month: string;
    ingresos: number;
    egresos: number;
    gastosFijos?: number;
    breakEven?: number;
  }[];
  showLegend?: boolean;
}
```

### Acceptance Criteria

- [ ] AC4.1: `StrategyMiniChart.tsx` renderiza sin errores
- [ ] AC4.2: 4 data series visibles (Ingresos, Egresos, Gastos Fijos, Break-even)
- [ ] AC4.3: Colores matchean Zinc aesthetic
- [ ] AC4.4: Tooltips funcionan en hover
- [ ] AC4.5: Integración visible en StrategyChat

---

## Design Tokens (Referencia)

```css
--color-emerald-500: #10b981;
--color-emerald-900: #064e3b;
--color-rose-400: #fb7185;
--color-rose-900: #881337;
--color-zinc-400: #a1a1aa;
--color-indigo-500: #6366f1;
--color-zinc-900: #18181b;
```

---

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| AI tone too flowery / verbose | Med | Fine-tune prompt, examples, limit metaphors |
| Charts slow load | Low | Lazy load, skeleton state |
| Data stale | Low | Real-time from SQL View |

---

## Dependencies

- **Fase 2:** `getFinancialContext()` ya existe
- **Fase 2:** `strategy-constants.ts` ($40.5M break-even, $12.1M gastos)
- **Fase 1:** `StrategyChat.tsx` (base component)
- **Existing:** recharts (already installed)