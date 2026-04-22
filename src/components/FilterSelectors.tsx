'use client';

import { RotateCcw } from 'lucide-react';

interface FilterSelectorsProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onReset: () => void;
}

const MONTHS = [
  { num: 1, label: 'Enero' },
  { num: 2, label: 'Febrero' },
  { num: 3, label: 'Marzo' },
  { num: 4, label: 'Abril' },
  { num: 5, label: 'Mayo' },
  { num: 6, label: 'Junio' },
  { num: 7, label: 'Julio' },
  { num: 8, label: 'Agosto' },
  { num: 9, label: 'Septiembre' },
  { num: 10, label: 'Octubre' },
  { num: 11, label: 'Noviembre' },
  { num: 12, label: 'Diciembre' },
];

export function FilterSelectors({ selectedYear, selectedMonth, onYearChange, onMonthChange, onReset }: FilterSelectorsProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2023 }, (_, i) => 2024 + i);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className="px-3 py-2 bg-transparent border border-white/10 text-zinc-300 hover:border-violet-500/40 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors cursor-pointer dark:[color-scheme:dark]"
      >
        {years.map((year) => (
          <option key={year} value={year} className="bg-zinc-900 text-zinc-100">
            {year}
          </option>
        ))}
      </select>

      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(parseInt(e.target.value))}
        className="px-3 py-2 bg-transparent border border-white/10 text-zinc-300 hover:border-violet-500/40 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors cursor-pointer dark:[color-scheme:dark]"
      >
        {MONTHS.map(({ num, label }) => (
          <option key={num} value={num} className="bg-zinc-900 text-zinc-100">
            {label}
          </option>
        ))}
      </select>

      <button
        onClick={onReset}
        className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-colors"
        title="Restablecer filtros"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
