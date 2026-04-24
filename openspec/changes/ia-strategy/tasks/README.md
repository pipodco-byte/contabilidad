# IA Strategy - Task Checklist

## Overview

Total Tasks: 18
Completed: 16 (T1-T14, T16-T18)
Pending: 2 (T15 - Security tests, T17 - optional calculate endpoint)
Priorities: Alta (H), Media (M), Baja (L)

---

## FASE 1: Fundamentos

### T1: Schema y Tipos TypeScript ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/lib/strategy-types.ts`

**Tasks:**
- [x] Crear interface `FixedCost`, `ManualInputs`, `CalculatedMetrics`, `Goal`, `StrategySettings`, `StrategyData`
- [x] Crear `DEFAULT_STRATEGY_DATA` con valores iniciales
- [x] Exportar tipos para uso en toda la app

**Acceptance:** Types compile without errors

---

### T2: Hook useStrategyData ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/hooks/useStrategyData.ts`

**Tasks:**
- [x] Crear hook con estado `strategyData`
- [x] Cargar desde localStorage key `pipod_strategy`
- [x] Guardar automáticamente en cambios
- [x] Implementar migración de schema si version cambia
- [x] Proveer métodos: `updateManualInputs`, `updateCalculatedMetrics`, `addGoal`, `updateGoal`, `deleteGoal`
- [x] Manejar caso localStorage vacío (usar defaults)

**Acceptance:** Data persists across page reloads

---

### T3: Cálculos de Métricas ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/lib/strategy-calculations.ts`

**Tasks:**
- [x] Función `calculateMetrics(input: CalculationInput): CalculatedMetrics`
- [x] Calcular `burnRate` (promedio móvil 3 meses)
- [x] Calcular `breakEven` (fixedCosts / margin)
- [x] Calcular `runway` (currentCash / burnRate)
- [x] Calcular `profitMarginMonthly` y `profitMarginQuarterly`
- [x] Calcular `marginTrend` (vs mes anterior)
- [x] Calcular `safetyBuffer` (currentCash / fixedCosts)
- [x] Generar `historicalMargins` (últimos 6 meses)
- [x] Función helper `getLastNMonths(n: number): string[]`
- [x] Función helper `extractMonthlyData(transactions, months)`

**Acceptance:** All calculations match expected formulas

---

### T4: StrategySidebarButton ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/components/strategy/StrategySidebarButton.tsx`

**Tasks:**
- [x] Crear componente con icono de robot
- [x] Props: `isOpen: boolean`, `onToggle: () => void`
- [x] Estado activo cuando `isOpen = true` (background accent)
- [x] Tooltip "IA Strategy" en hover
- [x] Animación de entrada suave
- [x] Integrar en Sidebar existente

**Acceptance:** Button visible and toggles panel

---

## FASE 2: UI Core

### T5: StrategyPanel Layout ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/components/strategy/StrategyPanel.tsx`

**Tasks:**
- [x] Crear panel derecho (right panel)
- [x] Header: título "Estrategia", botón Settings, botón X close
- [x] Layout scrolleable con secciones:
  - MetricsGrid
  - StrategyChat
  - GoalsList
  - TrendChart
- [x] Animación slide-in (300ms)
- [x] Props: `onClose: () => void`
- [x] Integrar con `useStrategyData`

**Acceptance:** Panel opens/closes smoothly

---

### T6: MetricsGrid + MetricCard ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/components/strategy/MetricsGrid.tsx`
- `src/components/strategy/MetricCard.tsx`

**Tasks:**
- [x] `MetricCard`:
  - Props: `title, value, unit, trend, badge, icon`
  - Diseño: bg-secondary, border-subtle, hover scale 1.02
  - Badge colors: success/warning/danger
- [x] `MetricsGrid`:
  - Grid 2x2 con 4 MetricCards
  - Cards: Burn Rate, Runway, Break-even, Profit Margin
  - Obtiene datos de `useStrategyData`

**Acceptance:** All 4 metrics display correctly

---

### T7: RunwayBadge ✅
**Priority:** Media
**Status:** ✅ COMPLETE
**Files:**
- `src/components/strategy/RunwayBadge.tsx`

**Tasks:**
- [x] Función `getRunwayBadge(runway: number)` en strategy-types
- [x] Lógica:
  - > 6 meses → 🟢 SALUDABLE
  - 3-6 meses → 🟡 CUIDADO
  - < 3 meses → 🔴 CRÍTICO
- [x] Componente reutilizable
- [x] Integrar en MetricCard de Runway

