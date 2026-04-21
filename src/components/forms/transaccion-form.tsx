'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTransacciones } from '@/hooks/useTransacciones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CATEGORIAS = {
  Ingreso: {
    'Venta Equipos Nuevos': ['Computadoras', 'MacBooks', 'iMacs', 'iPhones', 'iPads', 'AirPods', 'Smartwatches', 'Otros'],
    'Venta Equipos Usados': ['Computadoras', 'MacBooks', 'iMacs', 'iPhones', 'iPads', 'AirPods', 'Smartwatches', 'Otros'],
    'Venta Accesorios': ['Accesorios'],
    'Servicios Técnicos': ['Computadoras', 'MacBooks', 'iMacs', 'iPhones', 'iPads', 'AirPods', 'Smartwatches', 'Otros'],
    'Otros Servicios': ['Consultoría', 'Soporte', 'Otros'],
  },
  Egreso: {
    'Plan Retoma': ['iPhone', 'MacBooks', 'iMacs', 'iPad', 'AirPods', 'Portátiles', 'Smartphones', 'Otros'],
    'Compra Equipos': ['Equipos Nuevos', 'Equipos Usados', 'Accesorios'],
    'Marketing': ['Publicidad Digital', 'Redes Sociales', 'Otros'],
    'Operación': ['Alquiler', 'Servicios', 'Suministros'],
    'Nómina': ['Pago Samuel', 'Pago Josué', 'Otros Empleados'],
    'Otros Gastos': ['Varios'],
  },
};

const MEDIOS_PAGO = ['Bancolombia', 'Davivienda', 'Bre-B', 'Bold', 'Efectivo', 'Transferencia'];
const ESTADOS_IVA = ['Exento', 'Incluido', 'Discriminado', 'N/A'];

interface TransaccionFormProps {
  userId: string;
  onSuccess?: () => void;
}

export function TransaccionForm({ userId, onSuccess }: TransaccionFormProps) {
  const [tipo, setTipo] = useState<'Ingreso' | 'Egreso'>('Ingreso');
  const [categoria, setCategoria] = useState('Venta Equipos Nuevos');
  const [subCategoria, setSubCategoria] = useState('Computadoras');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [medioPago, setMedioPago] = useState('Efectivo');
  const [estadoIva, setEstadoIva] = useState('Exento');
  const [comentarios, setComentarios] = useState('');

  const { crearTransaccion, loading, error } = useTransacciones(userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await crearTransaccion({
      fecha,
      descripcion,
      categoria,
      sub_categoria: subCategoria,
      monto: parseFloat(monto),
      tipo,
      medio_pago: medioPago,
      estado_iva: estadoIva,
      comentarios: cantidad ? `Cantidad: ${cantidad}. ${comentarios}` : comentarios,
    });

    if (success) {
      setDescripcion('');
      setMonto('');
      setCantidad('');
      setComentarios('');
      onSuccess?.();
    }
  };

  const categoriaObj = CATEGORIAS[tipo];
  const subcategorias: string[] = categoriaObj[categoria as keyof typeof categoriaObj] || [];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onSubmit={handleSubmit}
      className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/50 rounded-xl p-6 space-y-5"
    >
      <h2 className="text-lg font-semibold text-zinc-100 mb-2">Nueva Transacción</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-zinc-400 uppercase text-xs tracking-wider block">Tipo</label>
          <div className="flex rounded-lg overflow-hidden border border-zinc-800/50">
            <button
              type="button"
              onClick={() => {
                setTipo('Ingreso');
                const firstCat = Object.keys(CATEGORIAS.Ingreso)[0];
                setCategoria(firstCat);
                setSubCategoria(CATEGORIAS.Ingreso[firstCat as keyof typeof CATEGORIAS.Ingreso][0]);
              }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tipo === 'Ingreso'
                  ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-400'
                  : 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-300'
              }`}
            >
              Ingreso
            </button>
            <button
              type="button"
              onClick={() => {
                setTipo('Egreso');
                const firstCat = Object.keys(CATEGORIAS.Egreso)[0];
                setCategoria(firstCat);
                setSubCategoria(CATEGORIAS.Egreso[firstCat as keyof typeof CATEGORIAS.Egreso][0]);
              }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tipo === 'Egreso'
                  ? 'bg-rose-500/20 text-rose-400 border-b-2 border-rose-400'
                  : 'bg-zinc-900/50 text-zinc-400 hover:text-zinc-300'
              }`}
            >
              Gasto
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-zinc-400 uppercase text-xs tracking-wider block">Fecha</label>
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="bg-zinc-900/50 border-zinc-800/50 focus:border-violet-500/50 text-zinc-100"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-zinc-400 uppercase text-xs tracking-wider block">Descripción</label>
        <Input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción de la transacción"
          className="bg-zinc-900/50 border-zinc-800/50 focus:border-violet-500/50 placeholder:text-zinc-600 text-zinc-100"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-zinc-400 uppercase text-xs tracking-wider block">Categoría</label>
          <Select value={categoria} onValueChange={(val) => {
            setCategoria(val);
            const subs = categoriaObj[val as keyof typeof categoriaObj];
            setSubCategoria(subs[0]);
          }}>
            <SelectTrigger className="bg-zinc-900/50 border-zinc-800/50 focus:border-violet-500/50 text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800/50 text-zinc-100">
              {Object.keys(categoriaObj).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-zinc-400 uppercase text-xs tracking-wider block">Sub-categoría</label>
          <Select value={subCategoria} onValueChange={setSubCategoria}>
            <SelectTrigger className="bg-zinc-900/50 border-zinc-800/50 focus:border-violet-500/50 text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800/50 text-zinc-100">
              {subcategorias.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-zinc-400 uppercase text-xs tracking-wider block">Monto</label>
          <Input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="0.00"
            className="bg-zinc-900/50 border-zinc-800/50 focus:border-violet-500/50 placeholder:text-zinc-600 text-zinc-100 font-mono"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-zinc-400 uppercase text-xs tracking-wider block">Cantidad (opcional)</label>
          <Input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="Ej: 5"
            className="bg-zinc-900/50 border-zinc-800/50 focus:border-violet-500/50 placeholder:text-zinc-600 text-zinc-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-zinc-400 uppercase text-xs tracking-wider block">Medio de Pago</label>
          <Select value={medioPago} onValueChange={setMedioPago}>
            <SelectTrigger className="bg-zinc-900/50 border-zinc-800/50 focus:border-violet-500/50 text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800/50 text-zinc-100">
              {MEDIOS_PAGO.map((medio) => (
                <SelectItem key={medio} value={medio}>
                  {medio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {medioPago === 'Bold' && (
            <p className="text-xs text-amber-400 mt-2">Se aplicará comisión del 5.0%</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-zinc-400 uppercase text-xs tracking-wider block">Estado IVA</label>
          <Select value={estadoIva} onValueChange={setEstadoIva}>
            <SelectTrigger className="bg-zinc-900/50 border-zinc-800/50 focus:border-violet-500/50 text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800/50 text-zinc-100">
              {ESTADOS_IVA.map((estado) => (
                <SelectItem key={estado} value={estado}>
                  {estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-zinc-400 uppercase text-xs tracking-wider block">Comentarios</label>
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          placeholder="Comentarios adicionales..."
          rows={2}
          className="w-full rounded-md border border-zinc-800/50 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50 resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 text-white font-medium shadow-glow hover:scale-[1.02] transition-transform"
      >
        {loading ? 'Guardando...' : 'Guardar Transacción'}
      </Button>
    </motion.form>
  );
}