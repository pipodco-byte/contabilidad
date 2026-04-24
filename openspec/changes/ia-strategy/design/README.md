# IA Strategy - Technical Design

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌─────────────────────────────────────┐   │
│  │   Sidebar    │ ──► │         StrategyPanel              │   │
│  │              │     │  ┌───────────────────────────────┐  │   │
│  │  [IA Strategy]│     │  │      MetricsGrid (2x2)       │  │   │
│  │              │     │  │  BurnRate │ Runway │ ...      │  │   │
│  └──────────────┘     │  └───────────────────────────────┘  │   │
│                       │  ┌───────────────────────────────┐  │   │
│                       │  │      StrategyChat             │  │   │
│                       │  │  (DeepSeek Advisor)           │  │   │
│                       │  └───────────────────────────────┘  │   │
│                       │  ┌───────────────────────────────┐  │   │
│                       │  │      GoalsList + TrendChart   │  │   │
│                       │  └───────────────────────────────┘  │   │
│                       └─────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              useStrategyData (hook)                     │   │
│  │  - localStorage: pipod_strategy                         │   │
│  │  - calculatedMetrics (from transactions)                 │   │
│  │  - manualInputs (from settings)                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │ /api/strategy/chat  │    │ /api/strategy/      │            │
│  │                     │    │ calculate           │            │
│  │ POST                │    │ POST                │            │
│  │ - DeepSeek API      │    │ - Metrics calc      │            │
│  │ - strategyData ctx   │    │ - From transactions │            │
│  │ - Prompt hardening  │    └─────────────────────┘            │
│  └─────────────────────┘                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. File Structure

```
src/
├── components/
│   └── strategy/
│       ├── StrategySidebarButton.tsx    # Botón sidebar
│       ├── StrategyPanel.tsx            # Panel principal (right panel)
│       ├── MetricsGrid.tsx              # Grid 2x2 métricas
│       ├── MetricCard.tsx               # Card individual métrica
│       ├── StrategyChat.tsx             # Chat advisor
│       ├── StrategyMessage.tsx          # Mensaje individual
│       ├── GoalsList.tsx                # Lista de metas
│       ├── GoalCard.tsx                 # Card meta individual
│       ├── GoalForm.tsx                 # Modal crear/editar meta
│       ├── StrategySettingsModal.tsx    # Modal settings
│       ├── TrendChart.tsx               # Mini chart de márgenes
│       ├── RunwayBadge.tsx              # Badge color runway
│       └── index.ts                     # Barrel export
│
├── hooks/
│   └── useStrategyData.ts               # Hook principal (localStorage + calc)
│
├── lib/
│   ├── strategy-calculations.ts          # Funciones de cálculo
│   ├── strategy-prompt.ts                # Prompt hardening
│   └── strategy-types.ts                 # Types (re-export)
│
├── app/
│   └── api/
│       └── strategy/
│           ├── chat/
│           │   └── route.ts             # POST /api/strategy/chat
│           └── calculate/
│               └── route.ts             # POST /api/strategy/calculate
│
└── app/
    └── dashboard/
        ├── layout.tsx                   # Sidebar integration
        └── page.tsx                     # Dashboard con sidebar
```

---

## 3. StrategyData Schema

