export const CATEGORIAS = {
  INGRESO: [
    { nombre: 'Ventas', subcategorias: ['Venta Equipos', 'Accesorios', 'Reparación'] },
  ],
  EGRESO: [
    { nombre: 'Egresos Negocio', subcategorias: ['Publicidad', 'Costos Venta', 'Infraestructura'] },
    { nombre: 'Egresos Personales', subcategorias: ['Retiros Felipe'] },
  ],
};

export const MEDIOS_PAGO = ['Bancolombia', 'Davivienda', 'Bold', 'Efectivo', 'Transferencia'];

export const ESTADOS_IVA = ['Exento', 'Incluido', 'Discriminado', 'N/A'];

export const BOLD_COMMISSION = parseFloat(process.env.NEXT_PUBLIC_BOLD_COMMISSION || '5.0');
