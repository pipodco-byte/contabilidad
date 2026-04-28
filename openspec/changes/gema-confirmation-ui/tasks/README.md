# Gema Confirmation UI Fix - Task Breakdown

## Phase: Apply

---

## Task 1: Update route.ts

**Archivo:** `src/app/api/assistant/chat/route.ts`

**Cambio:** Agregar `toolResults` a la response

```typescript
return Response.json({
  role: 'assistant',
  content: result.text,
  toolResults: result.toolResults,
})
```

---

## Task 2: Update useAssistantChat.ts

**Archivo:** `src/hooks/useAssistantChat.ts`

**Cambio:** Procesar toolResults y agregar confirmación al mensaje

---

## Task 3: Verify build

```bash
npm run build
```

---

## Files Summary

| Archivo | Acción |
|---------|--------|
| `route.ts` | Agregar toolResults a response |
| `useAssistantChat.ts` | Mostrar confirmación cuando toolResults existe |