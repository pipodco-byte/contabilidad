import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useExportarExcel() {
  const exportarTransacciones = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('transacciones')
        .select('*')
        .eq('user_id', userId)
        .order('fecha', { ascending: false });

      if (!data || data.length === 0) {
        alert('No hay transacciones para exportar');
        return;
      }

      // Crear CSV
      const headers = [
        'Fecha',
        'Descripción',
        'Categoría',
        'Sub-categoría',
        'Tipo',
        'Monto',
        'Medio de Pago',
        'Estado IVA',
        'Comentarios',
      ];

      const rows = data.map((t) => [
        new Date(t.fecha).toLocaleDateString('es-CO'),
        t.descripcion,
        t.categoria,
        t.sub_categoria,
        t.tipo,
        t.monto,
        t.medio_pago,
        t.estado_iva,
        t.comentarios || '',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map((row) =>
          row
            .map((cell) => {
              if (typeof cell === 'string' && cell.includes(',')) {
                return `"${cell}"`;
              }
              return cell;
            })
            .join(',')
        ),
      ].join('\n');

      // Descargar
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `transacciones_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar transacciones');
    }
  }, []);

  return { exportarTransacciones };
}
