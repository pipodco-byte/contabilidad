# Tasks: boutique-zinc-refactor

## Tasks

### 1. Header Glassmorphism

**Tarea:** Aplicar backdrop-blur glassmorphism al header.

**Pasos:**
1. Leer `src/components/layout/header.tsx`
2. Agregar `bg-white/70 backdrop-blur-md border-b border-zinc-200/50`
3. Verificar en browser

**Verify:**
- [ ] Header tiene efecto glass en light mode
- [ ] Contenido atrás se ve difuminado

---

### 2. Slate → Zinc en TransactionTable

**Tarea:** Reemplazar todas las clases slate-* por zinc-* en transaction-table.tsx.

**Archivos a modificar:**
- `src/components/tables/transaction-table.tsx`

**Cambios:**
- `bg-slate-100` → `bg-zinc-100`
- `bg-slate-800` → `bg-zinc-800`
- `border-slate-200` → `border-zinc-200`
- `border-slate-700` → `border-zinc-700`
- `text-slate-*` → `text-zinc-*`

**Verify:**
- [ ] Select usa bg-zinc-100
- [ ] Botones usan border-zinc-200

---

### 3. Slate → Zinc en FilterSelectors

**Tarea:** Reemplazar slate por zinc en FilterSelectors.tsx.

**Archivos a modificar:**
- `src/components/FilterSelectors.tsx`

**Verify:**
- [ ] Filtros usan zinc palette

---

### 4. Slate → Zinc Global

**Tarea:** Buscar y reemplazar slate-* en todos los componentes.

**Pasos:**
1. `grep -r "slate-" src/components/` para encontrar todos
2. Reemplazar según la tabla de mapping

**Mapeo:**
| From | To (light) | To (dark) |
|------|------------|-----------|
| bg-slate-100 | bg-zinc-100 | bg-zinc-900 |
| bg-slate-800 | bg-zinc-800 | bg-zinc-800 |
| border-slate-200 | border-zinc-200 | border-zinc-800 |
| text-slate-900 | text-zinc-900 | text-zinc-100 |
| text-slate-400 | text-zinc-400 | text-zinc-400 |

**Verify:**
- [ ] Ningún slate-* en componentes
- [ ] Build pasa

---

### 5. Ghost Buttons

**Tarea:** Verificar que botones usan ghost borders con hover violeta.

**Pasos:**
1. Revisar botones en sidebar, header, action buttons
2. Asegurar que tienen `border border-zinc-200/50 hover:border-violet-500/50`

**Verify:**
- [ ] Botones tienen ghost style

---

## Summary

| Task | Status |
|------|--------|
| 1. Header Glassmorphism | ⏳ Pending |
| 2. TransactionTable zinc | ⏳ Pending |
| 3. FilterSelectors zinc | ⏳ Pending |
| 4. Global slate cleanup | ⏳ Pending |
| 5. Ghost buttons | ⏳ Pending |