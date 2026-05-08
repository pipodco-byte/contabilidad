# Gema Lote v2.0 - Technical Design

## 1. Files to Modify/Create

### 1.1 `src/lib/assistant-tools.ts` - Agregar Schema de Lote

```typescript
// Agregar al final
const TransaccionItemSchema = z.object({
  monto: z.number().positive('Monto debe ser mayor a 0'),
  descripcion: z.string().min(1, 'Descripción requerida'),
  tipo: z.enum(['Ingreso', 'Egreso']),
  fecha: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).optional(),
  medio_pago: z.enum(MEDIOS_PAGO).optional().default('Efectivo'),
  categoria: z.enum(CATEGORIAS).optional(),
  sub_categoria: z.string().optional(),
  estado_iva: z.enum(ESTADOS_IVA).optional().default('Exento'),
  comentarios: z.string().optional(),
})

const LoteTransaccionesSchema = z.object({
  transacciones: z.array(TransaccionItemSchema).min(1)
})

export const tools = {
  registrar_transaccion: {
    description: 'Registra una transacción contable con los 9 datos obligatorios',
    parameters: TransaccionItemSchema,
  },
  registrar_lote_transacciones: {
    description: 'Registra múltiples transacciones a partir de un dictado',
    parameters: LoteTransaccionesSchema,
  },
}
```

---

## 2. API Route Changes

### `src/app/api/assistant/chat/route.ts`

**ANTES:**
```typescript
const result = await streamText({
  model: deepseek('deepseek-v4-flash'),
  system: buildSystemPrompt(),
  messages,
})
```

**DESPUÉS:**
```typescript
import { tools } from '@/lib/assistant-tools'

const result = await streamText({
  model: deepseek('deepseek-v4-flash'),
  system: buildSystemPrompt(),
  messages,
  tools,
  toolChoice: 'auto',
})
```

---

## 3. System Prompt Updates

### `src/lib/assistant-prompt.ts`

Agregar al SYSTEM_PROMPT:

```typescript
// AGREGAR DESPUÉS DE "INSTRUCCIONES PARA TOOL CALLING"

INSTRUCCIONES DE LOTE (Gema Lote v2.0):

1. SIEMPRE usa registrar_lote_transacciones aunque sea UNA transacción.
   Esto garantiza consistencia en la interfaz.

2. MONEDA: Normaliza montos automáticamente:
   - "1.5M" o "1.5 millones" → 1500000
   - "200k" o "200 mil" → 200000
   - "dos millones quinientos" → No soportado, pide claridad

3. FECHAS: Calcula fechas absolutas si detecta relativos:
   - "ayer" → 26/04/2026 (hoy es 27/04/2026)
   - "el lunes pasado" → Calcula el lunes anterior
   - "hace tres días" → Calcula restando 3 días

4. CATEGORÍAS: Infiere automáticamente:
   - "iPhone", "MacBook", "Samsung" → Venta Equipos Nuevos
   - "pantalla", "batería", "reparación" → Reparación
   - "domicilio", "envío" → Servicios
   Si no estás seguro, deja el campo vacío.

5. DEFAULT: Si falta medio_pago, usa "Efectivo".

6. AGRUPACIÓN: Si detectas múltiples transacciones en un mensaje,
   sepáralas en items individuales del array.

7. ERRORES: Si una transacción tiene problemas (ej. monto negativo),
   NO la incluyas en el lote. Incluye solo las válidas y menciona
   cuáles excluiste y por qué.
```

---

## 4. Frontend Changes

### 4.1 AssistantSheet.tsx

**Detectar tool calls y renderizar BatchCard:**

```typescript
// En el return, después de los mensajes:
{pendingLote && pendingLote.length > 0 && (
  <BatchCard
    transacciones={pendingLote}
    onConfirm={handleConfirmLote}
    onEdit={handleEditItem}
    onDelete={handleDeleteItem}
    onCancel={handleCancelLote}
  />
)}
```

**Nuevos handlers:**
```typescript
const handleConfirmLote = async () => {
  // Iterar sobre pendingLote y llamar handleConfirm por cada una
}

const handleCancelLote = () => {
  // Mostrar empty state
  addAssistantMessage("Entendido, Felipe. El lote ha sido limpiado para mantener tu contabilidad impecable. ¿Quieres intentar un nuevo dictamen o registrar manualmente?")
  setPendingLote([])
}
```

### 4.2 BatchCard.tsx (NUEVO COMPONENTE)

```typescript
interface BatchCardProps {
  transacciones: TransaccionItem[]
  onConfirm: () => void
  onEdit: (index: number, item: TransaccionItem) => void
  onDelete: (index: number) => void
  onCancel: () => void
}
```

