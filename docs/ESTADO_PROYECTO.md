# 📋 Estado del Proyecto — Pipod Contabilidad

**Última actualización:** Junio 2026
**Versión:** 4.3

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

### Chart Polish Híbrido (v4.2) — Abril 2026
- [x] Framer Motion fade-in + scale en cada card de gráfico (stagger 0.1s)
- [x] shadcn ChartLegendContent integrado para leyendas estilizadas
- [x] Palette rose para PieChart: `['#fb7185', '#f43f5e', ...]`
- [x] Tooltips mejorados con CSS variables del tema
- [x] Accesibilidad preservada (role="img", aria-labelledby)
- [x] shadcn chart.tsx wrapper integrado

### Visual Milestones G3 — Abril 2026
- [x] MilestoneLine component para líneas de meta en gráficos
- [x] Tipos: fixed, breakEven, meta
- [x] Integración con AreaChart y LineChart de evolución temporal

### Fix Legend useChart Error — Abril 2026
- [x] SimpleLegendContent component (standalone sin ChartContext dependency)
- [x] Iconos SVG inline (trending up/down) para look boutique
- [x] Actualizado Graficas.tsx: 5 legend usages reemplazadas
- [x] Build pasa sin errores de useChart

### Chart Visual Upgrade — Abril 2026
- [x] Primer chart premium: glassmorphism card con backdrop-blur-xl
- [x] Spring animation (stiffness: 260, damping: 20)
- [x] Gradientes en barras (emerald/rose con opacity fade)
- [x] Ejes minimalistas (axisLine:false, tickLine:false)
- [x] Header con jerarquía tipográfica (label uppercase + title)

### Chart Area Premium — Abril 2026
- [x] Chart #2: AreaChart premium con glow emerald (top-right)
- [x] Chart #2: Real-time indicator + "Time Analysis" label
- [x] Chart #2: MilestoneLines con opacity reducido
- [x] Chart #4: AreaChart premium con glow rose (bottom-left)
- [x] Chart #4: Badge "Año Fiscal 2026" + "Performance Snapshot"

### Chart Remaining Premium — Abril 2026
- [x] Chart #3: PieChart donut con cornerRadius:6, innerRadius:105, glow indigo
- [x] Chart #5: LineChart con gradient stroke green→red, activeDot shadow-2xl
- [x] Chart #6: Tabla con TrendingUp/Down icons, delta badges, balance row highlight

### IA Strategy Redesign + Config (v4.3) — Mayo-Junio 2026
- [x] IA-R1: Rediseño minimalista ChatGPT-style: layout asimétrico 65/35, header centrado
- [x] IA-R2: Pill input con botón circular de enviar, mensajes aireados (space-y-6)
- [x] IA-R3: DataPanel más suave (bg-muted/5, sin border-l), eliminado StrategyMiniChart
- [x] IA-R4: Dead space fix (flex-1 + flex-shrink-0 wrapper)
- [x] IA-R5: Month filter rollover bug corregido (setMonth → Date constructor)

### Auth & Data Flow Fixes — Mayo 2026
- [x] AF-1: Supabase session persistence en browser (setSession via localStorage)
- [x] AF-2: useStrategyData usa cont_usuario_id (user_metadata) en vez de auth UUID
- [x] AF-3: Login API devuelve access_token + refresh_token para setSession()

### IA Strategy Config Panel — Mayo-Junio 2026
- [x] IA-C1: Panel de configuración colapsable (StrategyConfig component)
- [x] IA-C2: Cash estimado automático: saldo_inicial + Σ(ingresos) - Σ(egresos)
- [x] IA-C3: 16 costos fijos precargados desde REPORTE PRESUPUESTO PIPOD (~$18M)
- [x] IA-C4: Tabla Supabase cont_configuracion creada (RLS deshabilitado)
- [x] IA-C5: API /api/config GET/PUT con Supabase auth
- [x] IA-C6: RefreshConfig después de guardar (métricas recalculan)
- [x] IA-C7: Runway y Break-even muestran valores reales
- [x] IA-C8: Runway badge thresholds: 🟢>12 / 🟡6-12 / 🟠3-6 / 🔴<3

### Bug Fixes Críticos — Junio 2026
- [x] BF-1: Timezone bug — `new Date("YYYY-MM-DD")` parsea como UTC, desplaza mes en -5
- [x] BF-2: TrendChart vacío — getLastNMonths usaba Date frágil; ahora parseFechaStr
- [x] BF-3: Chat roto — streamText devolvía SSE pero cliente esperaba JSON
- [x] BF-4: Model ID inválido `deepseek-v4-flash` → cambiado a `deepseek-chat`
- [x] BF-5: Selector de mes mostraba "Mayo" en vez de "Junio" (off-by-one timezone)
- [x] BF-6: TrendChart placeholder con >=50% zeros, barras sólidas, min altura 15%

### Tooling — Junio 2026
- [x] TO-1: dotenv devDependency agregada
- [x] TO-2: Release-please config (.github/workflows/release-please.yml)

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
├── empty-userid-query-fix/      ✅ COMPLETO (B6)
├── ia-strategy-ux-enhancement/  ✅ COMPLETO (v4.1)
├── ia-strategy-visual-storytelling/ ✅ COMPLETO (v4.1)
├── visual-milestones-g3/         ✅ COMPLETO (v4.2)
├── chart-polish-hybrid/         ✅ COMPLETO (v4.2)
├── fix-legend-usechart-error/   ✅ COMPLETO (bug fix)
├── chart-visual-upgrade/        ✅ COMPLETO (BarChart premium)
├── chart-area-premium/         ✅ COMPLETO (AreaCharts premium)
├── chart-remaining-premium/   ✅ COMPLETO (PieChart + LineChart + Tabla premium)
├── ia-strategy-minimalist-redesign/ ✅ COMPLETO (v4.3, ChatGPT-style)
└── ia-strategy-config/         ✅ COMPLETO (v4.3, cash/runway config)
```

---

## 🚀 Branch Strategy

| Branch | Status | Last Update |
|--------|--------|-------------|
| `main` | Producción | v4.3 — Junio 2026 |
| `develop` | Desarrollo | v4.3 en curso |

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

Componentes nuevos (v4.3):
- `ChatWorkspace.tsx` - Wrapper del chat central
- `DataPanel.tsx` - Panel derecho (380px, collapsible config)
- `StrategyConfig.tsx` - Config panel (saldo, costos, margen)
- `TrendChart.tsx` - Gráfico de tendencia mensual

---

## 🔍 Discoveries Importantes

### Tablas de Supabase
| Tabla | Uso |
|-------|-----|
| `cont_transacciones` | Transacciones financieras (principal) |
| `cont_usuarios` | Usuarios relacionados con transacciones |
| `cont_configuracion` | Config IA Strategy (saldo, costos, margen) |
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
| `new Date("YYYY-MM-DD")` mes incorrecto | Parseo UTC → local desplaza fecha | `parseFechaStr()` o `new Date(year, month-1, 1)` |
| Error 42501 (RLS violation) | RLS habilitado en tabla sin política | Deshabilitar RLS o crear políticas |
| Chat devuelve "hubo un error" | Model ID inválido o cliente espera JSON vs SSE | Usar `deepseek-chat` + `generateText` + JSON |

---

_Ultima actualizacion: v4.3 — Bug fixes timezone, chat, trendchart + Config Panel IA Strategy (Junio 2026)_