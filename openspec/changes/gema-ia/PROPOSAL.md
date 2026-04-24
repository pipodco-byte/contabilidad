# Proposal: Pipod Assistant (V1) — Renamed to "Copilot"

## Intent

Implementar un asistente contable con IA conversacional integrado en el dashboard de Pipod Contabilidad, utilizando un Floating Action Button (FAB) minimalista que activa un panel lateral con chat. El asistente permite registrar transacciones usando lenguaje natural, con validación de 9 datos, automatización Bold (5% comisión), y preview antes de confirmar.

## Scope

### In Scope (V1)
- FAB (Floating Action Button) en bottom-right del dashboard
- Panel lateral (derecha) con chat stateful
- Sidebar colapsa a 64px cuando asistente está activo
- Integración Gemini 2.0 Flash via Vercel AI SDK
- Tool Calling con Zod schemas para type safety
- Pre-visualization card antes de INSERT
- Regla Bold con parent_id (relational integrity)
- Micro-feedback (elogios profesionales)
- Output CSV sin headers para exportar

### Out of Scope (V2)
- Speech-to-text (voz)
- Historial persistente entre sesiones
- Múltiples reglas de negocio adicionales
- Edición de transacciones existentes via asistente

## UX Decisions

### Decision: FAB over Bottom Bar

**Choice:** Floating Action Button (FAB) bottom-right
**Rationale:**
- No ocupa espacio permanente en la UI
- Minimalista y no invasivo
- Familiar (patrón común en apps móvil)
- Solo visible cuando es necesario

### Decision: Sidebar Collapses on Active

**Choice:** Sidebar collapses to 64px when assistant is active
**Rationale:**
- Más espacio para el chat
- Contexto visual del dashboard aún visible
- UX tipo "drawer" bien establecido

### Decision: Sheet over Modal

**Choice:** Sheet lateral (derecha) para el chat
**Rationale:**
- Contexto visible (dashboard KPIs)
- Se siente como panel de herramientas
- Fácil de cerrar y continuar trabajando

### Decision: Name TBD

**Choice:** "Copilot" (tentativo)
**Rationale:**
- Similar a GitHub Copilot (familiar para devs)
- Profesional y corto
- Pendiente confirmar con usuario

## Approach

### UX Flow
1. Usuario ve FAB 💎 en bottom-right
2. Click en FAB → sidebar colapsa + sheet abre
3. Usuario interactúa con chat
4. Click X o fuera → sheet cierra + sidebar expande

### Tech Stack
- Vercel AI SDK (streaming + Tool Calling)
- Gemini 2.0 Flash (modelo)
- Zod (validación de schemas)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/dashboard/page.tsx` | Modified | FAB visible, sidebar state |
| `src/app/dashboard/layout.tsx` | Modified | Sidebar collapse logic |
| `src/components/assistant/` | Created | FAB, Sheet, Chat components |
| `src/lib/assistant-tools.ts` | Created | Zod schemas + tool definitions |
| `src/app/api/assistant/chat/route.ts` | Created | API route con Vercel AI SDK |
| `docs/GEMA_PROMPT.md` | Existing | System prompt (personalidad) |
| Supabase: transacciones | Modified | Agregar parent_id |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| FAB feels hidden | Low | Tooltip on hover + animation |
| Sidebar collapse confusing | Low | Smooth animation + context visible |
| Gemini hallucination | Low | Zod validation + Pre-viz card |

## Rollback Plan

1. Remover FAB del dashboard
2. Remover Sheet component
3. Remover /api/assistant/chat route
4. Restore sidebar to full width
5. Revertir tabla Supabase (remover parent_id)

## Dependencies

- `ai` (Vercel AI SDK)
- `@ai-sdk/google` (Gemini provider)
- `zod`

## Success Criteria

- [ ] FAB visible en bottom-right del dashboard
- [ ] Click en FAB abre sheet + colapsa sidebar
- [ ] Sheet cierra con X o click fuera + sidebar expande
- [ ] Chat es stateful durante la sesión
- [ ] Asistente responde con personalidad profesional
- [ ] 9 datos parseados correctamente via Tool Calling
- [ ] Pre-viz card muestra datos antes de confirmar
- [ ] INSERT exitoso con parent_id para Bold
- [ ] Micro-feedback aparece en respuestas apropiadas
- [ ] Build pasa sin errores
