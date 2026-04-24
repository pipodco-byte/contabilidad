# Proposal: Gema IA — Asistente Contable (v1)

## Intent

Crear "Gema", un asistente contable con IA conversacional integrado en el dashboard de Pipod Contabilidad. Gema permite registrar transacciones usando lenguaje natural mediante un interface de chat elegante estilo ChatGPT, con validación de 9 datos, automatización Bold (5% comisión), y preview antes de confirmar.

## Scope

### In Scope (V1)
- Fixed bottom bar en dashboard con input collapsed
- Sheet lateral (derecha) con chat stateful
- Integración Gemini 1.5 Flash via Vercel AI SDK
- Tool Calling con Zod schemas para type safety
- Pre-visualization card antes de INSERT
- Regla Bold con parent_id (relational integrity)
- Micro-feedback (elogios profesionales)
- Output CSV sin headers para exportar

### Out of Scope (V2)
- Speech-to-text (voz)
- Historial persistente entre sesiones
- Múltiples бизнес reglas adicionales
- Edición de transacciones existentes via Gema

## Approach

### UX Flow
1. Usuario escribe en bottom bar → submit
2. Sheet abre con conversación stateful
3. Gema parsea con Tool Calling → muestra Pre-visualization Card
4. Usuario confirma o corrige
5. INSERT a Supabase (con Bold parent_id si aplica)
6. Usuario cierra sheet → bottom bar colapsa

### Tech Stack
- Vercel AI SDK (streaming + Tool Calling)
- Gemini 1.5 Flash (modelo)
- Zod (validación de schemas)
- Web Speech API (V2, no V1)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/dashboard/page.tsx` | Modified | Agregar Gema bottom bar |
| `src/app/dashboard/layout.tsx` | Modified | Sheet provider (si no existe) |
| `src/components/gema/` | Created | GemaSheet, GemaInput, GemaPreviewCard |
| `src/lib/gema-tools.ts` | Created | Zod schemas + tool definitions |
| `src/app/api/gema/chat/route.ts` | Created | API route con Vercel AI SDK |
| `docs/GEMA_PROMPT.md` | Existing | System prompt (personalidad) |
| Supabase: transacciones | Modified | Agregar parent_id |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Gemini hallucination | Low | Zod validation + Pre-viz card |
| Edge cases en parsing | Medium | Test cases extensivos |
| UX confusion (estado collapsed/expanded) | Low | Estados bien definidos |
| Bold rule misunderstood | Low | Documentación clara |

## Rollback Plan

1. Remover GemaInput del dashboard page
2. Remover GemaSheet component
3. Remover /api/gema/chat route
4. Revertir tabla Supabase (remover parent_id si no se usa)

## Dependencies

- `ai` (Vercel AI SDK)
- `gemini-ai` provider
- `zod`

## Success Criteria

- [ ] Bottom bar visible en dashboard
- [ ] Sheet abre con conversación stateful
- [ ] Gema responde con personalidad "Amabilidad Ejecutiva"
- [ ] 9 datos parseados correctamente via Tool Calling
- [ ] Pre-viz card muestra datos antes de confirmar
- [ ] INSERT exitoso con parent_id para Bold
- [ ] Micro-feedback aparece en respuestas apropiadas
- [ ] Sheet cierra y bottom bar colapsa
- [ ] Build pasa sin errores
