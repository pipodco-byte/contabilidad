'use client';

import * as React from 'react';
import { Bot, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StrategySidebarButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const springTransition = {
  type: 'spring' as const,
  damping: 20,
  stiffness: 300,
  mass: 0.8,
};

export function StrategySidebarButton({ isOpen, onToggle }: StrategySidebarButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors',
          isOpen
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <Bot className="h-5 w-5" />
        <span className="sr-only">IA Strategy</span>

        {isOpen && (
          <motion.span
            layoutId="strategy-active-indicator"
            className="absolute inset-0 rounded-lg border-2 border-accent"
            transition={prefersReducedMotion ? { duration: 0 } : springTransition}
          />
        )}
      </motion.button>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors" onClick={onToggle}>
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">IA Strategy</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>IA Strategy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
