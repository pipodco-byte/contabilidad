# 📋 Documentación de Estilos de Botones — Pipod Contabilidad

**Última actualización:** Abril 2025
**Versión:** 1.0

---

## 🎨 Estilos de Botones Actuales

### 1. Botón Primario (Violet Gradient)

**Usos:** Gema, Enviar, Enviar a Felipe

```tsx
<Button
  className="
    bg-gradient-to-br from-violet-500 to-violet-600
    text-white
    shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)]
    border-t border-white/20
    active:scale-95
    transition-all duration-200"
>
```

**Componentes que lo usan:**
- `/dashboard/config/page.tsx` — Botón Gema
- `/dashboard/config/page.tsx` — Botón Enviar (textarea)
- `/components/reports/reports-tabs.tsx` — Botón Enviar a Felipe

---

### 2. Botón Secundario (Emerald)

**Usos:** Nueva Transacción

```tsx
<Button className="bg-emerald-600 hover:bg-emerald-500 text-white">
```

**Componentes que lo usan:**
- `/dashboard/transacciones/page.tsx` — Botón Nueva Transacción

---

### 3. Botón Outline

**Usos:** Informe Anual, Informe Mensual

```tsx
<Button variant="outline">
```

---

## 📍 Ubicación de Botones

### `/dashboard/page.tsx`
```
┌─────────────────────────────────────┐
│  BOTONES (arriba de KPI)           │
├─────────────────────────────────────┤
│ [Gema] [Nueva Transacción] [Informes]│
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  KPI CARDS                          │
│  Ingresos | Egresos | Balance        │
└─────────────────────────────────────┘
```

### `/dashboard/transacciones/page.tsx`
```
┌─────────────────────────────────────┐
│  [Nueva Transacción]                │
├─────────────────────────────────────┤
│  Filtros                            │
├─────────────────────────────────────┤
│  Tabla de Transacciones             │
└─────────────────────────────────────┘
```

### `/dashboard/informes/page.tsx`
```
┌─────────────────────────────────────┐
│  Selector de Mes                    │
│  [Enviar a Felipe]                  │
├─────────────────────────────────────┤
│  Gráficas y Tabla                   │
└─────────────────────────────────────┘
```

### `/dashboard/config/page.tsx`
```
┌─────────────────────────────────────┐
│  Importar desde Gema                │
│  [Gema]                             │
│  [textarea + Enviar]               │
└─────────────────────────────────────┘
```

---

## 🔄 Cambios Propuestos

### Pendientes de Implementación

| # | Cambio | Archivo | Estado |
|---|--------|---------|--------|
| 1 | Mover botones ARRIBA de KPI Cards | `/dashboard/page.tsx` | ⏳ |
| 2 | Aplicar violet gradient a Gema en dashboard | `/dashboard/page.tsx` | ⏳ |
| 3 | Aplicar emerald a Nueva Transacción | `/dashboard/page.tsx` | ⏳ |
| 4 | Eliminar Admin Badge | `/dashboard/config/page.tsx` | ⏳ |

---

## ✅ Checklist de Consistencia

- [ ] Todos los botones primarios usan violet gradient
- [ ] Botón Nueva Transacción usa emerald
- [ ] Botones de navegación usan outline
- [ ] Sin inconsistencias de color entre páginas
- [ ] Admin Badge eliminado

---

## 📝 Notas

- El estilo violet gradient fue definido en `openspec/changes/gema-button-styling/`
- Emerald fue definido en el tema UI Boutique original
- El objetivo es tener **un solo lugar** para cada estilo

---

**Referencia:** `openspec/changes/gema-button-styling/`
