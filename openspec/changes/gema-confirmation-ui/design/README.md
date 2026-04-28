# Gema Confirmation UI Fix - Technical Design

## 1. Backend Changes: route.ts

### Agregar toolResults a la response

```typescript
// ANTES:
return Response.json({
  role: 'assistant',
  content: result.text,
})

// DESPUÉS:
return Response.json({
  role: 'assistant',
  content: result.text,
  toolResults: result.toolResults,
})
```

---

## 2. Frontend Changes: useAssistantChat.ts

### En handleSend, procesar toolResults

```typescript
const result = await response.json()

if (result.error) {
  throw new Error(result.error)
}

// Agregar mensaje del asistente
let assistantContent = result.content

// Si hay toolResults exitosos, agregar confirmación
if (result.toolResults && result.toolResults.length > 0) {
  const successCount = result.toolResults.filter(r => !r.error).length
  if (successCount > 0) {
    assistantContent += `\n\n✅ ${successCount} transacción${successCount > 1 ? 'es' : ''} registrada${successCount > 1 ? 's' : ''} exitosamente.`
  }
}

setMessages((prev) => [
  ...prev,
  { role: 'assistant', content: assistantContent }
])
```

---

## 3. Testing Checklist

- [ ] Enviar "Venta MacBook $1M Nequi"
- [ ] Verificar que chat muestra confirmación
- [ ] npm run build pasa