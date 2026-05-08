# AI SDK Upgrade v7+ - Technical Design

## 1. Upgrade Command

```bash
cd /Users/calderonjosue_/Contabilidad_pipod/pipod-contabilidad
npm install ai@latest
```

## 2. Expected Changes

### package.json
```diff
-    "ai": "^6.0.168",
+    "ai": "^7.0.0",
```

### route.ts
```diff
  const result = await streamText({
    model: deepseek('deepseek-v4-flash'),
    system: buildSystemPrompt(),
    messages,
    tools: tools as any,
    toolChoice: 'auto',
  })

-  return result.toTextStreamResponse()
+  return result.toDataStreamResponse()
```

## 3. Type Compatibility

En AI SDK v7+, el objeto `tools` exportado de `assistant-tools.ts` debería ser compatible con el tipo `ToolSet`.

Si hay errores de tipos después del upgrade, verificar:
- Los esquemas Zod cumplen con el formato esperado
- Los nombres de tools coinciden exactamente

## 4. Rollback Plan

Si el upgrade rompe algo:
```bash
npm install ai@6.0.168
git checkout package.json
```

---

## 5. Testing Checklist

- [ ] `npm list ai` muestra versión >= 7.0.0
- [ ] `npm run build` pasa sin errores
- [ ] Chat responde con mensaje de texto
- [ ] Tool calls se procesan correctamente