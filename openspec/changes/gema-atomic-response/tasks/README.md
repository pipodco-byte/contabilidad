# Gema Atomic Response - Task Breakdown

## Phase: Apply

---

## Task 1: Update route.ts - generateText

**Archivo:** `src/app/api/assistant/chat/route.ts`

**Cambios:**
1. Importar `generateText` de `ai`
2. Importar `tools` de `@/lib/assistant-tools`
3. Cambiar `streamText` → `generateText`
4. Habilitar `tools` (remover comentarios)
5. Cambiar return a `Response.json()`

**Código:**
```typescript
import { streamText, generateText } from 'ai'
import { tools } from '@/lib/assistant-tools'

// En POST handler:
const { text, toolResults } = await generateText({
  model: deepseek('deepseek-v4-flash'),
  system: buildSystemPrompt(),
  messages,
  tools,
})

return Response.json({
  role: 'assistant',
  content: text,
  toolResults,
})
```

**Validación:** `npm run build`

---

## Task 2: Update useAssistantChat.ts - Handle JSON response

**Archivo:** `src/hooks/useAssistantChat.ts`

**Cambios:**
1. Agregar estado `isThinking` y `thinkingMessage`
2. Cambiar reader de stream a JSON response
3. Agregar rotación de mensajes
4. Guardar toolResults para BatchCard

**Validación:** TypeScript compile

---

## Task 3: Update AssistantSheet.tsx - Skeleton Premium

**Archivo:** `src/components/assistant/AssistantSheet.tsx`

**Cambios:**
1. Mostrar skeleton con gradiente mientras `isLoading`
2. Mostrar mensaje rotativo `thinkingMessage`
3. Agregar clase `message-appear` para fade-in

**Validación:** Visual en browser

---

## Task 4: Verify Registration

**Prueba:**
1. Enviar "Venta MacBook $1M Nequi"
2. Verificar que respuesta llega
3. Verificar que transacción aparece en Supabase

---

## Files Summary

| Archivo | Acción |
|---------|--------|
| `route.ts` | Refactor to generateText |
| `useAssistantChat.ts` | JSON response handling |
| `AssistantSheet.tsx` | Skeleton premium UI |