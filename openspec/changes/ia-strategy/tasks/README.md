# IA Strategy - Task Breakdown (v2)

## Meta
Reimplementar `/dashboard/ia-strategy` con arquitectura de 3 columnas: Sidebar(64px) + ChatWorkspace + DataPanel(380px)

## Reutilizar lógica existente:
- `StrategyChat` → `ChatWorkspace` (wrapper)
- `MetricsGrid`, `TrendChart`, `GoalsList` → `DataPanel`
- `useStrategyData` → mismo hook

---

## T1: Crear ChatWorkspace.tsx
**Archivo:** `src/components/strategy/ChatWorkspace.tsx`
**Dependencias:** Ninguna

**Descripción:**
Componente wrapper que contiene:
- Header: "Asesor Estratégico Gema" con icono Sparkles
- Área de mensajes (usa StrategyChat internamente)
- Input fijo al fondo

**Props:**
```typescript
interface ChatWorkspaceProps {
  strategyData: StrategyData;
  chatHistory: StrategyChatMessage[];
  onAddMessage: (msg: StrategyChatMessage) => void;
  onClearChat: () => void;
}
```

**Checklist:**
- [ ] Header con título y Sparkles
- [ ] EstrategiaChat integrado
- [ ] Max-width 3xl centrado
- [ ] Scroll vertical en mensajes

---

## T2: Crear DataPanel.tsx
**Archivo:** `src/components/strategy/DataPanel.tsx`
**Dependencias:** MetricsGrid, TrendChart, GoalsList

**Descripción:**
Panel derecho de 380px que contiene:
- MetricsGrid (métricas principales)
- TrendChart (gráfico de 6 meses)
- GoalsList (lista de metas)

**Props:**
```typescript
interface DataPanelProps {
  metrics: CalculatedMetrics;
  goals: Goal[];
  historicalMargins: Array<{month: string; margin: number}>;
}
```

**Checklist:**
- [ ] Width 380px fijo
- [ ] Border-left zinc-800
- [ ] Fondo zinc-900/10
- [ ] Stack vertical: MetricsGrid → TrendChart → GoalsList
- [ ] Scroll independiente

---

## T3: Reescribir ia-strategy/layout.tsx
**Archivo:** `src/app/dashboard/ia-strategy/layout.tsx`
**Dependencias:** Sidebar, ChatWorkspace, DataPanel

**Descripción:**
Layout de 3 columnas SIN sidebar duplicado.

**Estructura:**
```
layout.tsx
├── Sidebar (64px, collapsed)
├── ChatWorkspace (flex-1)
└── DataPanel (380px)
```

**Checklist:**
- [ ] Un solo Sidebar (no duplicar)
- [ ] 3 columnas estrictas
- [ ] Sin StrategyPanel anidado
- [ ] AssistantFAB oculto

---

## T4: Actualizar ia-strategy/page.tsx
**Archivo:** `src/app/dashboard/ia-strategy/page.tsx`
**Dependencias:** useStrategyData, ChatWorkspace, DataPanel

**Descripción:**
Page que conecta datos con componentes.

**Checklist:**
- [ ] useStrategyData hook
- [ ] ChatWorkspace con datos
- [ ] DataPanel con métricas
- [ ] Chat history en localStorage
- [ ] Botón limpiar chat

---

## T5: Eliminar/Archivar StrategyPanel.tsx
**Archivo:** `src/components/strategy/StrategyPanel.tsx`
**Dependencias:** Ninguna

**Descripción:**
El viejo StrategyPanel se reemplaza por ChatWorkspace + DataPanel.

**Acción:**
- Mover a `strategy/legacy/StrategyPanel.tsx` O
- Eliminar si no se necesita backward compatibility

---

## T6: Verificar Ghost Sidebar Bug Fix
**Dependencias:** T3

**Descripción:**
Verificar que al entrar a `/dashboard/ia-strategy`:
- Sidebar NO se duplica
- Solo hay 1 sidebar de 64px
- No hay "ghost sidebar" expandido

**Checklist:**
- [ ] Inspect DOM: solo 1 Sidebar
- [ ] Ancho correcto: 64px
- [ ] Iconos visibles sin texto

---

## T7: Build & TypeCheck
**Dependencias:** T1-T6

**Descripción:**
Verificar que todo compila.

**Checklist:**
- [ ] `npm run build` pasa
- [ ] `npm run typecheck` pasa
- [ ] No hay errores de TypeScript

---

## Orden de ejecución

```
T1 (ChatWorkspace) → T2 (DataPanel) → T3 (layout) → T4 (page) → T5 (cleanup) → T6 (verify fix) → T7 (build)
```

---

## Notas

- T15 (Prompt Hardening security tests) queda pendiente de previous SDD
- Build debe pasar antes de marcar como completo