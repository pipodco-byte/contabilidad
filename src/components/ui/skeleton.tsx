'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-zinc-900/50 rounded-lg animate-pulse ${className}`}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="border-l-4 bg-zinc-950/80 border border-zinc-800/50 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-zinc-800/30">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-zinc-950/80 border border-zinc-800/50 rounded-xl p-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

export function TransactionTableSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
      <div className="p-6 border-b border-zinc-800/50">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-2 ml-auto">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
      <div className="hidden md:block p-4">
        {[...Array(5)].map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
      <div className="md:hidden p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-zinc-800/50">
            <div className="flex justify-between mb-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-zinc-800/50">
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  );
}