**Acceptance:** Correct badge for each threshold

---

### T8: TrendChart (Mini) ✅
**Priority:** Media
**Status:** ✅ COMPLETE
**Files:**
- `src/components/strategy/TrendChart.tsx`

**Tasks:**
- [x] Componente mini chart
- [x] Props: `data: Array<{month: string, margin: number}>`
- [x] Renderizado simple: barras con CSS
- [x] Fallback si datos < 2 meses
- [x] Diseño consistente con design system

**Acceptance:** Chart renders with historical data

---

### T9: GoalsList + GoalCard ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/components/strategy/GoalsList.tsx`
- `src/components/strategy/GoalCard.tsx`

**Tasks:**
- [x] `GoalCard`:
  - Props: `goal: Goal`, `onEdit`
  - Muestra: título, progress bar, %, status badge
  - Progress: `(currentAmount / targetAmount) * 100`
  - Status badges: 🟢 on_track, 🟡 at_risk, ✅ completed
  - Category icons: savings 💰, investment 📈, debt_payment 💳
- [x] `GoalsList`:
  - Mapea goals a GoalCards
  - Empty state con "Añade tu primera meta"
  - Botón "+ Añadir Meta"

**Acceptance:** Goals display with correct progress

---

### T10: GoalForm Modal ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/components/strategy/GoalForm.tsx`

**Tasks:**
- [x] Modal con formulario
- [x] Inputs:
  - Título (required)
  - Target amount (number, required)
  - Current amount (number, default 0)
  - Deadline (date, optional)
  - Category (select: savings/investment/debt_payment)
- [x] Validación: título no vacío, amounts >= 0
- [x] Botón Cancelar (cierra sin guardar)
- [x] Botón Guardar (valida y cierra)
- [x] Props: `isOpen, onClose, initialGoal?`

**Acceptance:** Form validates and saves correctly

---

### T11: StrategySettingsModal ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/components/strategy/StrategySettingsModal.tsx`

**Tasks:**
- [x] Modal de configuración
- [x] Sección Fixed Costs:
  - Lista de fixed costs con label + amount
  - Input para añadir nuevo (label + amount)
  - Botón X para eliminar cada uno
- [x] Sección Cash:
  - Input: currentCash (number, formatted)
- [x] Sección Margin:
  - Input: targetMargin (%, default 20)
- [x] Botón Cancelar
- [x] Botón Guardar (actualiza localStorage)
- [x] Props: `isOpen, onClose`

**Acceptance:** Settings persist to localStorage

---

## FASE 3: AI Integration

### T12: Strategy Advisor Prompt ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/lib/strategy-prompt.ts`

**Tasks:**
- [x] Crear `STRATEGY_ADVISOR_SYSTEM_PROMPT` con prompt hardening
- [x] Reglas absolutas: SOLO datos de strategyData, NUNCA inventar
- [x] Umbrales de runway en prompt
- [x] Contexto de negocio Pipod
- [x] Función `buildStrategyContextMessage(data: StrategyData): string`

**Acceptance:** Prompt created with hard rules against hallucination

---

### T13: API Route /api/strategy/chat ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/app/api/strategy/chat/route.ts`

**Tasks:**
- [x] POST endpoint usando `ai` SDK y `@ai-sdk/deepseek`
- [x] Validar request: `message, strategyData, history`
- [x] Llamar DeepSeek API con prompt + context
- [x] Retornar streaming response
- [x] Manejo de errores (DeepSeek down, rate limit)
- [x] Logging para debugging

**Acceptance:** API returns valid streaming responses from DeepSeek

---

### T14: StrategyChat Component ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/components/strategy/StrategyChat.tsx`
- `src/components/strategy/StrategyMessage.tsx`

**Tasks:**
- [x] `StrategyMessage`: renders user/assistant messages
- [x] `StrategyChat`:
  - Historial de mensajes (scrollable)
  - Input text con placeholder "Escribe tu pregunta..."
  - Botón Enviar (Enter también)
  - Loading state (typing indicator)
  - Auto-scroll a último mensaje
  - Delete chat button con confirmación
- [x] Integrar con `/api/strategy/chat`
- [x] Límite de 40 mensajes (FIFO)

**Acceptance:** Chat sends/receives messages correctly

---

### T15: Prompt Hardening (Security) ⬜
**Priority:** Alta
**Status:** ⬜ PENDING
**Files:**
- Manual testing required

