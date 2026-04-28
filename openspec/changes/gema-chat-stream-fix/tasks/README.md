# Gema Chat Stream Fix - Task Breakdown

## Phase: Apply

---

## Task 1: Fix Backend Stream Response

**Archivo:** `src/app/api/assistant/chat/route.ts`

**Cambio:** Línea 45
```typescript
// Buscar:
return result.toTextStreamResponse()

// Reemplazar por:
return result.toDataStreamResponse()
```

**Validación:** `npm run build`

---

## Task 2: Add Supabase Blindage

**Archivo:** `src/hooks/useRadarData.ts`

**Cambio:** Agregar early return al inicio del useEffect
```typescript
useEffect(() => {
  if (!userId || userId.length < 5) {
    setLoading(false)
    setData([])
    return
  }
  // ... resto del código
}, [userId, userRole])
```

**Validación:** Navegar a /dashboard/graficas - no deben aparecer 404s en consola

---

## Task 3: Verify No Duplicate Hooks

**Archivos a verificar:**
- `src/hooks/useDashboardData.ts`
- `src/hooks/usePaginatedTransactions.ts`

**Si existen y usan userId**, agregar el mismo blindaje.

---

## Task 4: Verification

**Checklist:**
- [ ] Chat responde mensaje de prueba
- [ ] No errores 404 de Supabase
- [ ] npm run build pasa

---

## Files Summary

| Archivo | Acción |
|---------|--------|
| `src/app/api/assistant/chat/route.ts` | Modificar línea 45 |
| `src/hooks/useRadarData.ts` | Modificar useEffect |