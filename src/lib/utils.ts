import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'dd/MM/yyyy', { locale: es });
}

export function formatDateLong(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'EEEE, d MMMM yyyy', { locale: es });
}

export function calcularComision(monto: number, porcentaje: number): number {
  return Math.round(monto * (porcentaje / 100));
}
