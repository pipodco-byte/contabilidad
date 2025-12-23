import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useExportarPDF() {
  const exportarTransaccionesPDF = useCallback(async (userId: string, userRole: string) => {
    try {
      let query = supabase
        .from('transacciones')
        .select('*');

      if (userRole !== 'admin') {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.order('fecha', { ascending: false });

      if (error || !data || data.length === 0) {
        alert('No hay transacciones para exportar');
        return;
      }

      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
        }).format(value);
      };

      const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-CO');
      };

      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Reporte de Transacciones</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #10b981; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #10b981; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:hover { background-color: #f5f5f5; }
            .ingreso { color: #10b981; font-weight: bold; }
            .egreso { color: #6366f1; font-weight: bold; }
            .total { background-color: #f0f0f0; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Reporte de Transacciones - Pipod Contabilidad</h1>
          <p>Fecha de generación: ${new Date().toLocaleDateString('es-CO')}</p>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Medio de Pago</th>
              </tr>
            </thead>
            <tbody>
      `;

      let totalIngresos = 0;
      let totalEgresos = 0;

      data.forEach((t) => {
        const clase = t.tipo === 'Ingreso' ? 'ingreso' : 'egreso';
        html += `
          <tr>
            <td>${formatDate(t.fecha)}</td>
            <td>${t.descripcion}</td>
            <td>${t.categoria}</td>
            <td class="${clase}">${t.tipo}</td>
            <td class="${clase}">${formatCurrency(t.monto)}</td>
            <td>${t.medio_pago}</td>
          </tr>
        `;

        if (t.tipo === 'Ingreso') {
          totalIngresos += t.monto;
        } else {
          totalEgresos += t.monto;
        }
      });

      const balance = totalIngresos - totalEgresos;

      html += `
            </tbody>
          </table>
          <table style="margin-top: 30px; width: 50%;">
            <tr class="total">
              <td>Total Ingresos:</td>
              <td class="ingreso">${formatCurrency(totalIngresos)}</td>
            </tr>
            <tr class="total">
              <td>Total Egresos:</td>
              <td class="egreso">${formatCurrency(totalEgresos)}</td>
            </tr>
            <tr class="total">
              <td>Balance:</td>
              <td style="color: ${balance >= 0 ? '#10b981' : '#6366f1'}; font-weight: bold;">${formatCurrency(balance)}</td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transacciones_${new Date().toISOString().split('T')[0]}.pdf`;
      
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.print();
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar transacciones');
    }
  }, []);

  return { exportarTransaccionesPDF };
}
