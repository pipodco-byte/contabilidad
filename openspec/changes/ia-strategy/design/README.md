# IA Strategy - Technical Design (v3)

## Arquitectura Final (Fix Ghost Sidebar)

### Antes (PROBLEMÁTICO):
```
dashboard/layout.tsx     → Renderiza Sidebar #1 (expandido)
└── dashboard/ia-strategy/layout.tsx  → Renderiza Sidebar #2 (colapsado)
```
**Resultado:** Dos sidebars visibles.

### Después (CORRECTO):
```
dashboard/layout.tsx     → Detecta /dashboard/ia-strategy → Sidebar #1 colapsado (64px)
└── dashboard/ia-strategy/page.tsx  → ChatWorkspace + DataPanel
```
**Resultado:** Un solo sidebar.

---

## 1. Estructura de Archivos

### Layouts
- `dashboard/layout.tsx` - Layout padre inteligente (detecta ia-strategy, colapsa sidebar)
- `dashboard/ia-strategy/page.tsx` - Page con 2 columnas (Chat + DataPanel)
- ~~`dashboard/ia-strategy/layout.tsx`~~ - **ELIMINADO** (causaba duplicación)

### Componentes
- `components/strategy/ChatWorkspace.tsx` - Wrapper del chat central
- `components/strategy/DataPanel.tsx` - Panel derecho (380px)
- `components/strategy/StrategyChat.tsx` - Componente de chat (reusado)
- `components/strategy/MetricsGrid.tsx` - Métricas (reusado)
- `components/strategy/TrendChart.tsx` - Gráfico (reusado)
- `components/strategy/GoalsList.tsx` - Lista de metas (reusado)

---

## 2. Layout Inteligente (dashboard/layout.tsx)

```typescript
const isIAStrategy = pathname === '/dashboard/ia-strategy'

if (isIAStrategy) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={true} />
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>
      <Toaster richColors />
    </div>
  )
}
```

---

## 3. Page de 2 Columnas (dashboard/ia-strategy/page.tsx)

```typescript
<div className="flex h-full w-full">
  <div className="flex-1 border-r border-zinc-800/50 flex flex-col">
    <ChatWorkspace />
  </div>
  <DataPanel />
</div>
```

---

## 4. Arquitectura Visual

```
┌─────────┬────────────────────────────────┬──────────────┐
│ Sidebar │     ChatWorkspace              │ DataPanel    │
│  (64px) │     "Asesor Estratégico Gema"  │   (380px)    │
│         │     [StrategyChat]             │ MetricsGrid │
│  Un     │     [input de chat]            │ TrendChart   │
│  solo   │                                │ GoalsList    │
│ sidebar │                                │              │
└─────────┴────────────────────────────────┴──────────────┘
```

---

## 5. Diferencias con Diseño Anterior

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Sidebars | Duplicados (2) | Uno solo (64px) |
| Layout | ia-strategy/layout.tsx | page.tsx |
| Header | Incluido en layout | Externo al layout padre |
| AssistantFAB | Se mostraba | Oculto en ia-strategy |

---

## 6. Props Flow

```
useStrategyData()
    │
    ├──► ChatWorkspace
    │        └──► StrategyChat (props: strategyData, chatHistory, onAddMessage, onClearChat)
    │
    └──► DataPanel
             └──► Props: metrics, goals, historicalMargins
```

---

## 7. Estados y Edge Cases

| Caso | Manejo |
|------|--------|
| Sin transacciones | Metrics muestra 0 (esperado, faltan datos) |
| Sin goals | GoalsList muestra empty state |
| Chat vacío | Mensaje placeholder "¿Qué quieres saber?" |
| Navegación ia-strategy → dashboard | Header visible, sidebar expandido |
| Navegación dashboard → ia-strategy | Sidebar colapsa a 64px |

---

## 8. Build Status

✅ Build PASSED

---

## 9. Pendiente

- T15: Prompt Hardening (Security tests) - requiere testing manual con DeepSeek
- Verificar datos de entrada (costos fijos, cash) para métricas correctas