# 📋 Estado del Proyecto — Pipod Contabilidad

**Última actualización:** Abril 2026
**Versión:** 4.1

---

## ✅ Completado (Histórico)

### UI Boutique
- [x] Theme Obsidian con Indigo/Emerald/Rose
- [x] Header glassmorphism
- [x] KPI cards dark mode
- [x] Filtros emerald sólido
- [x] Export icons con glow
- [x] Empty states zinc-300
- [x] Botón "Enviar a Felipe" indigo gradient

### Dashboard Modular
- [x] Layout con Sidebar + Header
- [x] Sub-routes: transacciones, graficas, informes, config
- [x] Loading states con skeletons
- [x] Links actualizados a rutas

### Errores Corregidos
- [x] E1: Pagination (PaginationFirst/Last)
- [x] E2: Empty state en Graficas
- [x] E3: onApply redundante en filtros
- [x] E4: Logout tooltip sidebar
- [x] B3/B4: Radar hook bugs
- [x] Ghost Sidebar Bug (ia-strategy duplicaba sidebar)
- [x] B5: Tabla `transacciones` → `cont_transacciones` (18 archivos)
- [x] B6: userId vacío causa error UUID en queries

### Gráficos (v2.1)
- [x] G1: Donut Chart (reemplaza Radar)
- [x] G2: Balance Line Chart + Break-Even
- [x] Fix: Intl.NumberFormat precisión

### Funcionalidades Core (v2.2)
- [x] F1: Búsqueda avanzada (transacciones por descripcion, debounced)
- [x] F2: Validación de imports (Zod schema en API Gema)
- [x] F5: Toast notifications (Sonner reemplazó state messages)

### Copilot V2 / Gema Lote (v3.0) — Abril 2026
- [x] G-IA1: FAB bottom-right (no Command Bar - cambió el diseño)
- [x] G-IA2: Integración DeepSeek (cambió de Gemini)
- [x] G-IA3: Parser texto → 9 datos
- [x] G-IA4: Regla Bold (5% auto-egreso)
- [x] G-IA5: Output CSV sin headers (formato compatible Gema)
- [x] G-IA6: Voz → Texto (Web Speech API)
- [x] V2-1: Image upload (screenshot bancarios)
- [x] V2-2: localStorage persistence (40 mensajes)
- [x] V2-3: Delete chat con confirmación
- [x] V2-4: Auto-reset after INSERT
- [x] react-markdown para renderizar formato
- [x] Gema Lote v2: Tool calling con execute handler
- [x] Gema confirmation UI: Muestra BatchCard cuando toolResults existe

### IA Strategy (v4.0) — Abril 2026
- [x] IA-1: Módulo IA Strategy con arquitectura 3 columnas
- [x] IA-2: Chat Workspace (Asesor Estratégico Gema)
- [x] IA-3: Data Panel (380px con MetricsGrid, TrendChart, GoalsList)
- [x] IA-4: useStrategyData hook (cálculos, goals, chat history)
- [x] IA-5: API routes /api/strategy/chat y /api/strategy/calculate
- [x] IA-6: Ghost Sidebar Bug fix (dashboard/layout.tsx inteligente)
- [x] IA-7: Single source of truth para sidebar (64px colapsado)

### IA Strategy Enhancements (v4.1) — Abril 2026
- [x] IA-UX: Markdown con remarkGfm, Textarea auto-grow, Delete modal, Hybrid scroll
- [x] IA-T16: Datos reales vía SQL View `vw_monthly_financial_summary`
- [x] IA-Voice: Botón de voz con diseño Zinc minimalista
- [x] IA-Captain: Tono de "Capitán del navío" en system prompt
- [x] IA-Viz: StrategyMiniChart con 4 series (recharts)

---

## 🔲 En Progreso

_Nothing currently in progress_

---

## ⏳ Pendientes

### Pendientes actuales → Ver `PENDIENTES.md`

---

## 📊 Arquitectura de Hooks Actual

```
src/hooks/
├── useAuth.ts                    ✅
├── useTema.ts                    ✅
├── useTransacciones.ts           ✅
├── usePaginatedTransactions.ts   ✅ (con guard clause userId)
├── useResumen.ts                 ✅
├── useGraficas.ts                ✅ (Bar + Donut)
├── useInformeAnual.ts           ✅ (Area + Balance Line)
├── useInformeMensual.ts          ✅
├── useEvolucionMensual.ts       ✅
├── useExportarExcel.ts           ✅
├── useExportarPDF.ts             ✅
├── useEnviarReporteMensual.ts    ✅
├── useEditarTransaccion.ts       ✅
├── useListaTransacciones.ts      ✅ (con guard clause userId)
├── useAssistantChat.ts          ✅ (Copilot V2)
├── useStrategyData.ts           ✅ (IA Strategy)
└── useRadarData.ts              🗑️ DEPRECADO (para eliminar L1)
```

---

## 📈 Orden de Gráficos (Graficas.tsx)

