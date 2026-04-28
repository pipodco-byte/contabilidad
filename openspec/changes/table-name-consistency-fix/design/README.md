# Table Name Consistency Fix - Technical Design

## 1. Change Pattern

```typescript
// Buscar:
.from('transacciones')

// Reemplazar por:
.from('cont_transacciones')
```

---

## 2. Files to Modify

### Hooks (12 archivos)
1. `src/hooks/useRadarData.ts` - línea 28
2. `src/hooks/useStrategyData.ts` - línea 94
3. `src/hooks/useEvolucionMensual.ts` - línea 21
4. `src/hooks/useInformeMensual.ts` - línea 19
5. `src/hooks/useExportarPDF.ts` - línea 8
6. `src/hooks/useEditarTransaccion.ts` - línea 27
7. `src/hooks/useInformeAnual.ts` - línea 19
8. `src/hooks/useGraficas.ts` - línea 18
9. `src/hooks/useResumen.ts` - línea 22
10. `src/hooks/useListaTransacciones.ts` - líneas 27, 48
11. `src/hooks/useExportarExcel.ts` - línea 8
12. `src/hooks/useTransacciones.ts` - línea 27

### API Routes (3 archivos)
13. `src/app/api/dashboard/route.ts` - línea 19
14. `src/app/api/transacciones/route.ts` - líneas 21, 49, 65
15. `src/app/api/gema/import/route.ts` - línea 45

---

## 3. Testing Checklist

- [ ] npm run build pasa
- [ ] UI /transacciones muestra transacciones
- [ ] Gráficas muestran datos
- [ ] Reportes funcionan
- [ ] Exportar Excel/PDF funciona