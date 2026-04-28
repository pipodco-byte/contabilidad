# Proposal: IA Strategy - UX Enhancement & Data Integration

## Intent

Transformar IA Strategy de un simulador manual a un **Asesor de Negocios de Alta Precisión** que:
1. Hereda la UX pulida de Gema (Markdown, Textarea, Delete Modal)
2. Accede a datos reales de `cont_transacciones` para calcular utilidad real
3. Proporciona consejos estratégicos basados en hechos, no suposiciones

## Scope

### In Scope (Fase 1 - Quick Wins UX)
- Markdown rendering con `remarkGfm` y `markdownComponents` de Gema
- Textarea auto-grow con Enter=enviar, Shift+Enter=nueva línea
- Delete confirm modal con backdrop blur
- Hybrid scrolling (instant primer load, smooth después)
- Loading state con pulse "Escribiendo..."

### In Scope (Fase 2 - T16: Real Data)
- Crear `strategy-constants.ts` con gastos fijos desde `.env`
- Crear View SQL `vw_monthly_financial_summary` en Supabase
- Integrar datos reales en prompt de Strategy
- Comparar: Real vs Meta vs Break-even

### In Scope (Fase 3 - Voice)
- Integrar `AssistantMicButton` en StrategyChat
- Voice input para consultas manos libres

### Out of Scope
- UI de edición de gastos fijos (futuro, T17)
- OCR de reportes externos (futuro)
- Historial persistente multi-dispositivo (futuro, AF1)

## Approach

### Fase 1: Quick Wins (UX)
Reusar componentes y patrones de Gema en StrategyChat:
1. Copiar `markdownComponents` de AssistantSheet
2. Agregar `remarkGfm` import
3. Implementar textarea con auto-grow
4. Copiar delete confirm modal pattern
5. Agregar `isFirstLoad` logic para scroll

### Fase 2: Real Data (T16)
1. Definir `FIXED_COSTS_TOTAL` en `.env`
2. Crear `strategy-constants.ts` que exporta constantes
3. Crear View SQL: `vw_monthly_financial_summary`
4. Modificar API `/api/strategy/chat` para injectar datos reales
5. Actualizar StrategyPrompt para usar datos reales

### Fase 3: Voice
1. Importar `AssistantMicButton` en StrategyChat
2. Agregar handler para voice input

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/strategy/StrategyChat.tsx` | Modified | Add markdown, textarea, delete modal, voice |
| `src/components/strategy/StrategyMessage.tsx` | Modified | Use markdownComponents for rendering |
| `src/lib/assistant-prompt.ts` | Reference | Copy markdownComponents pattern |
| `src/lib/strategy-constants.ts` | New | Financial plan constants |
| `src/app/api/strategy/chat/route.ts` | Modified | Inject real financial data |
| `.env.local` | Modified | Add FIXED_COSTS_TOTAL |
| `supabase/migrations/` | New | View SQL for financial summary |

## Formula Correcta

```
Utilidad Neta = Ventas - Egresos - Gastos Fijos

Donde:
- Ventas = SUM(monto) WHERE tipo = 'Ingreso' (mes actual)
- Egresos = SUM(monto) WHERE tipo = 'Egreso' (mes actual)
- Gastos Fijos = $12,149,400 (de constants)
```

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| View query lenta con muchos datos | Low | Índices en fecha + user_id |
| Constants desactualizados | Low | Verificar quarterly |
| Breaking changes en Gema | Low | Componentes isolados |

## Rollback Plan

1. Revertir cambios en StrategyChat.tsx a versión anterior
2. Eliminar strategy-constants.ts
3. Restaurar .env
4. Mantener View SQL (no afecta si no se usa)

## Dependencies

- `cont_transacciones` table con datos de Felipe
- `PLAN_FINANCIERO_PIPOD_2026.md` (ya existe)
- Gema componentes (para copiar patterns)

## Success Criteria

- [ ] StrategyChat renderiza Markdown con tablas y code blocks
- [ ] Textarea crece automáticamente con el contenido
- [ ] Delete confirm tiene backdrop blur
- [ ] Scroll es instantáneo en primer load, smooth en nuevos mensajes
- [ ] View SQL retorna datos correctos
- [ ] API injecta financial snapshot en prompt
- [ ] IA responde con datos reales: "Tu utilidad neta es $X"
- [ ] Build pasa sin errores