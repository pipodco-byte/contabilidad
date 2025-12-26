'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTema } from '@/hooks/useTema';
import { useResumen } from '@/hooks/useResumen';
import { TransaccionForm } from '@/components/TransaccionForm';
import { ListaTransacciones } from '@/components/ListaTransacciones';
import { Graficas } from '@/components/Graficas';
import { InformeAnual } from '@/components/InformeAnual';
import { InformeMensual } from '@/components/InformeMensual';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, Scale, LogOut, Moon, Sun, Gem, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const { tema, toggleTema, mounted } = useTema();
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

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
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
    if (!gemaInput.trim()) {
      setGemaMessage({ type: 'error', text: 'Por favor pega datos de Gema' });
      return;
    }

    setGemaLoading(true);
    setGemaMessage(null);

    try {
      const lines = gemaInput.trim().split('\n').filter((l) => l.trim());
      const transacciones = lines.map((line) => {
        const [fecha, descripcion, categoria, sub_categoria, monto, tipo, medio_pago, estado_iva, comentarios] = line.split(';');
        const [day, month, year] = fecha.split('/');
        return {
          fecha: `${year}-${month}-${day}`,
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

      const response = await fetch('/api/transacciones/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transacciones, userId: user.id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al importar');

      setGemaMessage({ type: 'success', text: `✓ ${data.count} transacciones importadas` });
      setGemaInput('');
      setRefreshKey((k) => k + 1);
      setTimeout(() => setShowGema(false), 2000);
    } catch (error) {
      setGemaMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error al importar' });
    } finally {
      setGemaLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200/60 dark:border-slate-800/50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Gem size={28} className="text-emerald-500 dark:text-emerald-400" />
              <div className="absolute inset-0 bg-emerald-500 dark:bg-emerald-400 rounded-full blur-lg opacity-40 dark:opacity-30 -z-10" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 dark:from-emerald-400 to-teal-600 dark:to-teal-400 bg-clip-text text-transparent">
              Pipod Contabilidad
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTema}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors text-slate-600 dark:text-slate-300"
            >
              {tema === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="text-right">
              <p className="text-slate-900 dark:text-slate-100 font-medium">{user.nombre}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isAdmin ? '👑 Admin' : '👤 Usuario'}
              </p>
            </div>
            <button
              onClick={signOut}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors text-slate-600 dark:text-slate-300"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {isAdmin && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 rounded-2xl backdrop-blur-md">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              ✨ Acceso de administrador activado
            </p>
          </div>
        )}

        {/* Botones de Acción - Prominentes */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Botón Gema */}
          <button
            onClick={() => setShowGema(!showGema)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-medium transition-all shadow-lg hover:shadow-emerald-500/30 dark:hover:shadow-emerald-500/20"
          >
            <Gem size={20} />
            Gema
          </button>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-medium transition-all shadow-lg hover:shadow-emerald-500/30 dark:hover:shadow-emerald-500/20"
            >
              ➕ Nueva Transacción
            </button>
          )}
          <button
            onClick={() => setShowInforme(showInforme === 'anual' ? null : 'anual')}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-medium transition-all shadow-lg hover:shadow-amber-500/30 dark:hover:shadow-amber-500/20 flex items-center gap-2"
          >
            <FileText size={20} />
            Informe Anual
          </button>
          <button
            onClick={() => setShowInforme(showInforme === 'mensual' ? null : 'mensual')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-medium transition-all shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/20"
          >
            Informe Mensual
          </button>
        </div>

        {/* Gema Input */}
        {showGema && (
          <div className="mb-8 flex gap-3 p-4 bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 rounded-2xl">
            <textarea
              value={gemaInput}
              onChange={(e) => setGemaInput(e.target.value)}
              placeholder="Pega aquí el output de Gema de Contabilidad..."
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
              rows={4}
            />
            <div className="flex flex-col gap-2 self-start">
              <button
                onClick={handleGemaImport}
                disabled={gemaLoading}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg font-semibold transition-colors"
              >
                {gemaLoading ? 'Importando...' : 'Enviar'}
              </button>
              {gemaMessage && (
                <p className={`text-sm font-medium ${gemaMessage.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {gemaMessage.text}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Formulario */}
        {showForm && (
          <div className="mb-8">
            <TransaccionForm
              userId={user.id}
              onSuccess={() => {
                setShowForm(false);
                setRefreshKey((k) => k + 1);
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Ingresos */}
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 hover:border-slate-300/60 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-500 dark:text-slate-300 text-sm mb-1">Ingresos</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(resumen.totalIngresos)}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg">
                <TrendingUp size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Egresos */}
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 hover:border-slate-300/60 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-500 dark:text-slate-300 text-sm mb-1">Egresos</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(resumen.totalEgresos)}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg">
                <Scale size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 hover:border-slate-300/60 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-500 dark:text-slate-300 text-sm mb-1">Balance</p>
                <p
                  className={`text-3xl font-bold ${
                    resumen.balance >= 0
                      ? 'text-emerald-600 dark:text-emerald-300'
                      : 'text-indigo-600 dark:text-indigo-300'
                  }`}
                >
                  {formatCurrency(resumen.balance)}
                </p>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                <Wallet size={24} className="text-slate-600 dark:text-slate-300" />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}

        {/* Lista de Transacciones - Prominente */}
        <div className="mb-8">
          <ListaTransacciones key={refreshKey} userId={user.id} userRole={user.rol} />
        </div>

        {/* Gráficas */}
        <div className="mb-8">
          <Graficas key={refreshKey} userId={user.id} userRole={user.rol} />
        </div>

        {/* Informe Anual */}
        {showInforme === 'anual' && (
          <div className="mb-8">
            <InformeAnual userId={user.id} userRole={user.rol} />
          </div>
        )}

        {/* Informe Mensual */}
        {showInforme === 'mensual' && (
          <div className="mb-8">
            <InformeMensual userId={user.id} userRole={user.rol} />
          </div>
        )}
      </main>
    </div>
  );
}
