'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: 'chart' | 'table' | 'search';
}

export function EmptyState({ title, description, action, icon = 'table' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-zinc-600 mb-6"
      >
        {icon === 'table' && (
          <>
            <rect x="20" y="30" width="80" height="60" rx="4" />
            <line x1="20" y1="50" x2="100" y2="50" />
            <line x1="50" y1="50" x2="50" y2="90" />
            <line x1="70" y1="50" x2="70" y2="90" />
            <circle cx="35" cy="40" r="3" fill="currentColor" stroke="none" />
            <circle cx="60" cy="40" r="3" fill="currentColor" stroke="none" />
            <circle cx="85" cy="40" r="3" fill="currentColor" stroke="none" />
          </>
        )}
        {icon === 'chart' && (
          <>
            <path d="M20 80 L40 60 L60 70 L80 40 L100 30" />
            <path d="M20 90 L20 30 M20 90 L100 90" />
            <circle cx="40" cy="60" r="3" fill="currentColor" stroke="none" />
            <circle cx="60" cy="70" r="3" fill="currentColor" stroke="none" />
            <circle cx="80" cy="40" r="3" fill="currentColor" stroke="none" />
          </>
        )}
        {icon === 'search' && (
          <>
            <circle cx="50" cy="50" r="25" />
            <line x1="70" y1="70" x2="95" y2="95" strokeWidth="4" />
            <line x1="38" y1="38" x2="62" y2="62" strokeWidth="4" opacity="0.3" />
          </>
        )}
      </svg>

      <h3 className="text-xl font-semibold text-zinc-200 mb-2">{title}</h3>
      <p className="text-zinc-500 text-center max-w-md mb-6">{description}</p>

      {action && (
        <Button
          onClick={action.onClick}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
}