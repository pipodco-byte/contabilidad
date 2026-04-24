# 📋 Estado del Proyecto — Pipod Contabilidad

**Última actualización:** Abril 2026
**Versión:** 3.0

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

### Gráficos (v2.1)
- [x] G1: Donut Chart (reemplaza Radar)
- [x] G2: Balance Line Chart + Break-Even
- [x] Fix: Intl.NumberFormat precisión

### Funcionalidades Core (v2.2)
- [x] F1: Búsqueda avanzada (transacciones por descripcion, debounced)
- [x] F2: Validación de imports (Zod schema en API Gema)
- [x] F5: Toast notifications (Sonner reemplazó state messages)

### Copilot V2 (v3.0) — Abril 2026
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

---

## 🔲 En Progreso

_Nothing currently in progress_

---

## ⏳ Pendientes

### Funcionalidades Core
| Item | Descripción | Prioridad |
|------|-------------|-----------|
| F3 | Edición inline transacciones | Alta |
| F4 | Batch actions (select + delete) | Alta |

### Gráficos — Fase 2
| Item | Descripción | Prioridad | Condición |
|------|-------------|-----------|-----------|
| G3 | Metas/Hitos de negocio | Media | Pendiente definir |
| G4 | Profit Margin % | Media | Siempre |
| G5 | Burn Rate | Media | ≥3 meses datos |
| G6 | Runway | Media | ≥3 meses datos |

### Limpieza Técnica
| Item | Descripción | Prioridad |
|------|-------------|-----------|
| L1 | Eliminar `src/hooks/useRadarData.ts` | Baja |
| L2 | Verificar botones indigo en todos los lugares | Media |

### Testing
| Item | Descripción | Prioridad |
|------|-------------|-----------|
| T1 | Tests unitarios hooks | Alta |
| T2 | Tests de integración API | Media |
| T3 | Setup Vitest | Media |

### AI / Copilot — Futuras Mejoras
| Item | Descripción | Prioridad |
|------|-------------|-----------|
| AF1 | Historial persistente entre dispositivos (Supabase) | Media |
| AF2 | Photo OCR más robusto | Media |
| AF3 | Analytics más avanzados (por categoría, tendencias) | Media |

---

## 📊 Arquitectura de Hooks Actual

```
src/hooks/
├── useAuth.ts                    ✅
├── useTema.ts                    ✅
├── useTransacciones.ts           ✅
├── usePaginatedTransactions.ts   ✅
├── useResumen.ts                 ✅
├── useGraficas.ts                ✅ (Bar + Donut)
├── useInformeAnual.ts           ✅ (Area + Balance Line)
├── useInformeMensual.ts          ✅
├── useEvolucionMensual.ts       ✅
├── useExportarExcel.ts           ✅
├── useExportarPDF.ts             ✅
├── useEnviarReporteMensual.ts    ✅
├── useEditarTransaccion.ts       ✅
├── useListaTransacciones.ts      ✅
├── useAssistantChat.ts          ✅ (Copilot V2)
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
└── copilot-v2/                  ✅ COMPLETO (V2)
```

---

## 🚀 Branch Strategy

| Branch | Status | Last Update |
|--------|--------|-------------|
| `main` | Producción | F1+F2+F5 merged |
| `develop` | Desarrollo | Copilot V2 completo, pendiente push |

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

### V2 ( Abril 2026)
- Voice input (Web Speech API)
- Image upload (screenshot bancarios)
- CSV generation (compatible Gema import)
- localStorage persistence (40 mensajes)
- Delete chat con confirmación
- Auto-reset after INSERT

---

_Ultima actualizacion: Copilot V2 completo, listo para push_