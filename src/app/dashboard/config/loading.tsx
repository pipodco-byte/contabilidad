'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-8 w-48 bg-zinc-800/50 rounded" />
      <Skeleton className="h-32 bg-zinc-800/50 rounded-xl" />
      <Skeleton className="h-48 bg-zinc-800/50 rounded-xl" />
    </div>
  )
}
