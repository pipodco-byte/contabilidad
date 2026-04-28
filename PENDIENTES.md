# ⏳ Pendientes — Pipod Contabilidad

**Última actualización:** Abril 2026
**Versión:** 4.2
**Fuente de verdad:** Este archivo + `ESTADO_PROYECTO.md`

---

## 🔧 Bugs Críticos Corregidos (Abril 2026)

| Item | Descripción | Status |
|------|-------------|--------|
| B5 | Tabla incorrecta `transacciones` → `cont_transacciones` (18 archivos) | ✅ Corregido |
| B6 | Query con userId vacío causa error UUID (datos desaparecen) | ✅ Corregido |

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

## ⚠️ IA Strategy — Completado

| Item | Descripción | Status |
|------|-------------|--------|
| T16 | Configurar datos de entrada (costos fijos, cash) | ✅ Implementado |
| UX | Markdown, Textarea, Delete Modal, Hybrid Scroll | ✅ Implementado |
| Voice | Zinc minimalist mic button | ✅ Implementado |
| Visual Storytelling | MiniComboChart + Captain's Log Narrative | ✅ Implementado |

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

## 📁 SDDs En Progreso

_(ninguno)_

### Datos del Plan (PLAN_FINANCIERO_PIPOD_2026.md)
- Gastos Fijos: $12,149,400/mes
- Break-even: $40,498,000
- Meta Negocio Sano: $50,000,000 (15% utilidad neta)

---

## 📋 Resumen de Prioridades

### 🔴 Alta
- F3: Edición inline transacciones
- F4: Batch actions
- T16: Configurar datos de entrada IA Strategy

### 🟡 Media
- G3-G6: Gráficos de métricas ( Burn Rate, Runway, etc.)
- T15: Prompt Hardening
- T17: Settings modal
- L2: Verificar botones indigo

### 🟢 Baja
- L1: Eliminar useRadarData.ts
- T1-T3: Testing

---

## ✅ Regla

Cuando preguntes "qué hay pendiente", **solo lee este archivo**.

Para ver el contexto completo (histórico, arquitectura, SDD), consulta `ESTADO_PROYECTO.md`.

---

_Ultima actualizacion: Abril 2026 (v4.2 - Chart Polish + Milestones G3)_