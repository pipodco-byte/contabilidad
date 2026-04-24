# IA Strategy - Requirements

## 1. Requisitos Funcionales

### 1.1 Sidebar Entry

- [ ] Botón "IA Strategy" en sidebar con icono de robot/estrategia
- [ ] Tooltip en hover mostrando "IA Strategy"
- [ ] Click colapsa sidebar a 64px
- [ ] Click abre StrategyPanel en modo right panel

### 1.2 StrategyPanel (Right Panel)

- [ ] Header con título "Estrategia"
- [ ] Botón de Settings (⚙️) abre StrategySettingsModal
- [ ] Botón X (close) cierra panel y restaura sidebar
- [ ] Layout scrolleable con secciones:
  - Metrics Grid (2x2)
  - Strategy Advisor Chat
  - Goals List
  - Trend Chart (mini)

### 1.3 Metrics Grid

- [ ] Card: Burn Rate con valor en $/mes y badge de tendencia
- [ ] Card: Runway con valor en meses y color badge (🟢🟡🔴)
- [ ] Card: Break-even con valor en $/mes
- [ ] Card: Profit Margin con % y trend (↑/↓)
- [ ]Todas las cards usan design system tokens

### 1.4 Strategy Advisor Chat

- [ ] Chat interface con historial de mensajes
- [ ] Input text para preguntas
- [ ] Botón de enviar (Enter también funciona)
- [ ] Auto-scroll al nuevo mensaje
- [ ] Typing indicator mientras espera respuesta
- [ ] Botón de delete chat con confirmación
- [ ] Auto-reset del chat después de INSERT

### 1.5 Goals CRUD

- [ ] Lista de goals con progress bars
- [ ] GoalCard muestra: título, progreso, %, status badge
- [ ] Botón "+ Añadir Meta" abre GoalForm modal
- [ ] Click en goal abre edición
- [ ] Swipe/button para eliminar (con confirmación)
- [ ] Categories: savings, investment, debt_payment
- [ ] Status: on_track (verde), at_risk (amarillo), completed (check)

### 1.6 Strategy Settings Modal

- [ ] Lista de fixedCosts con label + amount
- [ ] Input para añadir nuevo fixed cost
- [ ] Botón X para eliminar cada fixed cost
- [ ] Input para currentCash
- [ ] Input para targetMargin (%)
- [ ] Botón Cancelar (cierra sin guardar)
- [ ] Botón Guardar (persiste en localStorage)

### 1.7 Goal Form Modal

- [ ] Input: Título de la meta
- [ ] Input: Target amount ($)
- [ ] Input: Current amount ($)
- [ ] Input: Deadline (date, opcional)
- [ ] Select: Category (savings/investment/debt_payment)
- [ ] Validación: título requerido, amounts numéricos
- [ ] Botón Cancelar
- [ ] Botón Guardar

### 1.8 Metrics Calculation

- [ ] Cálculo automático desde transacciones (burnRate, margins)
- [ ] Uso de fixedCosts manual para breakEven, runway
- [ ] Cálculo de marginTrend (vs mes anterior)
- [ ] Cálculo de safetyBuffer
- [ ] Generación de historicalMargins (6 meses)

---

## 2. Requisitos Técnicos

### 2.1 API Routes

- [ ] `POST /api/strategy/chat` - Strategy Advisor con DeepSeek
- [ ] `POST /api/strategy/calculate` - Cálculo de métricas

### 2.2 localStorage

- [ ] Key: `pipod_strategy`
- [ ] Guardado automático en cambios
- [ ] Carga al inicializar la app
- [ ] Migración de schema si cambia versión

### 2.3 Prompt Hardening

- [ ] Prompt prohibido de inventar datos
- [ ] Prompt usa SOLO datos del strategyData
- [ ] Fallback: "No tengo suficiente información"
- [ ] Reglas de runway badges incluidas en prompt

### 2.4 Componentes

| Componente | Archivo |
|------------|---------|
| StrategySidebarButton | `StrategySidebarButton.tsx` |
| StrategyPanel | `StrategyPanel.tsx` |
| MetricsGrid | `MetricsGrid.tsx` |
| MetricCard | `MetricCard.tsx` |
| StrategyChat | `StrategyChat.tsx` |
| GoalsList | `GoalsList.tsx` |
| GoalCard | `GoalCard.tsx` |
| GoalForm | `GoalForm.tsx` |
| StrategySettingsModal | `StrategySettingsModal.tsx` |
| TrendChart | `TrendChart.tsx` |

---

## 3. Requisitos de UX

- [ ] Sidebar colapsa a 64px al abrir Strategy
- [ ] Panel derecho con animación slide (300ms)
- [ ] Cards con hover effect (scale 1.02)
- [ ] Inputs con focus ring violet
- [ ] Toast notifications para acciones (save, delete)
- [ ] Loading states con skeleton/spinner
- [ ] Empty states con mensajes útiles
- [ ] Responsive: funciona en tablet y desktop

---

## 4. Edge Cases

| Caso | Manejo |
|------|--------|
| No hay transacciones | Mostrar "Datos insuficientes" en métricas |
| currentCash = 0 | Runway = 0, mostrar warning |
| burnRate = 0 | No calcular runway, mostrar N/A |
| Goals vacíos | Mostrar empty state con CTA |
| Chat muy largo | Truncar a 40 mensajes (FIFO) |
| API error | Mostrar error en chat, retry button |
| localStorage lleno | Graceful degradation, warning |

---

## 5. Acceptance Criteria

1. ✅ Usuario puede abrir IA Strategy desde sidebar
2. ✅ Métricas se calculan correctamente con datos híbridos
3. ✅ Strategy Advisor responde preguntas estratégicas
4. ✅ Advisor NO alucina datos (prompt hardening)
5. ✅ Goals se pueden crear, editar, eliminar
6. ✅ Settings permite configurar fixedCosts y cash
7. ✅ Runway badge muestra color correcto según umbral
8. ✅ Chat persiste en localStorage
9. ✅ Build pasa sin errores
10. ✅ Diseño consistente con Copilot (Boutique Engineering)
