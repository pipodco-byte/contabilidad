# Gema Stream Stability Fix - Task Breakdown

## Phase: Apply

---

## Task 1: Revert Route.ts

**Archivo:** `src/app/api/assistant/chat/route.ts`

**Cambios:**
1. Línea 45: `toDataStreamResponse()` → `toTextStreamResponse()`
2. Líneas 41-42: Comentar `tools` y `toolChoice`

---

## Task 2: Verify Build

```bash
npm run build
```

---

## Task 3: Test Chat

Navegar a `/dashboard/ia-strategy` y verificar Gema responde.

---

## Files Summary

| Archivo | Cambio |
|---------|--------|
| `route.ts` | Revert + disable tools |