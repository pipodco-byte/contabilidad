# Gema Stream Stability Fix - Technical Design

## 1. Route.ts Changes

### File: `src/app/api/assistant/chat/route.ts`

**Change 1: Línea 45**
```typescript
// ANTES (causa error):
return result.toDataStreamResponse()

// DESPUÉS (v6 compatible):
return result.toTextStreamResponse()
```

**Change 2: Líneas 41-42**
```typescript
// ANTES:
tools: tools as any,
toolChoice: 'auto',

// DESPUÉS (comentado):
// tools: tools as any,
// toolChoice: 'auto',
```

---

## 2. Why This Fixes the Problem

AI SDK v6.0.168 tiene limitaciones con tools:
- `toTextStreamResponse()` solo maneja texto plano
- Cuando el modelo intenta invocar una tool, el stream puede fallar
- Al deshabilitar tools temporalmente, el chat funciona con texto normal

---

## 3. Next Steps (After Verification)

Una vez que el chat funcione, podemos investigar:
1. Si el schema de tools tiene problemas de tipado
2. Si necesitamos usar `StreamData` para inyectar resultados manualmente
3. Si hay forma de hacer tools compatibles con v6

---

## 4. Testing Checklist

- [ ] Build pasa sin errores
- [ ] Chat responde mensaje inicial
- [ ] Enviar "Hola" → Gema responde
- [ ] No errores en consola del servidor