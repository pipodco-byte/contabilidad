# Gema Lote v2.0 - Task Breakdown

## Phase: Apply

---

## Task 1: Agregar Schema de Lote en assistant-tools.ts

**Archivo:** `src/lib/assistant-tools.ts`

**Cambios:**
1. Importar `z` de zod
2. Crear `TransaccionItemSchema` con los 9 campos (monto, descripcion, tipo, fecha, medio_pago, categoria, sub_categoria, estado_iva, comentarios)
3. Crear `LoteTransaccionesSchema` envolviendo un array de TransaccionItemSchema
4. Agregar tool `registrar_lote_transacciones` al export `tools`

**Validación:**
- Copilar sin errores: `npm run build`
- TypeScript sin errores: `npm run typecheck`

---

## Task 2: Actualizar API Route para habilitar Tools

**Archivo:** `src/app/api/assistant/chat/route.ts`

**Cambios:**
1. Importar `tools` desde `@/lib/assistant-tools`
2. En `streamText`, agregar `tools` y `toolChoice: 'auto'`
3. Verificar que el stream funcione correctamente

**Validación:**
- Probar endpoint con curl o Postman
- Ver logs para confirmar tool call se dispara

---

## Task 3: Actualizar System Prompt

**Archivo:** `src/lib/assistant-prompt.ts`

**Cambios:**
1. Agregar sección "INSTRUCCIONES DE LOTE (Gema Lote v2.0)" con las 7 reglas:
   - Siempre usar tool para transacciones
   - Normalización de montos (1.5M → 1500000)
   - Cálculo de fechas relativas
   - Inferencia de categorías
   - Default medio_pago = Efectivo
   - Agrupación en array
   - Manejo de errores en transacciones inválidas

**Validación:**
- Generar un prompt de test y verificar reglas incluidas

---

## Task 4: Crear componente BatchCard.tsx

**Archivo:** `src/components/assistant/BatchCard.tsx` (NUEVO)

**Estados a implementar:**
1. **Collapsed** - Resumen con Badge + total neto + count
2. **Expanded** - Lista completa con hover actions (edit/delete)
3. **Empty** - Actionable Reset con 3 botones
4. **Loading** - Skeleton
5. **Error** - Fila con borde rojo

**Props:**
```typescript
interface BatchCardProps {
  transacciones: TransaccionItem[]
  onConfirm: () => void
  onEdit: (index: number, item: TransaccionItem) => void
  onDelete: (index: number) => void
  onCancel: () => void
  isLoading?: boolean
}
```

**Validación:**
- Renderizar en desarrollo sin errores
- Empty state visible cuando transacciones = []
- Hover actions aparecen en desktop

---

## Task 5: Integrar BatchCard en AssistantSheet

**Archivo:** `src/components/assistant/AssistantSheet.tsx`

**Cambios:**
1. Importar BatchCard
2. Crear estado `pendingLote: TransaccionItem[]`
3. Detectar tool call `registrar_lote_transacciones` → guardar en pendingLote
4. Renderizar BatchCard cuando pendingLote.length > 0
5. Implementar `handleConfirmLote` - iterar y confirmar cada transacción
6. Implementar `handleCancelLote` - mostrar empty state + Gema apology message

**Gema Apology Message:**
```
Entendido, Felipe. El lote ha sido limpiado para mantener tu contabilidad impecable. ¿Quieres intentar un nuevo dictamen o registrar manualmente?
```

**Validación:**
- Tool call genera BatchCard visible
- Confirmar Todo registra todas en BD
- Cancelar muestra Empty State + mensaje de Gema

---

## Task 6: Agregar estilos de animación para Empty State

**Archivo:** `src/app/globals.css`

**Cambios:**
1. Agregar `.batch-empty-container` - contenedor dashed
2. Agregar `.batch-row-hover` - transición de hover para filas
3. Agregar `.batch-success-check` - animación de check verde

**Validación:**
- Empty state renders con borde punteado
- Fila con error muestra borde rojo

---

## Task 7: Verificación final

**Checklist:**
- [ ] Gema usa tool calling (ver en logs de API)
- [ ] Batch Card muestra múltiples transacciones
- [ ] Collapsed muestra resumen con total neto
- [ ] Expanded muestra lista completa
- [ ] Hover muestra botones de editar/eliminar
- [ ] Error en fila muestra borde rojo
- [ ] "Confirmar Todo" bloqueado si hay errores
- [ ] Empty State aparece cuando lote se descarta
- [ ] Gema se disculpa al descartar
- [ ] Transacciones se registran en BD al confirmar
- [ ] `npm run build` pasa sin errores
- [ ] `npm run typecheck` pasa sin errores

---

## Dependencias

```
Task 1 ─┬─► Task 2 ─► Task 3 ─► Task 4 ─► Task 5 ─► Task 7
        │                                         │
        └─────────────────────────────────────────┘
                        Task 6
```

**Orden de ejecución:** 1 → 2 → 3 → 6 → 4 → 5 → 7

---

## Archivos afectados

| Archivo | Acción |
|---------|--------|
| `src/lib/assistant-tools.ts` | Modificar |
| `src/app/api/assistant/chat/route.ts` | Modificar |
| `src/lib/assistant-prompt.ts` | Modificar |
| `src/app/globals.css` | Modificar |
| `src/components/assistant/BatchCard.tsx` | Crear |
| `src/components/assistant/AssistantSheet.tsx` | Modificar |