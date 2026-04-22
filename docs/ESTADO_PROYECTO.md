# 📋 Estado del Proyecto — Pipod Contabilidad

**Última actualización:** Abril 2025
**Versión:** 2.1

---

## ✅ Completado (Histórico)

### UI Boutique
- [x] Theme Obsidian con Violet/Emerald/Rose
- [x] Header glassmorphism
- [x] KPI cards dark mode
- [x] Filtros emerald sólido
- [x] Export icons con glow
- [x] Empty states zinc-300
- [x] Botón "Enviar a Felipe" violet gradient

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

---

## 🔲 En Progreso

_Nothing currently in progress_

---

## ⏳ Pendientes

### Limpieza Técnica
| Item | Descripción | Prioridad |
|------|-------------|-----------|
| L1 | Eliminar `src/hooks/useRadarData.ts` | Baja |

### Gráficos — Fase 2
| Item | Descripción | Prioridad | Condición |
|------|-------------|-----------|-----------|
| G3 | Metas/Hitos de negocio | Media | Pendiente definir |
| G4 | Profit Margin % | Media | Siempre |
| G5 | Burn Rate | Media | ≥3 meses datos |
| G6 | Runway | Media | ≥3 meses datos |

### Funcionalidades Core
| Item | Descripción | Prioridad |
|------|-------------|-----------|
| F1 | Búsqueda avanzada | Alta |
| F2 | Validación de imports | Alta |
| F3 | Edición inline transacciones | Alta |
| F4 | Batch actions | Alta |
| F5 | Toast notifications | Media |

### Testing
| Item | Descripción | Prioridad |
|------|-------------|-----------|
| T1 | Tests unitarios hooks | Alta |
| T2 | Tests de integración API | Media |
| T3 | Setup Vitest | Media |

---

## 📊 Arquitectura de Hooks Actual

```
src/hooks/
├── useAuth.ts                    ✅
├── useTema.ts                    ✅
├── useTransacciones.ts           ✅
├── usePaginatedTransactions.ts    ✅
├── useResumen.ts                  ✅
├── useGraficas.ts                 ✅ (Bar + Donut)
├── useInformeAnual.ts             ✅ (Area + Balance Line)
├── useInformeMensual.ts           ✅
├── useEvolucionMensual.ts        ✅ (fix precisión)
├── useExportarExcel.ts            ✅
├── useExportarPDF.ts              ✅
├── useEnviarReporteMensual.ts     ✅
├── useEditarTransaccion.ts        ✅
├── useListaTransacciones.ts       ✅
└── useRadarData.ts               ⚠️ DEPRECADO (no usado)
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

---

## 📁 SDD Activo

```
openspec/changes/
├── chart-enhancements/           ✅ COMPLETO
│   ├── PROPOSAL.md
│   ├── SPEC.md
│   ├── DESIGN.md
│   └── TASKS.md
├── consolidation/
├── radar-fix/
├── dashboard-modular/
├── ui-boutique-refactor/
└── boutique-zinc-refactor/
```

---

## 🚀 Branch Strategy

| Branch | Propósito |
|--------|-----------|
| `main` | Producción |
| `develop` | Desarrollo |

---

_Este archivo se actualiza manualmente después de cada feature._
