# Gema Lote v2.0 - Specification

## 1. Overview

**Change Name:** Gema Lote v2.0
**Type:** Feature (Major Enhancement)
**Status:** Spec Draft
**Created:** 2026-04-25

---

## 2. Executive Summary

Transformar Gema de un chatbot de texto plano a un **motor de procesamiento financiero por lotes** que acepta dictados multimodales y retorna transacciones estructuradas via Tool Calling.

**Objetivo:** Felipe dicta múltiples transacciones en una sola oración → Gema parsea → PreVizCard en modo lote → Felipe confirma de un solo click.

---

## 3. Concepto

### De Chatbot → Motor de Procesamiento

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Interacción | Texto narrativo | Tool Calling (JSON) |
| Validación | Nula (IA podía inventar formatos) | Zod Schema |
| Confirmación | Múltiples mensajes | Una sola Batch Card |
| Precisión Montos | Strings ("un millón y medio") | Numbers (1500000) |

---

## 4. Schema de Datos

### TransaccionItemSchema
```typescript
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
```

### LoteTransaccionesSchema
```typescript
const LoteTransaccionesSchema = z.object({
  transacciones: z.array(TransaccionItemSchema).min(1)
})
```

---

## 5. Comportamiento de Gema

### 5.1 Agrupación
- Si el usuario repite montos o conceptos, Gema pregunta: "¿Son estas transacciones independientes o duplicados?"
- Gema organiza cronológicamente o por categoría

### 5.2 Normalización de Montos
- "1.5M" → 1500000
- "200 mil pesos" → 200000
- "doscientos mil" → No soportado (pide corrección)

### 5.3 Inferencia de Fechas
- Gema recibe `current_date` en el prompt
- "ayer" → Calcula fecha absoluta (26/04/2026)
- "el lunes pasado" → Calcula fecha
- "hace tres días" → Calcula fecha

### 5.4 Inferencia de Categorías
- "iPhone" en descripción → `Venta Equipos Nuevos`
- "cambio de batería" → `Servicio Técnico`
- "pantalla" → `Reparación`
- Si no está segura, deja vacío para asignación manual

### 5.5 Default de Medio de Pago
- Si falta, default es `Efectivo` (más común en Pipod)

---

## 6. Estados del Lote

| Estado | Descripción | UI |
|--------|-------------|-----|
| **Drafting** | Gema procesando | Skeleton/Loading |
| **Review** | Stack de tarjetas listo | Batch Card expandida |
| **Error** | Validación fallida | Fila roja + Confirmar bloqueado |
| **Success** | Registrado en BD | Check animation |
| **Empty** | Lote descartado | Empty State con 3 acciones |

---

## 7. Batch Card UI

### 7.1 Estado Colapsado (Resumen)
- Header: Badge "Batch Ready" + stack visual
- Total neto: "$4.5M" (grande)
- Desglose: "2 Ingresos, 1 Egreso"
- Chevron para expandir

### 7.2 Estado Expandido (Detalle)
- Lista de filas con:
  - Icono (↑ verde / ↓ rojo)
  - Descripción breve
  - Monto
- Hover: Botón X (eliminar) + Lápiz (editar)
- Footer: Botón "Confirmar Todo" (indigo)

### 7.3 Empty State (Actionable Reset)
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │
│  │     [RotateCcw icon]     │  │
│  └───────────────────────────┘  │
│                                 │
│  Lote descartado.              │
│  El historial de este dictado  │
│  se ha limpiado para mantener │
│  tu contabilidad impecable.   │
│                                 │
│  [Reintentar Dictado]         │
│  [Registro Manual]            │
│  [Cerrar]                    │
└─────────────────────────────────┘
```

### 7.4 Error State
- Fila con borde rojo (`border-red-500`)
- Tooltip con mensaje de error
- Botón "Confirmar Todo" deshabilitado

---

## 8. Gema Apology Message

Cuando el lote es descartado, Gema dice:

> *"Entendido, Felipe. El lote ha sido limpiado para mantener tu contabilidad impecable. ¿Quieres intentar un nuevo dictamen o registrar manualmente?"*

---

## 9. Scope

### Archivos a modificar:
- `src/lib/assistant-tools.ts` - Agregar `LoteTransaccionesSchema`
- `src/app/api/assistant/chat/route.ts` - Habilitar tools
- `src/components/assistant/AssistantSheet.tsx` - Detectar tool call → BatchCard
- `src/components/assistant/BatchCard.tsx` - NUEVO componente
- `src/lib/assistant-prompt.ts` - Actualizar system prompt

### No modificar:
- Otros módulos de IA Strategy
- Dashboard general

---

## 10. Success Criteria

1. ✅ Gema usa Tool Calling para retornar JSON
2. ✅ Batch Card muestra múltiples transacciones
3. ✅ "Confirmar Todo" registra todas en BD
4. ✅ Error en una fila no bloquea las demás (validación en lote)
5. ✅ Empty State con 3 acciones disponibles
6. ✅ Gema se disculpa profesionalmente al descartar