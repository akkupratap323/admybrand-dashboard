import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  )
}

function SkeletonMetricCard() {
  return (
    <div className="p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-2 w-2 rounded-full" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-4 p-4 border rounded">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded">
            <Skeleton className="h-4 w-8" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonMetricCard, SkeletonChart, SkeletonTable }