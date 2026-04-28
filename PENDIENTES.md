# ⏳ Pendientes — Pipod Contabilidad

**Última actualización:** Abril 2026
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
| G3 | Metas/Hitos de negocio | Media | Pendiente definir con Felipe |
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

## 📁 SDDs Creados (Sin Aplicar)

| SDD | Descripción | Path |
|-----|-------------|------|
| `ia-strategy-ux-enhancement` | UX (Markdown, Textarea) + T16 (Real Data) + Voice | `openspec/changes/ia-strategy-ux-enhancement/` |

### SDD: ia-strategy-ux-enhancement

**Visión:** Transformar IA Strategy de simulador manual a Asesor de Negocios de Alta Precisión.

#### Fase 1: Quick Wins UX (Bajo Esfuerzo)
- Markdown rendering con `remarkGfm`
- Textarea auto-grow (Enter=enviar, Shift+Enter=nueva línea)
- Delete confirm modal con backdrop blur
- Hybrid scrolling (instant first load, smooth después)

#### Fase 2: T16 - Real Data
- `strategy-constants.ts` con gastos fijos desde `.env`
- View SQL `vw_monthly_financial_summary`
- Integrar datos reales en prompt de Strategy
- **Fórmula:** `Utilidad Neta = Ventas - Egresos - $12.1M`

#### Fase 3: Voice
- Integrar `AssistantMicButton` en StrategyChat

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

_Ultima actualizacion: Abril 2026_