```typescript
// lib/strategy-types.ts

export interface FixedCost {
  id: string;
  label: string;
  amount: number;
}

export interface ManualInputs {
  fixedCosts: FixedCost[];
  currentCash: number;
  targetMargin: number;
}

export interface CalculatedMetrics {
  burnRate: number;
  breakEven: number;
  runway: number;
  profitMarginQuarterly: number;
  profitMarginMonthly: number;
  avgRevenue: number;
  avgVariableCosts: number;
  marginTrend: number;
  safetyBuffer: number;
  historicalMargins: Array<{ month: string; margin: number }>;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  status: 'on_track' | 'at_risk' | 'completed';
  category: 'savings' | 'investment' | 'debt_payment';
}

export interface StrategySettings {
  burnRateMonths: number;
  currency: string;
}

export interface Period {
  quarterly: { start: string; end: string };
  monthly: { start: string; end: string };
}

export interface StrategyData {
  manualInputs: ManualInputs;
  calculatedMetrics: CalculatedMetrics;
  lastUpdated: string;
  period: Period;
  goals: Goal[];
  settings: StrategySettings;
}

// Default values
export const DEFAULT_STRATEGY_DATA: StrategyData = {
  manualInputs: {
    fixedCosts: [],
    currentCash: 0,
    targetMargin: 20,
  },
  calculatedMetrics: {
    burnRate: 0,
    breakEven: 0,
    runway: 0,
    profitMarginQuarterly: 0,
    profitMarginMonthly: 0,
    avgRevenue: 0,
    avgVariableCosts: 0,
    marginTrend: 0,
    safetyBuffer: 0,
    historicalMargins: [],
  },
  lastUpdated: new Date().toISOString(),
  period: {
    quarterly: {
      start: getQuarterStart(),
      end: getQuarterEnd(),
    },
    monthly: {
      start: getMonthStart(),
      end: getMonthEnd(),
    },
  },
  goals: [],
  settings: {
    burnRateMonths: 3,
    currency: 'MXN',
  },
};
```

---

## 4. Calculations Module

```typescript
// lib/strategy-calculations.ts

import { Transaction } from '@/types';

export interface CalculationInput {
  transactions: Transaction[];
  fixedCosts: Array<{ label: string; amount: number }>;
  currentCash: number;
  targetMargin: number;
  burnRateMonths?: number; // default 3
}

export interface CalculatedMetrics {
  burnRate: number;
  breakEven: number;
  runway: number;
  profitMarginMonthly: number;
  profitMarginQuarterly: number;
  avgRevenue: number;
  avgVariableCosts: number;
  marginTrend: number;
  safetyBuffer: number;
  historicalMargins: Array<{ month: string; margin: number }>;
}

export function calculateMetrics(input: CalculationInput): CalculatedMetrics {
  const { transactions, fixedCosts, currentCash, targetMargin, burnRateMonths = 3 } = input;

  // Get transactions from last N months
  const months = getLastNMonths(burnRateMonths);
  const monthlyData = extractMonthlyData(transactions, months);

  // Burn Rate: average monthly expenses
  const avgExpenses = monthlyData.reduce((sum, m) => sum + m.totalExpenses, 0) / months.length;
  const burnRate = Math.round(avgExpenses);

  // Revenue
  const avgRevenue = monthlyData.reduce((sum, m) => sum + m.totalRevenue, 0) / months.length;

  // Variable costs
  const avgVariableCosts = monthlyData.reduce((sum, m) => sum + m.variableCosts, 0) / months.length;

  // Profit margins per month
  const monthlyMargins = monthlyData.map(m =>
    m.totalRevenue > 0 ? ((m.totalRevenue - m.totalExpenses) / m.totalRevenue) * 100 : 0
  );

  // Current month margin
  const profitMarginMonthly = monthlyMargins[monthlyMargins.length - 1] || 0;

  // Quarterly margin (average of last 3 months)
  const profitMarginQuarterly = monthlyMargins.slice(-3).reduce((a, b) => a + b, 0) / 3 || 0;

  // Margin trend: current vs previous month
  const marginTrend = monthlyMargins.length >= 2
    ? monthlyMargins[monthlyMargins.length - 1] - monthlyMargins[monthlyMargins.length - 2]
    : 0;

  // Historical margins (last 6 months)
  const historicalMargins = months.slice(-6).map((month, i) => ({
    month,
    margin: monthlyMargins[i] || 0,
  }));

  // Break-even: Fixed Costs / (Revenue - VariableCosts) per unit
  // Simplified: fixedCosts / profitMargin
  const totalFixedCosts = fixedCosts.reduce((sum, fc) => sum + fc.amount, 0);
  const profitMarginDecimal = profitMarginMonthly / 100 || 0.2;
  const breakEven = profitMarginDecimal > 0
    ? Math.round(totalFixedCosts / profitMarginDecimal)
    : totalFixedCosts * 5; // fallback estimate

  // Runway: currentCash / burnRate
  const runway = burnRate > 0 ? currentCash / burnRate : 0;

  // Safety Buffer: currentCash / fixedCosts (months without any revenue)
  const safetyBuffer = totalFixedCosts > 0 ? currentCash / totalFixedCosts : 0;

  return {
    burnRate,
    breakEven,
    runway: Math.round(runway * 10) / 10,
    profitMarginMonthly: Math.round(profitMarginMonthly * 100) / 100,
    profitMarginQuarterly: Math.round(profitMarginQuarterly * 100) / 100,
    avgRevenue: Math.round(avgRevenue),
    avgVariableCosts: Math.round(avgVariableCosts),
    marginTrend: Math.round(marginTrend * 100) / 100,
    safetyBuffer: Math.round(safetyBuffer * 10) / 10,
    historicalMargins,
  };
}
```

