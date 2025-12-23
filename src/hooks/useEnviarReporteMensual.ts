import { useState } from 'react';

export function useEnviarReporteMensual() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const enviarReporte = async (mes: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes, action: 'enviar-reporte' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al enviar reporte');
      }

      alert('Reporte enviado a Felipe exitosamente');
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { enviarReporte, loading, error };
}
