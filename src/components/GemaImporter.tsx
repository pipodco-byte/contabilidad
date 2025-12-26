'use client';

import { useState } from 'react';
import { Gem, Plus, FileText, Download } from 'lucide-react';

export function GemaImporter() {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim()) {
      console.log('Agregando:', inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Fila de Botones */}
      <div className="flex flex-wrap gap-3">
        {/* Botón Gema - Destacado */}
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-emerald-500/30">
          <Gem size={20} />
          Gema
        </button>

        {/* Botón Nueva Transacción */}
        <button
          onClick={() => setShowInput(!showInput)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          Nueva Transacción
        </button>

        {/* Botón Reportes */}
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg font-semibold transition-colors">
          <FileText size={20} />
          Reportes
        </button>

        {/* Botón Descargar */}
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg font-semibold transition-colors">
          <Download size={20} />
          Descargar
        </button>
      </div>

      {/* Input y Botón Agregar - Aparece al hacer clic en Nueva Transacción */}
      {showInput && (
        <div className="flex gap-3 p-4 bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 rounded-2xl">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pega aquí el output de Gema de Contabilidad..."
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            rows={4}
          />
          <button
            onClick={handleAddItem}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors self-start"
          >
            Agregar
          </button>
        </div>
      )}
    </div>
  );
}
