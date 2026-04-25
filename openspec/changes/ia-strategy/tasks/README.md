# IA Strategy - Task Breakdown (v3 - Final)

## Meta
Reimplementar `/dashboard/ia-strategy` con arquitectura de 3 columnas estrictas:
- Sidebar (64px, colapsado) - un solo sidebar desde dashboard/layout.tsx
- Chat Workspace (centro) - "Asesor Estratégico Gema"
- Data Panel (380px) - MetricsGrid, TrendChart, GoalsList

## Reutilizar lógica existente:
- `StrategyChat` → `ChatWorkspace` (wrapper)
- `MetricsGrid`, `TrendChart`, `GoalsList` → `DataPanel`
- `useStrategyData` → mismo hook

---

## T1: Crear ChatWorkspace.tsx ✅
**Archivo:** `src/components/strategy/ChatWorkspace.tsx`
**Status:** COMPLETADO

**Descripción:**
Componente wrapper que contiene:
- Header: "Asesor Estratégico Gema" con icono Sparkles
- Área de mensajes (usa StrategyChat internamente)
- Input fijo al fondo

**Checklist:**
- [x] Header con título y Sparkles
- [x] EstrategiaChat integrado
- [x] Max-width 3xl centrado
- [x] Scroll vertical en mensajes

---

## T2: Crear DataPanel.tsx ✅
**Archivo:** `src/components/strategy/DataPanel.tsx`
**Status:** COMPLETADO

**Descripción:**
Panel derecho de 380px que contiene:
- MetricsGrid (métricas principales)
- TrendChart (gráfico de 6 meses)
- GoalsList (lista de metas)

**Checklist:**
- [x] Width 380px fijo
- [x] Border-left zinc-800
- [x] Fondo zinc-900/10
- [x] Stack vertical: MetricsGrid → TrendChart → GoalsList
- [x] Scroll independiente

---

## T3: Eliminar ia-strategy/layout.tsx ✅ (ELIMINADO)
**Archivo:** `src/app/dashboard/ia-strategy/layout.tsx`
**Status:** ELIMINADO (causaba Ghost Sidebar Bug)

**Descripción:**
El layout de ia-strategy causaba duplicación del sidebar porque:
- `dashboard/layout.tsx` renderiza un Sidebar
- `ia-strategy/layout.tsx` renderizaba OTRO Sidebar

**Solución:**
- ELIMINADO `ia-strategy/layout.tsx`
- La lógica de sidebar colapsado se maneja en `dashboard/layout.tsx`

**Checklist:**
- [x] Layout eliminado
- [x] No más duplicación de sidebar

---

## T4: Actualizar ia-strategy/page.tsx ✅
**Archivo:** `src/app/dashboard/ia-strategy/page.tsx`
**Status:** COMPLETADO

**Descripción:**
Page que conecta datos con componentes de 2 columnas:
- ChatWorkspace (centro, flex-1)
- DataPanel (derecha, 380px)

**Checklist:**
- [x] useStrategyData hook
- [x] ChatWorkspace con datos
- [x] DataPanel con métricas
- [x] Chat history en localStorage
- [x] Botón limpiar chat

---

## T5: Dashboard layout inteligente ✅
**Archivo:** `src/app/dashboard/layout.tsx`
**Status:** COMPLETADO

**Descripción:**
Layout padre detecta `/dashboard/ia-strategy` y:
- Colapsa sidebar a 64px
- Oculta Header (no necesita header extra)
- Oculta AssistantFAB
- No renderiza más nada - solo el children

**Checklist:**
- [x] Detecta pathname === '/dashboard/ia-strategy'
- [x] Sidebar colapsado a 64px
- [x] Sin Header en ia-strategy
- [x] AssistantFAB oculto
- [x] Un solo sidebar en todo el app

---

## T6: Verificar Ghost Sidebar Bug Fix ✅
**Dependencias:** T5
**Status:** VERIFICADO

**Descripción:**
Verificar que al entrar a `/dashboard/ia-strategy`:
- Sidebar NO se duplica
- Solo hay 1 sidebar de 64px
- No hay "ghost sidebar" expandido

**Checklist:**
- [x] Inspect DOM: solo 1 Sidebar
- [x] Ancho correcto: 64px
- [x] Iconos visibles sin texto
- [x] Arquitectura visual correcta:
  ```
  ┌─────────┬────────────────────────────────┬──────────────┐
  │ Sidebar │     ChatWorkspace              │ DataPanel    │
  │  (64px) │     Asesor Estratégico Gema    │   (380px)    │
  │   UNO   │     [StrategyChat]             │ MetricsGrid │
  └─────────┴────────────────────────────────┴──────────────┘
  ```

---

## T7: Build & TypeCheck ✅
**Status:** PASSED

**Descripción:**
Verificar que todo compila.

**Checklist:**
- [x] `npm run build` pasa
- [x] `npm run typecheck` pasa
- [x] No hay errores de TypeScript

---

## T8: Commit & Push ✅
**Status:** COMPLETADO

```
[develop 1a4c105] fix: resolve ghost sidebar bug in IA Strategy
```

---

## Tareas Pendientes (de SDD anterior)

| Task | Descripción | Status |
|------|-------------|--------|
| T15 | Prompt Hardening (Security tests) | PENDING - requiere manual testing con DeepSeek |

---

## Arquitectura Final

```
┌─────────┬────────────────────────────────┬──────────────┐
│ Sidebar │     ChatWorkspace              │ DataPanel    │
│  (64px) │     "Asesor Estratégico Gema"  │   (380px)    │
│   UNO   │     [StrategyChat]             │ MetricsGrid │
│  solo   │     [input]                    │ TrendChart   │
│         │                                │ GoalsList    │
└─────────┴────────────────────────────────┴──────────────┘
```

---

## Notas

- Build PASSED ✅
- Ghost Sidebar Bug ELIMINADO ✅
- Un solo source of truth para sidebar ✅

- Métricas muestran $0 porque faltan datos de entrada (costos fijos, cash) - NO es bug del layout
- Pendiente: configurar datos de entrada para ver métricas reales