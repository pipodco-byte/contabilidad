# IA Strategy - Specification (v2)

## 1. Overview

**Change Name:** IA Strategy
**Type:** Feature (Redesign)
**Status:** Spec Draft
**Created:** 2026-04-24
**Last Updated:** 2026-04-25

---

## 2. Executive Summary

Reconfigurar el layout de `/dashboard/ia-strategy` para implementar un **Workspace Estratégico de 3 columnas estrictas** con enfoque "Chat-First". El usuario ve sus números a la izquierda mientras conversa con la IA a la derecha.

**Regla fundamental:** El IA del Dashboard es SOLO para entradas de datos. Copilot = transacciones. IA Strategy = análisis estratégico.

---

## 3. Arquitectura de 3 Columnas

```
┌─────────────────────────────────────────────────────────────────────┐
│                     /dashboard/ia-strategy                             │
├────────┬────────────────────────────────────────┬────────────────────┤
│        │                                        │                    │
│ SIDEBAR│         CHAT WORKSPACE                 │    DATA PANEL      │
│ 64px  │         (Centro - Protagonista)        │    (380px)        │
│        │                                        │                    │
│  📊   │  ┌────────────────────────────────┐  │  ┌──────────────┐  │
│  💰   │  │ Asesor Estratégico Gema      │  │  │ MetricsGrid  │  │
│  IA   │  │ [Sparkles icon]               │  │  │ - Burn Rate  │  │
│  📈   │  ├────────────────────────────────┤  │  │ - Runway     │  │
│  📄   │  │                                │  │  │ - Break-even │  │
│  ⚙️   │  │ [Área de mensajes]            │  │  │ - Profit %  │  │
│        │  │                                │  │  └──────────────┘  │
│        │  │                                │  │  ┌──────────────┐  │
│        │  ├────────────────────────────────┤  │  │ TrendChart   │  │
│        │  │ [Input de chat]               │  │  │ (6 meses)   │  │
│        │  └────────────────────────────────┘  │  └──────────────┘  │
│        │                                        │  ┌──────────────┐  │
│        │                                        │  │ GoalsList    │  │
│        │                                        │  │ - metas      │  │
│        │                                        │  └──────────────┘  │
└────────┴────────────────────────────────────────┴────────────────────┘
```

---

## 4. Componentes y Especificaciones

### 4.1 Sidebar (Columna 1)

| Atributo | Valor |
|-----------|-------|
| Ancho | 64px (fijo, no cambia) |
| Estado | Colapsado permanentemente |
| Contenido | Solo iconos (sin texto) |
| Iconos visibles | Dashboard, Transacciones, IA Strategy (activo), Gráficas, Informes, Configuración |
| Navegación | Click en cualquier item navega a su ruta |

### 4.2 Chat Workspace (Columna 2 - Centro)

| Atributo | Valor |
|-----------|-------|
| Ancho | Flexible (ocupa el resto) |
| Max-width mensajes | max-w-3xl centrado |
| Header | "Asesor Estratégico Gema" con icono Sparkles |
| Área de mensajes | Scroll vertical, burbujas de chat |
| Input | Fijo al fondo, ancho completo |
| Props | strategyData, chatHistory, onAddMessage, onClearChat |

### 4.3 Data Panel (Columna 3 - Derecha)

| Atributo | Valor |
|-----------|-------|
| Ancho | 380px (fijo) |
| Borde | Separador izquierdo zinc-800 |
| Fondo | zinc-900/10 |
| Contenido | MetricsGrid, TrendChart, GoalsList (vertical, compacto) |
| Scroll | Independiente del chat |

---

## 5. Reglas de Navegación

| Acción | Resultado |
|--------|----------|
| Click en "IA Strategy" sidebar | Navega a `/dashboard/ia-strategy` |
| Click en "Dashboard" sidebar | Navega a `/dashboard`, sidebar expande |
| Click en "X" del Chat | Navega a `/dashboard` |
| Navegar a otra ruta | IA Strategy se cierra automáticamente |

---

## 6. Componentes a Reutilizar

| Componente | Ubicación | Uso en nuevo diseño |
|------------|-----------|-------------------|
| `StrategyChat` | components/strategy/ | Chat Workspace |
| `MetricsGrid` | components/strategy/ | Data Panel |
| `MetricCard` | components/strategy/ | Data Panel |
| `TrendChart` | components/strategy/ | Data Panel |
| `GoalsList` | components/strategy/ | Data Panel |
| `GoalCard` | components/strategy/ | Data Panel |
| `GoalForm` | components/strategy/ | Data Panel (modal) |
| `useStrategyData` | hooks/ | Ambos (Chat + Data) |

---

## 7. Componentes Nuevos

| Componente | Descripción |
|-----------|-------------|
| `ChatWorkspace` | Contenedor del chat central con header e input |
| `DataPanel` | Contenedor del panel derecho (380px) |

---

## 8. Estética: Boutique Engineering

Tokens de diseño a usar:
- Background: `bg-background`
- Card: `bg-card`
- Border: `border-zinc-800`
- Accent: `accent-primary` (violet)
- Text: `text-foreground`, `text-muted-foreground`

---

## 9. Estados y Edge Cases

| Caso | Manejo |
|------|--------|
| Sin transacciones | Metrics muestran 0 o "N/A" |
| Sin goals | GoalsList muestra empty state |
| Chat vacío | Mensaje placeholder "¿Qué quieres saber?" |
| Error en API chat | Toast error, mensaje en chat |
| Carga de datos | Skeleton en MetricsGrid |

---

## 10. Success Criteria

1. ✅ Sidebar es 64px, iconos solo, sin duplicación
2. ✅ Chat Workspace es el protagonista (centro)
3. ✅ Data Panel es 380px fijo a la derecha
4. ✅ No hay "ghost sidebar" ni anidamiento de sidebars
5. ✅ AssistantFAB oculto en `/dashboard/ia-strategy`
6. ✅ Navegación limpia entre `/dashboard` y `/dashboard/ia-strategy`
7. ✅ Build pasa sin errores
