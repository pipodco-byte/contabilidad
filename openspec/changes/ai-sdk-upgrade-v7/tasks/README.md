# AI SDK Upgrade v7+ - Task Breakdown

## Phase: Apply

---

## Task 1: Upgrade AI SDK

```bash
npm install ai@latest
```

**Validación:** `npm list ai` debe mostrar >= 7.0.0

---

## Task 2: Update route.ts

**Archivo:** `src/app/api/assistant/chat/route.ts`

**Cambios:**
1. Línea 45: `toTextStreamResponse()` → `toDataStreamResponse()`

---

## Task 3: Verify Build

```bash
npm run build
```

**Si hay errores de tipos:**
- Revisar si `tools as any` puede convertirse en solo `tools`
- Resolver errores uno por uno

---

## Task 4: Test Chat

Navegar a `/dashboard/ia-strategy` y verificar:
- Gema responde al mensaje inicial
- Mensaje "venta de macbook" recibe respuesta

---

## Files Summary

| Archivo | Acción |
|---------|--------|
| `package.json` | Upgrade ai SDK |
| `src/app/api/assistant/chat/route.ts` | Cambiar método stream |