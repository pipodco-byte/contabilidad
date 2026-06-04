# ⏳ Pendientes — Pipod Contabilidad

**Última actualización:** Junio 2026
**Versión:** 4.3
**Fuente de verdad:** Este archivo + `ESTADO_PROYECTO.md`

---

## 🔧 Bugs Críticos Corregidos (Mayo-Junio 2026)

| Item | Descripción | Status |
|------|-------------|--------|
| B5 | Tabla incorrecta `transacciones` → `cont_transacciones` (18 archivos) | ✅ Corregido |
| B6 | Query con userId vacío causa error UUID (datos desaparecen) | ✅ Corregido |
| B7 | Month filter rollover (setMonth → Date constructor) | ✅ Corregido |
| B8 | Supabase session no persistía en browser | ✅ Corregido |
| B9 | Timezone: `new Date("YYYY-MM-DD")` desplazaba mes en UTC-5 | ✅ Corregido |
| B10 | Chat roto: streamText SSE vs cliente esperaba JSON | ✅ Corregido |
| B11 | Model ID inválido `deepseek-v4-flash` | ✅ Corregido |
| B12 | TrendChart vacío: getLastNMonths frágil con timestamps | ✅ Corregido |

---

## 🎯 Funcionalidades Core

| Item | Descripción | Prioridad |
|------|-------------|-----------|
| F3 | Edición inline transacciones | Alta |
| F4 | Batch actions (select + delete) | Alta |

---

## 📊 Gráficos — Fase 2

| Item | Descripción | Prioridad | Condición |
|------|-------------|-----------|-----------|
| G3 | Metas/Hitos de negocio | ✅ | ✅ Completado (`visual-milestones-g3`) |
| G4 | Profit Margin % | Media | Siempre disponible |
| G5 | Burn Rate | Media | ≥3 meses de datos |
| G6 | Runway | Media | ≥3 meses de datos |

---

## 🔧 Limpieza Técnica

| Item | Descripción | Prioridad |
|------|-------------|-----------|
| L1 | Eliminar `src/hooks/useRadarData.ts` | Baja |
| L2 | Verificar botones indigo en todos los lugares | Media |

---

## 🧪 Testing

| Item | Descripción | Prioridad |
|------|-------------|-----------|
| T1 | Tests unitarios hooks | Alta |
| T2 | Tests de integración API | Media |
| T3 | Setup Vitest | Media |

---

## 🤖 AI / Copilot — Futuras Mejoras

| Item | Descripción | Prioridad |
|------|-------------|-----------|
| AF1 | Historial persistente entre dispositivos (Supabase) | Media |
| AF2 | Photo OCR más robusto | Media |
| AF3 | Analytics más avanzados (por categoría, tendencias) | Media |

---

## ⚠️ IA Strategy — Completado v4.3 (Junio 2026)

| Item | Descripción | Status |
|------|-------------|--------|
| Rediseño | ChatGPT-style: layout 65/35, pill input, header minimalista | ✅ |
| Config Panel | saldo_inicial, costos fijos, margen objetivo | ✅ |
| Cash Estimado | Automático: saldo + Σ(ingresos) - Σ(egresos) | ✅ |
| Runway/Break-even | Métricas reales con badges de color | ✅ |
| Chat | DeepSeek-chat via generateText (JSON) | ✅ |
| Timezone Fix | parseFechaStr() en vez de new Date() | ✅ |
| TrendChart | Placeholder, barras sólidas, min altura 15% | ✅ |

---

## 📁 SDDs Archivados

| SDD | Descripción | Archivado |
|-----|-------------|------------|
| `table-name-consistency-fix` | Tabla incorrecta transacciones → cont_transacciones | ✅ 2026-04 |
| `empty-userid-query-fix` | Query con userId vacío | ✅ 2026-04 |
| `ia-strategy-ux-enhancement` | UX + T16 (Real Data) + Voice | ✅ 2026-04 |
| `ia-strategy-visual-storytelling` | Visual Insights + Captain's Log Narrative | ✅ 2026-04-28 |
| `visual-milestones-g3` | Líneas de meta en gráficos (MilestoneLine component) | ✅ 2026-04-28 |
| `chart-polish-hybrid` | Framer Motion fade-in + shadcn Charts + palette rose | ✅ 2026-04-28 |
| `fix-legend-usechart-error` | SimpleLegendContent standalone (sin ChartContainer dependency) | ✅ 2026-04-28 |
| `chart-visual-upgrade` | Primer chart premium: glassmorphism + spring animation + gradientes | ✅ 2026-04-28 |
| `chart-area-premium` | Charts #2 y #4: AreaChart premium con glow + real-time indicator | ✅ 2026-04-28 |
| `chart-remaining-premium` | Charts #3, #5, #6: PieChart donut + LineChart gradient + Tabla con Trending icons | ✅ 2026-04-28 |
| `ia-strategy-minimalist-redesign` | ChatGPT-style redesign | ✅ 2026-06 |
| `ia-strategy-config` | Config panel con cash/runway/break-even reales | ✅ 2026-06 |

## 📁 SDDs En Progreso

_(ninguno)_


---

## 📋 Resumen de Prioridades

### 🔴 Alta
- F3: Edición inline transacciones
- F4: Batch actions

### 🟡 Media
- G4-G6: Gráficos de métricas (Profit Margin, Burn Rate, Runway)
- L2: Verificar botones indigo
- AF1: Historial persistente entre dispositivos (Supabase)

### 🟢 Baja
- L1: Eliminar useRadarData.ts
- T1-T3: Testing

---

## ✅ Regla

Cuando preguntes "qué hay pendiente", **solo lee este archivo**.

Para ver el contexto completo (histórico, arquitectura, SDD), consulta `ESTADO_PROYECTO.md`.

---

_Ultima actualizacion: v4.3 (Junio 2026)_
