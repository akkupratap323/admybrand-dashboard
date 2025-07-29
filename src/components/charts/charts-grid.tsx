"use client"

import { useRealtimeUpdates } from "@/lib/hooks/use-realtime-updates"
import { AreaChart } from "./area-chart"
import { BarChart } from "./bar-chart"
import { PieChart } from "./pie-chart"

export function ChartsGrid() {
  const { data, loading } = useRealtimeUpdates(5000)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="lg:col-span-2">
        <AreaChart
          title="Revenue Growth"
          data={data?.revenueData ?? []}
          loading={loading}
          valuePrefix="$"
        />
      </div>
      <BarChart
        title="User Growth"
        data={data?.userGrowthData ?? []}
        loading={loading}
      />
      <PieChart
        title="Traffic Sources"
        data={data?.trafficSources ?? []}
        loading={loading}
        dataKey="value"
        nameKey="source"
      />
    </div>
  )
}