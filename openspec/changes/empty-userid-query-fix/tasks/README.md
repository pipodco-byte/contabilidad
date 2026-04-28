# Empty UserId Query Fix - Task Breakdown

## Phase: Apply

---

## Task 1: Fix usePaginatedTransactions.ts

**Archivo:** `src/hooks/usePaginatedTransactions.ts`

**Cambio:** Agregar guard clause antes de ejecutar query.

---

## Task 2: Verify useListaTransacciones.ts

**Archivo:** `src/hooks/useListaTransacciones.ts`

**Verificar:** Tiene similar guard clause o necesita agregarse.

---

## Task 3: Verify useTransacciones.ts

**Archivo:** `src/hooks/useTransacciones.ts`

**Verificar:** Tiene similar guard clause o necesita agregarse.

---

## Task 4: Build

```bash
npm run build
```

---

## Task 5: Test

Verificar en UI /transacciones que los datos persisten.