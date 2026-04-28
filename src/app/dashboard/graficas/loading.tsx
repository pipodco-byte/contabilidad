'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-8 w-32 rounded" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
  )
}
