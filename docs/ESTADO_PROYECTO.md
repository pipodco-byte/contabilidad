# 📋 Estado del Proyecto — Pipod Contabilidad

**Última actualización:** Abril 2025
**Versión:** 2.2

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

---

## 🔲 En Progreso

_Nothing currently in progress_

---

## ⏳ Pendientes

### IA — Gema (Asistente Contable)
| Item | Descripción | Prioridad | Status |
|------|-------------|-----------|--------|
| G-IA1 | Command Bar UI (CMD+K con tab Gema) | Alta | ⏳ Mañana |
| G-IA2 | Integración Gemini 1.5 Flash | Alta | ⏳ Mañana |
| G-IA3 | Parser texto → 9 datos | Alta | ⏳ Mañana |
| G-IA4 | Regla Bold (5% auto-egreso) | Alta | ⏳ Mañana |
| G-IA5 | Output CSV sin headers | Alta | ⏳ Mañana |
| G-IA6 | Voz → Texto (Web Speech API) | Media | V2 |

**Prompt de Gema:**
```
ROL: Gema de Contabilidad — asistente de "Amabilidad Ejecutiva"
REGLAS:
- 9 Datos obligatorios (fecha, desc, categoria, subcat, monto, tipo, medio_pago, estado_iva, comentarios)
- Inferencia inteligente (deduce categoria si falta)
- Doble asiento Bold: si medio="Bold" → genera egreso 5% automático
- Formato COP sin decimales
- Output CSV sin headers (punto y coma)
- Alerta 6:30 PM, bloqueo día siguiente sin cierre
```

### Limpieza Técnica
| Item | Descripción | Prioridad |
|------|-------------|-----------|
| L1 | Eliminar `src/hooks/useRadarData.ts` | Baja |
| L2 | Verificar botones indigo en todos los lugares | Media |

### Gráficos — Fase 2
| Item | Descripción | Prioridad | Condición |
|------|-------------|-----------|-----------|
| G3 | Metas/Hitos de negocio | Media | Pendiente definir |
| G4 | Profit Margin % | Media | Siempre |
| G5 | Burn Rate | Media | ≥3 meses datos |
| G6 | Runway | Media | ≥3 meses datos |

### Funcionalidades Core (Remaining)
| Item | Descripción | Prioridad |
|------|-------------|-----------|
| F3 | Edición inline transacciones | Alta |
| F4 | Batch actions (select + delete) | Alta |

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
├── usePaginatedTransactions.ts   ✅ (+ searchQuery param)
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
├── useGemaAI.ts                   ⏳ PENDIENTE (nuevo)
└── useRadarData.ts               🗑️ DEPRECADO (para eliminar L1)
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
| `src/components/FilterCarousel.tsx` | Reemplazado por FilterSelectors |

---

## 📁 SDD Completo

```
openspec/changes/
├── chart-enhancements/           ✅ COMPLETO
├── button-styling-consistency/   ✅ COMPLETO
├── dashboard-integration/       ✅ COMPLETO
├── sidebar-routes/              ✅ COMPLETO
├── dashboard-modular/           ✅ COMPLETO
├── ui-boutique-refactor/        ✅ COMPLETO
├── boutique-zinc-refactor/      ✅ COMPLETO
├── consolidation/               ✅ COMPLETO
├── radar-fix/                   ✅ COMPLETO
├── import-validation/           ✅ COMPLETO (F2)
├── transaction-search/          ✅ COMPLETO (F1)
├── toast-notifications/         ✅ COMPLETO (F5)
└── gema-ia/                    ⏳ PENDIENTE (para mañana)
```

---

## 🚀 Branch Strategy

| Branch | Status | Last Update |
|--------|--------|-------------|
| `main` | Producción | F1+F2+F5 merged |
| `develop` | Desarrollo | Listo para Gema IA |

---

## 📝 Notas para Mañana

### Gema IA — Primeros Pasos
1. Command Palette existente → agregar tab/comando "Gema"
2. UI: Input texto + botón micrófono
3. Integrar Vercel AI SDK con Gemini 1.5 Flash
4. Definir API route `/api/gema/chat`
5. Implementar parser con el prompt exacto proporcionado

### Prompt Exacto de Felipe (guardado en Gema)
```
ROL: Gema de Contabilidad
PERSONALIDAD: Amabilidad Ejecutiva
REGLAS:
- 9 Datos obligatorios
- Inferencia inteligente
- Bold 5% auto-egreso
- Output CSV sin headers
- Alerta 6:30 PM
```

---

## 🎨 Design System Reference

**Archivo:** `DESIGN_SYSTEM.md` (raíz del proyecto)

Colores según design system:
- Primary (botones): `from-indigo-500 to-indigo-600`
- Ingresos: Emerald
- Egresos: Rose

---

_Ultima actualizacion: Post-merge F1/F2/F5, preparado para Gema IA_