---

## 5. Strategy Advisor Prompt

```typescript
// lib/strategy-prompt.ts

export const STRATEGY_ADVISOR_SYSTEM_PROMPT = `Eres "Strategy Advisor" - un asistente estratégico de negocio para Pipod, un negocio de retail técnico especializado en productos Apple y componentes.

REGLAS ABSOLUTAS (NUNCA VIOLAR):
1. SOLO usa datos del objeto strategyData proporcionado en cada request
2. NUNCA inventes números, métricas o datos que no estén en strategyData
3. Si el dato solicitado no está disponible, responde exactamente: "No tengo suficiente información para responder esa pregunta."
4. NO sugieras acciones que no estén respaldadas por los datos disponibles
5. NO interprets datos más allá de lo que muestran los números

CONTEXTO DEL NEGOCIO:
- Pipod es un negocio de retail técnico (Apple, componentes, accesorios)
- Estacionalidad: Q4 (Oct-Dic) es temporada alta, Q1 (Ene-Mar) suele ser más lento
- Costos variables: comisiones, envíos, insumos de empaque
- Costos fijos: arriendo, nómina fija, servicios básicos

MÉTRICAS DISPONIBLES (usa estos nombres exactos):
- burnRate: gasto mensual promedio en pesos MXN
- runway: meses restantes de operación (currentCash / burnRate)
- breakEven: ingresos mínimos mensuales para cubrir todos los costos
- profitMarginMonthly: porcentaje de profit del mes actual
- profitMarginQuarterly: porcentaje de profit del trimestre
- marginTrend: cambio en profit margin vs mes anterior (positivo = mejorando)
- safetyBuffer: meses de vida sin ninguna venta (currentCash / fixedCosts)
- historicalMargins: array con {month, margin} de los últimos 6 meses
- fixedCosts: array con {label, amount} de costos fijos mensuales
- currentCash: efectivo disponible en pesos MXN
- targetMargin: margen objetivo configurado por el usuario (%)

UMbrales de RUNWAY:
- runway > 6 meses = 🟢 SALUDABLE
- runway 3-6 meses = 🟡 CUIDADO
- runway < 3 meses = 🔴 CRÍTICO

COMPORTAMIENTO:
- Sé directo y accionable en tus respuestas
- Usa números concretos de strategyData
- Si el usuario pregunta si puede hacer un gasto, menciona el impacto en runway
- Para goals, calcula plazos realistas basados en burnRate y currentAmount
- Recomienda siempre que el runway se mantenga > 6 meses
- Si marginTrend es negativo 2+ meses consecutivos, advierte sobre tendencia

IDIOMA: Responde SIEMPRE en español mexicano.

EJEMPLO DE RESPUESTA CORRECTA:
Usuario: "¿Puedo comprar 5 iPhones?"
Datos: burnRate=45000, runway=8.2, currentCash=500000
Respuesta: "Sí, pero reduciría tu runway de 8.2 a 7.8 meses. Con un burn rate de $45,000/mes, cada iPhone de $25,000 baja tu runway en ~0.3 meses. Te recomiendo máximo 3 considerando que Q4 requiere mantener efectivo disponible."

