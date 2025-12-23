export interface Transaccion {
  id: string;
  user_id: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  sub_categoria: string;
  monto: number;
  tipo: 'Ingreso' | 'Egreso';
  medio_pago: string;
  estado_iva: 'Exento' | 'Incluido' | 'Discriminado' | 'N/A';
  comentarios?: string;
  es_automatico: boolean;
  transaccion_padre_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Producto {
  id: string;
  user_id: string;
  nombre: string;
  precio_compra?: number;
  precio_venta?: number;
  stock_actual: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlantillaTransaccion {
  id: string;
  user_id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  sub_categoria: string;
  monto?: number;
  tipo: 'Ingreso' | 'Egreso';
  medio_pago?: string;
  estado_iva: 'Exento' | 'Incluido' | 'Discriminado' | 'N/A';
  comentarios?: string;
  activo: boolean;
  created_at: string;
}

export interface DashboardData {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  proyeccionMensual: number;
  transaccionesRecientes: Transaccion[];
  graficoTendencia: Array<{
    fecha: string;
    ingresos: number;
    egresos: number;
  }>;
}