1. **Bar Chart** — Ingresos vs Egresos por Categoría
2. **Donut Chart** — Distribución de Egresos (NUEVO v2.1)
3. **Area Chart** — Evolución Temporal (fix precisión)
4. **Balance Line** — Balance Neto + Break-Even (NUEVO v2.1)
5. **Tabla** — Comparativa Mensual

---

## 🗑️ Archivos para Eliminar

| Archivo | Razón |
|---------|-------|
| `src/hooks/useRadarData.ts` | Reemplazado por Donut Chart |
| `src/components.old/` | Carpeta deprecated |
| `src/app/dashboard/ia-strategy/layout.tsx` | Eliminado (causaba ghost sidebar) |

---

## 📁 SDD Completo

```
openspec/changes/
├── chart-enhancements/           ✅ COMPLETO
├── button-styling-consistency/   ✅ COMPLETO
├── dashboard-integration/        ✅ COMPLETO
├── sidebar-routes/              ✅ COMPLETO
├── dashboard-modular/           ✅ COMPLETO
├── ui-boutique-refactor/        ✅ COMPLETO
├── boutique-zinc-refactor/     ✅ COMPLETO
├── consolidation/              ✅ COMPLETO
├── radar-fix/                   ✅ COMPLETO
├── import-validation/           ✅ COMPLETO (F2)
├── transaction-search/          ✅ COMPLETO (F1)
├── toast-notifications/         ✅ COMPLETO (F5)
├── gema-ia/                     ✅ COMPLETO (V1)
├── copilot-v2/                  ✅ COMPLETO (V2)
├── ia-strategy/                 ✅ COMPLETO (v4.0)
├── table-name-consistency-fix/   ✅ COMPLETO (B5)
└── empty-userid-query-fix/      ✅ COMPLETO (B6)
```

---

## 🚀 Branch Strategy

| Branch | Status | Last Update |
|--------|--------|-------------|
| `main` | Producción | F1+F2+F5 merged |
| `develop` | Desarrollo | Bugs B5+B6 corregidos ✅ |

---

## 🎨 Design System Reference

**Archivo:** `DESIGN_SYSTEM.md` (raíz del proyecto)

Colores según design system:
- Primary (botones): `from-indigo-500 to-indigo-600`
- Ingresos: Emerald
- Egresos: Rose

---

## 📝 Copilot — Resumen de Features

### V1 (Gema original)
- FAB bottom-right para activar
- Sheet lateral con chat stateful
- Sidebar colapsa a 64px cuando activo
- DeepSeek API
- react-markdown rendering

### V2 (Abril 2026)
- Voice input (Web Speech API)
- Image upload (screenshot bancarios)
- CSV generation (compatible Gema import)
- localStorage persistence (40 mensajes)
- Delete chat con confirmación
- Auto-reset after INSERT

### Gema Lote v2.0 (Tool Calling)
- AI SDK 6+ con `generateText` + `execute` handler
- Tool calling: `handleLoteTransaction` inserta directamente
- Confirmation UI: BatchCard muestra cuando toolResults existe
- Dynamic date en prompts
- Silencio clause para respuestas cortas

### IA Strategy (v4.0 - Separado del Copilot)
- ruta: `/dashboard/ia-strategy`
- Chat-first: Asesor Estratégico Gema
- Data Panel: MetricsGrid + TrendChart + GoalsList
- Sidebar: 64px, un solo sidebar (fix ghost bug)

---

## 🏗️ Arquitectura IA Strategy

```
┌─────────┬────────────────────────────────┬──────────────┐
│ Sidebar │     ChatWorkspace              │ DataPanel    │
│  (64px) │     Asesor Estratégico Gema    │   (380px)    │
│   UNO   │     [StrategyChat]             │ MetricsGrid │
└─────────┴────────────────────────────────┴──────────────┘
```

Componentes nuevos:
- `ChatWorkspace.tsx` - Wrapper del chat central
- `DataPanel.tsx` - Panel derecho (380px)

---

## 🔍 Discoveries Importantes

### Tablas de Supabase
| Tabla | Uso |
|-------|-----|
| `cont_transacciones` | Transacciones financieras (principal) |
| `cont_usuarios` | Usuarios relacionados con transacciones |
| `usuarios` | Tabla de autenticación (auth) |

### UUIDs Importantes
| UUID | Descripción |
|------|-------------|
| `ca85a0bc-2e6e-4887-bf75-930f4dd34880` | Felipe (cont_usuarios) |

### Errores Comunes y Soluciones
| Error | Causa | Solución |
|-------|-------|----------|
| `invalid input syntax for type uuid: ""` | Query con userId vacío | Guard clause `if (!userId \|\| userId.length < 5)` |
| Tabla no existe / datos vacíos | Nombre incorrecto de tabla | Usar `cont_transacciones` |

---

_Ultima actualizacion: Bugs críticos B5 y B6 corregidos (Abril 2026)_