EJEMPLO DE RESPUESTA INCORRECTA (PROHIBIDA):
"Según mis cálculos, podrías comprar..."
(Si no tienes los datos, NO calcules)
`;

export function buildStrategyContextMessage(data: StrategyData): string {
  return `DATOS ACTUALES DEL NEGOCIO:

Fixed Costs (mensuales):
${data.manualInputs.fixedCosts.map(fc => `- ${fc.label}: $${fc.amount.toLocaleString('es-MX')}`).join('\n')}
Total: $${data.manualInputs.fixedCosts.reduce((s, f) => s + f.amount, 0).toLocaleString('es-MX')}

Cash Disponible: $${data.manualInputs.currentCash.toLocaleString('es-MX')}

Target Margin: ${data.manualInputs.targetMargin}%

Métricas Calculadas:
- Burn Rate: $${data.calculatedMetrics.burnRate.toLocaleString('es-MX')}/mes
- Runway: ${data.calculatedMetrics.runway} meses
- Break-even: $${data.calculatedMetrics.breakEven.toLocaleString('es-MX')}/mes
- Profit Margin (mes): ${data.calculatedMetrics.profitMarginMonthly}%
- Profit Margin (trimestre): ${data.calculatedMetrics.profitMarginQuarterly}%
- Margin Trend: ${data.calculatedMetrics.marginTrend > 0 ? '↑' : '↓'} ${Math.abs(data.calculatedMetrics.marginTrend)}%

Histórico de Márgenes (últimos meses):
${data.calculatedMetrics.historicalMargins.map(h => `- ${h.month}: ${h.margin}%`).join('\n')}

Safety Buffer: ${data.calculatedMetrics.safetyBuffer} meses

Goals:
${data.goals.length > 0
  ? data.goals.map(g => `- ${g.title}: $${g.currentAmount.toLocaleString('es-MX')} / $${g.targetAmount.toLocaleString('es-MX')} (${Math.round((g.currentAmount / g.targetAmount) * 100)}%)`)
  : '- Sin goals configurados'}`;
}
```

---

## 6. API Routes

### 6.1 POST /api/strategy/chat

```typescript
// app/api/strategy/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export async function POST(request: NextRequest) {
  try {
    const { message, strategyData, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const contextMessage = buildStrategyContextMessage(strategyData);

    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: STRATEGY_ADVISOR_SYSTEM_PROMPT },
        { role: 'system', content: contextMessage },
        ...history.map((msg: { role: string; content: string }) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Strategy chat error:', error);
    return NextResponse.json(
      { error: 'Error communicating with DeepSeek' },
      { status: 500 }
    );
  }
}
```

### 6.2 POST /api/strategy/calculate

```typescript
// app/api/strategy/calculate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { calculateMetrics, CalculationInput } from '@/lib/strategy-calculations';

export async function POST(request: NextRequest) {
  try {
    const input: CalculationInput = await request.json();

    const metrics = calculateMetrics(input);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Strategy calculate error:', error);
    return NextResponse.json(
      { error: 'Error calculating metrics' },
      { status: 500 }
    );
  }
}
```

---

## 7. Component Specifications

### 7.1 StrategySidebarButton

```typescript
// Props
interface StrategySidebarButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Behavior
- When isOpen = true, show active state (accent background)
- When clicked, call onToggle
- Show tooltip "IA Strategy" on hover (sidebar expanded)
- Icon: Bot icon or chart trending up
```

### 7.2 MetricCard

```typescript
// Props
interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number; // percentage change
  badge?: 'success' | 'warning' | 'danger';
  icon?: string;
}

// Visual States
- Default: bg-secondary, border-subtle
- Hover: scale 1.02, bg-elevated
- Badge colors applied via border-left accent
```

### 7.3 RunwayBadge

