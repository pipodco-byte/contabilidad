# Table Name Consistency Fix - Specification

## 1. Overview

**Change Name:** Table Name Consistency Fix
**Type:** Bug Fix (Critical)
**Status:** Spec Draft
**Created:** 2026-04-28

---

## 2. Executive Summary

La tabla correcta es `cont_transacciones`, pero 18 ubicaciones en el código usan `transacciones`. Esto causa que todas las queries y operaciones fallen silenciosamente o retornen datos vacíos.

---

## 3. Problem Description

### Causa
Todas las operaciones de Gema inserta en `cont_transacciones` (correcto), pero el resto del codebase consulta `transacciones` (incorrecto - tabla no existe o vacía).

### Impacto
- UI /transacciones no muestra transacciones
- Gráficas no muestran datos
- Reportes están vacíos
- Exportar Excel/PDF no funciona

### Archivos Afectados

| Archivo | Líneas | Tipo |
|---------|--------|------|
| `useRadarData.ts` | 28 | Hook |
| `useStrategyData.ts` | 94 | Hook |
| `useEvolucionMensual.ts` | 21 | Hook |
| `useInformeMensual.ts` | 19 | Hook |
| `useExportarPDF.ts` | 8 | Hook |
| `useEditarTransaccion.ts` | 27 | Hook |
| `useInformeAnual.ts` | 19 | Hook |
| `useGraficas.ts` | 18 | Hook |
| `useResumen.ts` | 22 | Hook |
| `useListaTransacciones.ts` | 27, 48 | Hook |
| `useExportarExcel.ts` | 8 | Hook |
| `useTransacciones.ts` | 27 | Hook |
| `usePaginatedTransactions.ts` | 36 | Hook (ya fixed) |
| `src/app/api/dashboard/route.ts` | 19 | API |
| `src/app/api/transacciones/route.ts` | 21, 49, 65 | API |
| `src/app/api/gema/import/route.ts` | 45 | API |

---

## 4. Solution

### Cambio Global
```typescript
// ANTES:
.from('transacciones')

// DESPUÉS:
.from('cont_transacciones')
```

---

## 5. Scope

### Archivos a modificar:
- 15 archivos en `src/hooks/` y `src/app/api/`

### No modificar:
- `src/app/api/auth/login/route.ts` - Usa tabla `usuarios` (correcto)
- `src/app/api/assistant/chat/route.ts` - Ya correcto
- `src/components/` - No tiene queries directos

---

## 6. Success Criteria

1. ✅ Build pasa sin errores
2. ✅ Todas las queries usan `cont_transacciones`
3. ✅ UI /transacciones muestra datos
4. ✅ Gráficas y reportes funcionan