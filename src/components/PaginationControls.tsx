'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  onFirstPage: () => void;
  onLastPage: () => void;
}

export function PaginationControls({ currentPage, totalPages, totalItems, onPrevPage, onNextPage, onGoToPage, onFirstPage, onLastPage }: PaginationControlsProps) {
  const startItem = (currentPage - 1) * 20 + 1;
  const endItem = Math.min(currentPage * 20, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-4 py-4 px-6 bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800 rounded-2xl">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Mostrando <span className="font-semibold text-zinc-900 dark:text-zinc-100">{startItem}</span> a{' '}
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{endItem}</span> de{' '}
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalItems}</span> registros
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onFirstPage}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Primera página"
        >
          <ChevronsLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>

        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>

        <div className="flex gap-1">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onGoToPage(page)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentPage === page
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>

        <button
          onClick={onLastPage}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Última página"
        >
          <ChevronsRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    </div>
  );
}
