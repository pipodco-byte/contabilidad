# Gema Confirmation UI Fix - Specification

## 1. Overview

**Change Name:** Gema Confirmation UI Fix
**Type:** Bug Fix
**Status:** Spec
**Created:** 2026-04-28

---

## 2. Executive Summary

El chat muestra "Registrando..." pero no actualiza a confirmación. Necesitamos que cuando la transacción se registre exitosamente, el mensaje del chat cambie a una confirmación clara.

---

## 3. Problem Description

### Síntoma
1. Usuario dicta transacción → Gema responde con "Registrando..."
2. La transacción se inserta en Supabase (verificado)
3. PERO el mensaje en el chat queda en "Registrando..." sin actualizar

### Causa Raíz
El `execute` handler inserta la transacción, pero el frontend no sabe que fue exitosa. Necesitamos:
1. Que el backend retorne información del éxito
2. Que el frontend muestre confirmación basada en toolResults

---

## 4. Solution

### Backend: Incluir toolResults en response
```typescript
return Response.json({
  role: 'assistant',
  content: result.text,
  toolResults: result.toolResults,
})
```

### Frontend: Mostrar confirmación basada en toolResults
```typescript
if (result.toolResults && result.toolResults.length > 0) {
  // Mostrar mensaje de éxito
}
```

---

## 5. Scope

### Archivos a modificar:
- `src/app/api/assistant/chat/route.ts`
- `src/hooks/useAssistantChat.ts`

---

## 6. Success Criteria

1. ✅ Chat muestra confirmación cuando transacción se registra
2. ✅ `npm run build` pasa sin errores