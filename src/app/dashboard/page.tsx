'use client';

import { useAuth } from '@/hooks/useAuth';
import { useResumen } from '@/hooks/useResumen';
import { TransaccionForm } from '@/components/forms/transaccion-form';
import { TransactionTable } from '@/components/tables/transaction-table';
import { Graficas } from '@/components/Graficas';
import { ReportsTabs } from '@/components/reports/reports-tabs';
import { AppShell } from '@/components/layout';
import { DashboardCards } from '@/components/dashboard/dashboard-cards';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Gem, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { resumen } = useResumen(user?.id || '', user?.rol || 'usuario');
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showInforme, setShowInforme] = useState<'anual' | 'mensual' | null>(null);
  const [showGema, setShowGema] = useState(false);
  const [gemaInput, setGemaInput] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [gemaLoading, setGemaLoading] = useState(false);
  const [gemaMessage, setGemaMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  const isAdmin = user.rol === 'admin';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleGemaImport = async () => {
    setGemaLoading(true);

    try {
      if (!gemaInput.trim()) {
        setGemaMessage({ type: 'error', text: 'Por favor pega datos de Gema' });
        setGemaLoading(false);
        return;
      }

      const lines = gemaInput.trim().split('\n').filter((l) => l.trim());

      const transacciones = lines.map((line) => {
        const parts = line.split(';');
        const [fecha, descripcion, categoria, sub_categoria, monto, tipo, medio_pago, estado_iva, comentarios] = parts;

        let formattedFecha = fecha?.trim() || '';

        if (formattedFecha.includes('/')) {
          const [day, month, year] = formattedFecha.split('/');
          formattedFecha = `${year}-${month}-${day}`;
        }

        return {
          fecha: formattedFecha,
          descripcion: descripcion?.trim() || '',
          categoria: categoria?.trim() || '',
          sub_categoria: sub_categoria?.trim() || '',
          monto: parseFloat(monto) || 0,
          tipo: tipo?.trim() || '',
          medio_pago: medio_pago?.trim() || '',
          estado_iva: estado_iva?.trim() || '',
          comentarios: comentarios?.trim() || '',
        };
      });

      const bodyString = JSON.stringify({ transacciones, userId: user.id });

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('/api/gema/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyString,
        signal: controller.signal,
      });

      clearTimeout(id);

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al importar');

      setGemaMessage({ type: 'success', text: `✓ ${data.count} transacciones importadas` });
      setGemaInput('');
      setRefreshKey((k) => k + 1);
      setTimeout(() => setShowGema(false), 2000);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setGemaMessage({ type: 'error', text: 'Timeout: El servidor tardó demasiado' });
      } else {
        setGemaMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al importar' });
      }
    } finally {
      setGemaLoading(false);
    }
  };

  return (
    <AppShell user={user}>
      {isAdmin && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-sm text-primary">
            ✨ Acceso de administrador activado
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={() => setShowGema(!showGema)}>
          <Gem className="mr-2 h-4 w-4" />
          Gema
        </Button>

        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            Nueva Transacción
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => setShowInforme(showInforme === 'anual' ? null : 'anual')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Informe Anual
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowInforme(showInforme === 'mensual' ? null : 'mensual')}
        >
          Informe Mensual
        </Button>
      </div>

      {/* Gema Input */}
      {showGema && (
        <div className="mb-6 flex gap-3 p-4 border rounded-xl">
          <textarea
            value={gemaInput}
            onChange={(e) => setGemaInput(e.target.value)}
            placeholder="Pega aquí el output de Gema de Contabilidad..."
            className="flex-1 px-4 py-3 border rounded-lg resize-none"
            rows={4}
          />
          <div className="flex flex-col gap-2">
            <Button onClick={handleGemaImport} disabled={gemaLoading}>
              {gemaLoading ? 'Importando...' : 'Enviar'}
            </Button>
            {gemaMessage && (
              <p className={`text-sm ${gemaMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {gemaMessage.text}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="mb-6">
          <TransaccionForm
            userId={user.id}
            onSuccess={() => {
              setShowForm(false);
              setRefreshKey((k) => k + 1);
            }}
          />
        </div>
      )}

      {/* KPI Cards */}
      <DashboardCards
        totalIngresos={resumen.totalIngresos}
        totalEgresos={resumen.totalEgresos}
        balance={resumen.balance}
        formatCurrency={formatCurrency}
      />

      {/* Lista de Transacciones */}
      <div className="mb-6">
        <TransactionTable key={refreshKey} userId={user.id} userRole={user.rol} />
      </div>

      {/* Gráficas */}
      <div className="mb-6">
        <Graficas key={refreshKey} userId={user.id} userRole={user.rol} />
      </div>

      {/* Informes */}
      {showInforme && (
        <div className="mb-6">
          <ReportsTabs userId={user.id} userRole={user.rol} />
        </div>
      )}
    </AppShell>
  );
}