**Estados visuales:**
- Default: Collapsed (resumen)
- Expanded: Lista completa
- Empty: Actionable Reset
- Loading: Skeleton

---

## 5. BatchCard Component Structure

### 5.1 Collapsed State
```tsx
<div className="bg-zinc-800/50 border border-indigo-500/30 rounded-xl p-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Badge variant="batch">Batch Ready</Badge>
      <span className="text-2xl font-bold text-emerald-400">
        +$4.5M
      </span>
    </div>
    <ChevronDown className="text-zinc-400" />
  </div>
  <p className="text-sm text-zinc-400 mt-1">
    3 transacciones: 2 ingresos, 1 egreso
  </p>
</div>
```

### 5.2 Expanded State
```tsx
<div className="space-y-2">
  {/* Header */}
  <div className="flex items-center justify-between pb-2 border-b border-zinc-700">
    <Badge variant="batch">Batch Ready</Badge>
    <span className="text-lg font-bold">$4.5M neto</span>
  </div>

  {/* Lista de transacciones */}
  {transacciones.map((t, i) => (
    <div
      key={i}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg",
        "hover:bg-zinc-800/50 transition-colors",
        t.hasError && "border border-red-500/50 bg-red-500/10"
      )}
    >
      {/* Icono */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        t.tipo === 'Ingreso' ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
      )}>
        {t.tipo === 'Ingreso' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{t.descripcion}</p>
        <p className="text-xs text-zinc-500">{t.categoria || 'Sin categoría'}</p>
      </div>

      {/* Monto */}
      <p className={cn(
        "font-mono font-semibold",
        t.tipo === 'Ingreso' ? "text-emerald-400" : "text-rose-400"
      )}>
        {t.tipo === 'Ingreso' ? '+' : '-'}${t.monto.toLocaleString()}
      </p>

      {/* Actions (hover) */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(i, t)} className="p-1 hover:bg-zinc-700 rounded">
          <Pencil className="w-4 h-4 text-zinc-400" />
        </button>
        <button onClick={() => onDelete(i)} className="p-1 hover:bg-zinc-700 rounded">
          <X className="w-4 h-4 text-zinc-400" />
        </button>
      </div>
    </div>
  ))}

  {/* Footer */}
  <div className="pt-3 border-t border-zinc-700">
    <Button
      onClick={onConfirm}
      disabled={hasErrors}
      className="w-full bg-indigo-600 hover:bg-indigo-500"
    >
      Confirmar Todo ({transacciones.length})
    </Button>
  </div>
</div>
```

### 5.3 Empty State
```tsx
<div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center">
  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
    <RotateCcw className="w-6 h-6 text-zinc-500" />
  </div>

  <p className="text-sm text-zinc-400 mb-6">
    Lote descartado. El historial de este dictado se ha limpiado para mantener tu contabilidad impecable.
  </p>

  <div className="space-y-2">
    <Button variant="primary" className="w-full">
      Reintentar Dictado
    </Button>
    <Button variant="secondary" className="w-full">
      Registro Manual
    </Button>
    <Button variant="ghost" className="w-full text-zinc-500">
      Cerrar
    </Button>
  </div>
</div>
```

---

## 6. Error Handling Flow

```
1. Gema retorna { transacciones: [...] } con tool call
2. Frontend parsea y valida con Zod
3. Si una transacción tiene error (ej. monto negativo):
   - Marcar con `hasError: true`
   - Mostrar borde rojo en la fila
   - Tooltip con mensaje de error
4. Botón "Confirmar Todo" se deshabilita
5. Usuario puede:
   - Editar la fila (onEdit)
   - Eliminar la fila (onDelete)
   - Corregir y reintentar
```

---

## 7. Gema Apology Message

Cuando el lote es descartado, en `handleCancelLote`:

```typescript
const apologyMessage = `Entendido, Felipe. El lote ha sido limpiado para mantener tu contabilidad impecable. ¿Quieres intentar un nuevo dictamen o registrar manualmente?`

setMessages(prev => [...prev, {
  role: 'assistant',
  content: apologyMessage
}])
```

---

## 8. Testing Checklist

- [ ] Gema usa tool calling (ver en logs de API)
- [ ] Batch Card muestra múltiples transacciones
- [ ] Collapsed muestra resumen con total neto
- [ ] Expanded muestra lista completa
- [ ] Hover muestra botones de editar/eliminar
- [ ] Error en fila muestra borde rojo
- [ ] "Confirmar Todo" bloqueado si hay errores
- [ ] Empty State aparece cuando lote se descarta
- [ ] Gema se disculpa al descartar
- [ ] Transacciones se registran en BD al confirmar