# Table Name Consistency Fix - Task Breakdown

## Phase: Apply

---

## Task 1: Fix all hooks

**Archivos:**
- useRadarData.ts
- useStrategyData.ts
- useEvolucionMensual.ts
- useInformeMensual.ts
- useExportarPDF.ts
- useEditarTransaccion.ts
- useInformeAnual.ts
- useGraficas.ts
- useResumen.ts
- useListaTransacciones.ts
- useExportarExcel.ts
- useTransacciones.ts

**Cambio:** `.from('transacciones')` → `.from('cont_transacciones')`

---

## Task 2: Fix all API routes

**Archivos:**
- src/app/api/dashboard/route.ts
- src/app/api/transacciones/route.ts
- src/app/api/gema/import/route.ts

**Cambio:** `.from('transacciones')` → `.from('cont_transacciones')`

---

## Task 3: Verify build

```bash
npm run build
```

---

## Task 4: Test

- [ ] UI /transacciones muestra transacciones
- [ ] Gráficas muestran datos

---

## Files Summary

| Tipo | Cantidad |
|------|----------|
| Hooks | 12 |
| API Routes | 3 |
| Total | 15 archivos |