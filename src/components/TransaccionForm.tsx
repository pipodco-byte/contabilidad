'use client';

import { useState } from 'react';
import { useTransacciones } from '@/hooks/useTransacciones';

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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
      <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Nueva Transacción</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => {
              const newTipo = e.target.value as 'Ingreso' | 'Egreso';
              setTipo(newTipo);
              const firstCat = Object.keys(CATEGORIAS[newTipo])[0];
              setCategoria(firstCat);
              setSubCategoria(CATEGORIAS[newTipo][firstCat as keyof typeof CATEGORIAS[typeof newTipo]][0]);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Descripción</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              const subs = categoriaObj[e.target.value as keyof typeof categoriaObj];
              setSubCategoria(subs[0]);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Object.keys(categoriaObj).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Sub-categoría</label>
          <select
            value={subCategoria}
            onChange={(e) => setSubCategoria(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {subcategorias.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Monto</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Cantidad (opcional)</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: 5 equipos"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Medio de Pago</label>
          <select
            value={medioPago}
            onChange={(e) => setMedioPago(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MEDIOS_PAGO.map((medio) => (
              <option key={medio} value={medio}>
                {medio}
              </option>
            ))}
          </select>
          {medioPago === 'Bold' && (
            <p className="text-xs text-amber-400 mt-2">⚠️ Se aplicará comisión del 5.0%</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Estado IVA</label>
          <select
            value={estadoIva}
            onChange={(e) => setEstadoIva(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {ESTADOS_IVA.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Comentarios</label>
        <textarea
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          rows={2}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors"
      >
        {loading ? 'Guardando...' : 'Guardar Transacción'}
      </button>
    </form>
  );
}