```typescript
// Logic
function getRunwayBadge(runway: number): { color: 'success' | 'warning' | 'danger'; label: string; emoji: string } {
  if (runway > 6) return { color: 'success', label: 'SALUDABLE', emoji: '🟢' };
  if (runway >= 3) return { color: 'warning', label: 'CUIDADO', emoji: '🟡' };
  return { color: 'danger', label: 'CRÍTICO', emoji: '🔴' };
}
```

### 7.4 GoalCard

```typescript
// Props
interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

// Progress calculation
const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

// Status badge
- completed: green checkmark
- on_track: green dot (progress > 50% of timeline)
- at_risk: yellow dot (progress < 50% or past deadline)
```

---

## 8. localStorage Strategy

### Key: `pipod_strategy`

```typescript
// useStrategyData.ts

const STRATEGY_STORAGE_KEY = 'pipod_strategy';
const MAX_CHAT_MESSAGES = 40;

interface StoredStrategyData {
  manualInputs: ManualInputs;
  goals: Goal[];
  settings: StrategySettings;
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string; timestamp: string }>;
  version: number;
}

const CURRENT_VERSION = 1;

function migrateIfNeeded(data: StoredStrategyData): StoredStrategyData {
  if (!data.version || data.version < CURRENT_VERSION) {
    return { ...data, version: CURRENT_VERSION };
  }
  return data;
}
```

---

## 9. Dependencies

```json
{
  "dependencies": {
    "openai": "^4.x"
  }
}
```

No se requieren nuevas dependencias significativas - reuse:
- Framer Motion (existing animations)
- Tailwind CSS (existing styling)
- react-markdown (existing for Copilot)

---

## 10. Integration Points

### 10.1 Sidebar

El `StrategySidebarButton` se añade a `src/components/layout/Sidebar.tsx`:

```tsx
// Inside Sidebar
<div className="flex flex-col gap-2">
  <NavItem icon={DashboardIcon} label="Dashboard" href="/dashboard" />
  <NavItem icon={TransactionsIcon} label="Transacciones" href="/dashboard/transacciones" />
  <NavItem icon={ConfigIcon} label="Config" href="/dashboard/config" />
  {/* NEW */}
  <StrategySidebarButton
    isOpen={strategyPanelOpen}
    onToggle={() => setStrategyPanelOpen(!strategyPanelOpen)}
  />
</div>
```

### 10.2 Dashboard Layout

`strategyPanelOpen` state vive en `layout.tsx` y se pasa al sidebar:

```tsx
// layout.tsx
const [strategyPanelOpen, setStrategyPanelOpen] = useState(false);

<Sidebar>
  <StrategySidebarButton isOpen={strategyPanelOpen} onToggle={setStrategyPanelOpen} />
</Sidebar>

{strategyPanelOpen && <StrategyPanel onClose={() => setStrategyPanelOpen(false)} />}
```

---

## 11. OpenCode API Integration (PENDIENTE)

```typescript
// Para futuro: OpenCode minimax integration

// lib/opencode-client.ts (futuro)

interface OpenCodeConfig {
  apiKey: string;
  model: 'minimax-2.7' | 'minimax-2';
}

async function chatWithOpenCode(
  config: OpenCodeConfig,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  // POST to OpenCode API
  // Same interface as DeepSeek but different endpoint
}
```

**Status:** ⏳ Pendiente - no implementado aún
**Dependencia:** Requiere API key de OpenCode del usuario

---

## 12. Testing Strategy

| Test | Type | Coverage |
|------|------|----------|
| Calculations | Unit | All metric formulas |
| Runway badge logic | Unit | All thresholds |
| localStorage save/load | Integration | Migration, overflow |
| API route | API | Mock DeepSeek |
| Components | Visual/Unit | All states |

---

## 13. Performance Considerations

- **Lazy load** StrategyPanel (dynamic import)
- **Memoize** calculations with useMemo
- **Debounce** localStorage writes (300ms)
- **Limit** chat history to 40 messages (FIFO)
- **Cache** DeepSeek responses for repeated queries (optional)
