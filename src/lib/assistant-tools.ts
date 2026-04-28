import { z } from 'zod'

export const CATEGORIAS_INGRESO = [
  'Venta Equipos Nuevos',
  'Venta Equipos Usados',
  'Venta Accesorios',
  'Reparación',
] as const

export const CATEGORIAS_EGRESO = [
  'Publicidad',
  'Costos Venta',
  'Infraestructura',
  'Nómina',
  'Impuestos',
  'Servicios',
  'Retiros Felipe',
] as const

export const CATEGORIAS = [...CATEGORIAS_INGRESO, ...CATEGORIAS_EGRESO] as const

export const MEDIOS_PAGO = [
  'Davivienda',
  'Bold',
  'Efectivo',
  'Nequi',
  'Daviplata',
  'Transferencia',
] as const

export const ESTADOS_IVA = ['Exento', 'Incluido', 'Externo'] as const

export const RegistrarTransaccionSchema = z.object({
  fecha: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato DD/MM/YYYY'),
  descripcion: z.string().min(1, 'Descripción requerida'),
  categoria: z.enum(CATEGORIAS, {
    errorMap: () => ({ message: 'Categoría inválida' }),
  }),
  sub_categoria: z.string().optional(),
  monto: z.number().positive('Monto debe ser mayor a 0'),
  tipo: z.enum(['Ingreso', 'Egreso']),
  medio_pago: z.enum(MEDIOS_PAGO, {
    errorMap: () => ({ message: 'Medio de pago inválido' }),
  }),
  estado_iva: z.enum(ESTADOS_IVA).optional().default('Exento'),
  comentarios: z.string().optional(),
})

export const BoldComisionSchema = z.object({
  monto_original: z.number().positive(),
  monto_comision: z.number().positive(),
  descripcion: z.string(),
  categoria: z.literal('Costos Venta'),
  sub_categoria: z.string().optional(),
  tipo: z.literal('Egreso'),
  medio_pago: z.string(),
  comentarios: z.string(),
  parent_id: z.string().uuid(),
})

export type TransaccionData = z.infer<typeof RegistrarTransaccionSchema>
export type BoldComisionData = z.infer<typeof BoldComisionSchema>

export function calcularComisionBold(montoOriginal: number): number {
  return Math.round(montoOriginal * 0.05)
}

export function generarTransaccionBold(
  transaccionOriginal: TransaccionData,
  parentId: string
): BoldComisionData {
  return {
    monto_original: transaccionOriginal.monto,
    monto_comision: calcularComisionBold(transaccionOriginal.monto),
    descripcion: 'Comisión Transacción Bold + Retenciones Est.',
    categoria: 'Costos Venta',
    sub_categoria: 'Costos Venta',
    tipo: 'Egreso',
    medio_pago: transaccionOriginal.medio_pago,
    comentarios: `Costo de Transacción (CTT) del 5.0% aplicado. Original: ${transaccionOriginal.monto}`,
    parent_id: parentId,
  }
}

export const TransaccionItemSchema = z.object({
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

export const LoteTransaccionesSchema = z.object({
  transacciones: z.array(TransaccionItemSchema).min(1, 'Al menos una transacción requerida'),
})

export type TransaccionItem = z.infer<typeof TransaccionItemSchema>
export type LoteTransaccionesData = z.infer<typeof LoteTransaccionesSchema>

export const tools = {
  registrar_lote_transacciones: {
    description: 'Registra múltiples transacciones a partir de un dictamen de Gema',
    inputSchema: LoteTransaccionesSchema,
  },
} as const