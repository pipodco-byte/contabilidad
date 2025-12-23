import { z } from 'zod';

export const transaccionSchema = z.object({
  descripcion: z.string().min(1, 'Descripción requerida'),
  monto: z.number().positive('Monto debe ser positivo'),
  fecha: z.date().max(new Date(), 'Fecha no puede ser futura'),
  categoria: z.string().min(1, 'Categoría requerida'),
  sub_categoria: z.string().min(1, 'Sub-categoría requerida'),
  tipo: z.enum(['Ingreso', 'Egreso']),
  medio_pago: z.string().min(1, 'Medio de pago requerido'),
  estado_iva: z.enum(['Exento', 'Incluido', 'Discriminado', 'N/A']),
  comentarios: z.string().optional(),
});

export type TransaccionInput = z.infer<typeof transaccionSchema>;
