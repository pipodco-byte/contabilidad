'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface FilterCarouselProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

const MONTHS = [
  { num: 1, label: 'Ene' },
  { num: 2, label: 'Feb' },
  { num: 3, label: 'Mar' },
  { num: 4, label: 'Abr' },
  { num: 5, label: 'May' },
  { num: 6, label: 'Jun' },
  { num: 7, label: 'Jul' },
  { num: 8, label: 'Ago' },
  { num: 9, label: 'Sep' },
  { num: 10, label: 'Oct' },
  { num: 11, label: 'Nov' },
  { num: 12, label: 'Dic' },
];

export function FilterCarousel({ selectedYear, selectedMonth, onYearChange, onMonthChange }: FilterCarouselProps) {
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthScrollRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-card backdrop-blur-md border border-border rounded-2xl p-6 space-y-6">
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3">Año</label>
        <div className="flex items-center gap-3">
          <button onClick={() => scroll(yearScrollRef, 'left')} className="p-2 hover:bg-muted rounded-xl transition">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div ref={yearScrollRef} className="flex gap-2 overflow-x-auto scroll-smooth flex-1 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => onYearChange(year)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap font-semibold transition-all flex-shrink-0 ${
                  selectedYear === year
                    ? 'bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-[0_0_15px_-3px_rgba(139,92,246,0.4)] hover:shadow-[0_0_20px_-3px_rgba(139,92,246,0.5)] transition-all duration-300 border-t border-white/20'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <button onClick={() => scroll(yearScrollRef, 'right')} className="p-2 hover:bg-muted rounded-xl transition">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3">Mes</label>
        <div className="flex items-center gap-3">
          <button onClick={() => scroll(monthScrollRef, 'left')} className="p-2 hover:bg-muted rounded-xl transition">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div ref={monthScrollRef} className="flex gap-2 overflow-x-auto scroll-smooth flex-1 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {MONTHS.map(({ num, label }) => (
              <button
                key={num}
                onClick={() => onMonthChange(num)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap font-semibold transition-all flex-shrink-0 ${
                  selectedMonth === num
                    ? 'bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-[0_0_15px_-3px_rgba(139,92,246,0.4)] hover:shadow-[0_0_20px_-3px_rgba(139,92,246,0.5)] transition-all duration-300 border-t border-white/20'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => scroll(monthScrollRef, 'right')} className="p-2 hover:bg-muted rounded-xl transition">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
