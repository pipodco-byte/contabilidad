# Gema Chat Stream Fix - Technical Design

## 1. Backend Change

### File: `src/app/api/assistant/chat/route.ts`

**Línea 45:** Cambiar `toTextStreamResponse()` por `toDataStreamResponse()`

```typescript
// ANTES (línea 45)
return result.toTextStreamResponse()

// DESPUÉS (línea 45)
return result.toDataStreamResponse()
```

**Razón:** `toDataStreamResponse()` implementa el protocolo Vercel AI Data Stream que soporta:
- `text` - Mensajes de texto plain
- `tool_call` - Invocaciones de herramientas
- `tool_result` - Resultados de herramientas ejecutadas
- `error` - Errores del modelo

---

## 2. Frontend Verification

### File: `src/hooks/useAssistantChat.ts`

El reader actual ya maneja streaming de texto correctamente. No requiere cambios porque:

1. El `response.body?.getReader()` lee el stream byte a byte
2. El `decoder.decode()` convierte chunks a texto
3. El `fullResponse` se actualiza incrementalmente

**Posible Enhancement (opcional):**
Si después del fix el chat muestra texto duplicado, puede ser necesario ajustar el parsing del stream.

---

## 3. Supabase Blindage

### File: `src/hooks/useRadarData.ts`

**Cambio en el useEffect:**

```typescript
useEffect(() => {
  // Blindaje: no ejecutar query si userId está vacío
  if (!userId || userId.length < 5) {
    setLoading(false)
    setData([])
    return
  }

  const cargarDatos = async () => {
    try {
      let query = supabase.from('transacciones').select('monto, categoria, tipo')

      if (userRole !== 'admin') {
        query = query.eq('user_id', userId)
      }

      const { data: transacciones } = await query
      // ... resto del código existente
    } catch (error) {
      console.error('Error loading radar data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  cargarDatos()
}, [userId, userRole])
```

---

## 4. Other Hooks to Check

Verificar que todos los hooks que hacen queries a Supabase tengan el mismo blindaje:

| Hook | Archivo | Status |
|------|---------|--------|
| `useRadarData` | `hooks/useRadarData.ts` | Requiere fix |
| `useDashboardData` | `hooks/useDashboardData.ts` | Verificar |
| `usePaginatedTransactions` | `hooks/usePaginatedTransactions.ts` | Verificar |

---

## 5. Testing Checklist

- [ ] Enviar mensaje "Hola" → Gema responde
- [ ] Enviar "Venta de MacBook" → Gema responde y sugiere transacción
- [ ] Verificar Network tab → content-type: text/event-stream
- [ ] No ver errores 404 en Supabase en dashboard/graficas
- [ ] npm run build pasa