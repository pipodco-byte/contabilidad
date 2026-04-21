'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInformeAnual } from '@/hooks/useInformeAnual';
import { useInformeMensual } from '@/hooks/useInformeMensual';
import { useEnviarReporteMensual } from '@/hooks/useEnviarReporteMensual';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Download, Send, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface ReportsTabsProps {
  userId: string;
  userRole: string;
}

export function ReportsTabs({ userId, userRole }: ReportsTabsProps) {
  return (
    <Tabs defaultValue="mensual" className="w-full">
      <div className="bg-zinc-950/80 border border-zinc-800/50 rounded-xl p-1">
        <TabsList className="w-full bg-transparent">
          <TabsTrigger
            value="mensual"
            className="ghost data-[state=active]:border-b-2 data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 rounded-lg px-4 py-2"
          >
            Mensual
          </TabsTrigger>
          <TabsTrigger
            value="anual"
            className="ghost data-[state=active]:border-b-2 data-[state=active]:border-violet-500 data-[state=active]:text-violet-400 rounded-lg px-4 py-2"
          >
            Anual
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="mensual" className="mt-6">
        <InformeMensualContent userId={userId} userRole={userRole} />
      </TabsContent>
      <TabsContent value="anual" className="mt-6">
        <InformeAnualContent userId={userId} userRole={userRole} />
      </TabsContent>
    </Tabs>
  );
}

function InformeAnualContent({ userId, userRole }: { userId: string; userRole: string }) {
  const { datosAnuales, loading } = useInformeAnual(userId, userRole);

  if (loading) {
    return (
      <Card className="border-zinc-800/50 bg-zinc-900/50">
        <CardContent className="pt-6 text-center text-zinc-400">
          Cargando informe anual...
        </CardContent>
      </Card>
    );
  }

  if (datosAnuales.length === 0) {
    return (
        <Card className="border-zinc-800/50 bg-zinc-900/50">
        <CardContent className="pt-6 text-center text-zinc-300 font-medium">
          No hay datos para mostrar el informe anual
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  const formatCurrencyCompact = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

  const totalIngresos = datosAnuales.reduce((sum, d) => sum + d.ingresos, 0);
  const totalEgresos = datosAnuales.reduce((sum, d) => sum + d.egresos, 0);
  const totalBalance = totalIngresos - totalEgresos;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ingresos Anuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
              {formatCurrency(totalIngresos)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/20 bg-indigo-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-400 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Egresos Anuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-indigo-400 font-mono tabular-nums">
              {formatCurrency(totalEgresos)}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 ${
            totalBalance >= 0
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-red-500 bg-red-500/5'
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-sm font-medium flex items-center gap-2 ${
                totalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              <Wallet className="h-4 w-4" />
              Balance Anual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold font-mono tabular-nums ${
                totalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {formatCurrency(totalBalance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800/50 bg-zinc-900/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Evolución Mensual</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosAnuales} margin={{ bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis
                dataKey="mes"
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#64748b"
                interval={0}
              />
              <YAxis stroke="#64748b" tickFormatter={(value) => formatCurrencyCompact(value)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                }}
                formatter={(value) => formatCurrency(value as number)}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="#10b981"
                name="Ingresos"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="egresos"
                stroke="#6366f1"
                name="Egresos"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#f59e0b"
                name="Balance"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-zinc-800/50 bg-zinc-900/50 overflow-hidden">
        <CardHeader>
          <CardTitle>Detalle Mensual</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900/80 border-b border-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-400">Mes</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-zinc-400">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-zinc-400">
                    Egresos
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-zinc-400">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {datosAnuales.map((dato, index) => (
                  <tr
                    key={dato.mes}
                    className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${
                      index % 2 === 0 ? 'bg-zinc-900/50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm text-zinc-300 font-medium">{dato.mes}</td>
                    <td className="px-6 py-4 text-sm text-right text-emerald-400 font-medium font-mono tabular-nums">
                      {formatCurrency(dato.ingresos)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-indigo-400 font-medium font-mono tabular-nums">
                      {formatCurrency(dato.egresos)}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-right font-medium font-mono tabular-nums ${
                        dato.balance >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {formatCurrency(dato.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InformeMensualContent({ userId, userRole }: { userId: string; userRole: string }) {
  const { datosMensuales, loading, mes, setMes } = useInformeMensual(userId, userRole);
  const { enviarReporte, loading: enviando } = useEnviarReporteMensual();

  if (loading) {
    return (
      <Card className="border-zinc-800/50 bg-zinc-900/50">
        <CardContent className="pt-6 text-center text-zinc-400">
          Cargando informe mensual...
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);

  const formatCurrencyCompact = (value: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

  const totalIngresos = datosMensuales.reduce((sum, d) => sum + d.ingresos, 0);
  const totalEgresos = datosMensuales.reduce((sum, d) => sum + d.egresos, 0);
  const totalBalance = totalIngresos - totalEgresos;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-400">Mes:</label>
          <input
            type="month"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
        {userRole === 'admin' && (
          <Button
            onClick={() => enviarReporte(mes)}
            disabled={enviando}
            className="bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)] border-t border-white/20 active:scale-95 transition-all duration-200"
          >
            <Send className="h-4 w-4 mr-2" />
            {enviando ? 'Enviando...' : 'Enviar a Felipe'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Ingresos del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
              {formatCurrency(totalIngresos)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/20 bg-indigo-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-400 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Egresos del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-indigo-400 font-mono tabular-nums">
              {formatCurrency(totalEgresos)}
            </p>
          </CardContent>
        </Card>

        <Card
          className={`border-l-4 ${
            totalBalance >= 0
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-red-500 bg-red-500/5'
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-sm font-medium flex items-center gap-2 ${
                totalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              <Wallet className="h-4 w-4" />
              Balance del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold font-mono tabular-nums ${
                totalBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {formatCurrency(totalBalance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {datosMensuales.length > 0 ? (
        <Card className="border-zinc-800/50 bg-zinc-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ingresos vs Egresos por Categoría</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosMensuales} margin={{ bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis
                  dataKey="categoria"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="#64748b"
                  interval={0}
                />
                <YAxis
                  stroke="#64748b"
                  tickFormatter={(value) => formatCurrencyCompact(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="#10b981" name="Ingresos" radius={[8, 8, 0, 0]} />
                <Bar dataKey="egresos" fill="#6366f1" name="Egresos" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-zinc-800/50 bg-zinc-900/50">
          <CardContent className="pt-6 text-center text-zinc-300 font-medium">
            No hay datos para este mes
          </CardContent>
        </Card>
      )}

      {datosMensuales.length > 0 && (
        <Card className="border-zinc-800/50 bg-zinc-900/50 overflow-hidden">
          <CardHeader>
            <CardTitle>Detalle por Categoría</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900/80 border-b border-zinc-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-zinc-400">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-zinc-400">
                      Ingresos
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-zinc-400">
                      Egresos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {datosMensuales.map((dato, index) => (
                    <tr
                      key={dato.categoria}
                      className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${
                        index % 2 === 0 ? 'bg-zinc-900/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-zinc-300 font-medium">
                        {dato.categoria}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-emerald-400 font-medium font-mono tabular-nums">
                        {formatCurrency(dato.ingresos)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-indigo-400 font-medium font-mono tabular-nums">
                        {formatCurrency(dato.egresos)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}