**Tasks:**
- [ ] Test: "¿Cuánto gasté en febrero?" → debe responder "No tengo suficiente información"
- [ ] Test: "¿Cuál es mi cash?" → debe usar dato real de strategyData
- [ ] Test: Prompt injection attempt → debe ignorar
- [ ] Verificar que assistant NUNCA alucine números

**Acceptance:** All security tests pass

---

## FASE 4: Integration & Polish

### T16: Integration en Sidebar y Dashboard ✅
**Priority:** Alta
**Status:** ✅ COMPLETE
**Files:**
- `src/app/dashboard/layout.tsx`
- `src/components/layout/sidebar.tsx`

**Tasks:**
- [x] State `isStrategyOpen` en layout.tsx
- [x] Añadir botón IA Strategy al Sidebar
- [x] Renderizar `StrategyPanel` conditionally cuando `isStrategyOpen`
- [x] Sidebar colapsa a 64px cuando panel abierto
- [x] Mobile support con Sheet

**Acceptance:** Complete flow works in dashboard

---

### T17: API Route /api/strategy/calculate ⬜
**Priority:** Media
**Status:** ⬜ OPTIONAL (client-side calculation preferred)
**Files:**
- `src/app/api/strategy/calculate/route.ts`

**Tasks:**
- [x] POST endpoint creado (para uso futuro)
- [ ] Documentar uso si se requiere server-side

**Acceptance:** Optional - client-side calculation is sufficient

---

### T18: Build & TypeCheck ✅
**Priority:** Alta
**Status:** ✅ COMPLETE

**Tasks:**
- [x] `npm run build` pasa sin errores
- [x] `npm run typecheck` pasa sin errores
- [x] No hay warnings de TypeScript
- [x] ESLint pasa sin errores

**Acceptance:** Build passes completely

---

## Task Summary Table

| T# | Task | Priority | Status |
|----|------|----------|--------|
| T1 | Schema y tipos | H | ✅ |
| T2 | useStrategyData hook | H | ✅ |
| T3 | Cálculos métricas | H | ✅ |
| T4 | StrategySidebarButton | H | ✅ |
| T5 | StrategyPanel layout | H | ✅ |
| T6 | MetricsGrid + MetricCard | H | ✅ |
| T7 | RunwayBadge | M | ✅ |
| T8 | TrendChart | M | ✅ |
| T9 | GoalsList + GoalCard | H | ✅ |
| T10 | GoalForm modal | H | ✅ |
| T11 | StrategySettingsModal | H | ✅ |
| T12 | Prompt hardening | H | ✅ |
| T13 | API /strategy/chat | H | ✅ |
| T14 | StrategyChat component | H | ✅ |
| T15 | Prompt hardening tests | H | ⬜ |
| T16 | Integration sidebar | H | ✅ |
| T17 | API /strategy/calculate | M | ⬜ (optional) |
| T18 | Build & typecheck | H | ✅ |

**Completed: 16/18**
**Pending: 2 (T15 - security tests, T17 - optional)**

---

## Milestones

### M1: MVP (Tasks T1-T4, T12-T14, T18) ✅ COMPLETE
- Tipos, hook, cálculos ✅
- Sidebar button ✅
- API chat con prompt hardening ✅
- Build pasa ✅

### M2: UI Core (Tasks T5-T11) ✅ COMPLETE
- Panel y métricas ✅
- Goals CRUD ✅
- Settings modal ✅

### M3: Polish (Tasks T15-T18) 🔄 IN PROGRESS
- Security tests ⬜ (pending manual testing)
- Integration ✅
- Build final ✅

---

## Files Created

### Components
```
src/components/strategy/
├── StrategySidebarButton.tsx
├── StrategyPanel.tsx
├── MetricsGrid.tsx
├── MetricCard.tsx
├── RunwayBadge.tsx
├── TrendChart.tsx
├── GoalsList.tsx
├── GoalCard.tsx
├── GoalForm.tsx
├── StrategySettingsModal.tsx
├── StrategyChat.tsx
├── StrategyMessage.tsx
└── index.ts
```

### Hooks
```
src/hooks/useStrategyData.ts
```

### Libs
```
src/lib/
├── strategy-types.ts
├── strategy-calculations.ts
└── strategy-prompt.ts
```

### API Routes
```
src/app/api/strategy/
├── chat/route.ts
└── calculate/route.ts
```

### UI
```
src/components/ui/progress.tsx (new)
```

---

## Notes

- Business context info from Felipe: **PENDIENTE** - necesita registrar
- OpenCode API integration: **PENDIENTE (post-MVP)**
- Testing: T15 requiere testing manual con DeepSeek
- All core functionality implemented and build passes
