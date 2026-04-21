'use client';

import { RotateCcw, Check } from 'lucide-react';

interface FilterSelectorsProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onApply: () => void;
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

export function FilterSelectors({ selectedYear, selectedMonth, onYearChange, onMonthChange, onApply, onReset }: FilterSelectorsProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2023 }, (_, i) => 2024 + i);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(parseInt(e.target.value))}
        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
      >
        {MONTHS.map(({ num, label }) => (
          <option key={num} value={num}>
            {label}
          </option>
        ))}
      </select>

      <button
        onClick={onApply}
        className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        title="Aplicar filtros"
      >
        <Check className="w-4 h-4" />
      </button>

      <button
        onClick={onReset}
        className="p-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-lg transition-colors"
        title="Deshacer filtros"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
