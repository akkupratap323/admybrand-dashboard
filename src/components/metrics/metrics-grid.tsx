"use client"

import { useRealtimeUpdates } from "@/lib/hooks/use-realtime-updates"
import { motion } from "framer-motion"
import { MetricsCard, RevenueCard, UsersCard, ConversionsCard } from "./metrics-card"
import { TrendingUp, Activity } from "lucide-react"


export function MetricsGrid() {
  const { data, loading } = useRealtimeUpdates(5000)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
    >
      <RevenueCard
        value={data?.metrics.revenue ?? 48750}
        change={data?.metrics.revenueGrowth ?? 12.5}
        trend={(data?.metrics.revenueGrowth ?? 12.5) >= 0 ? "up" : "down"}
        loading={loading}
        description="Monthly recurring revenue"
      />
      
      <UsersCard
        value={data?.metrics.users ?? 12847}
        change={data?.metrics.userGrowth ?? 8.2}
        trend={(data?.metrics.userGrowth ?? 8.2) >= 0 ? "up" : "down"}
        loading={loading}
        description="Active monthly users"
      />
      
      <ConversionsCard
        value={data?.metrics.conversionRate ?? 3.4}
        change={2.1}
        trend="up"
        loading={loading}
        description="Average conversion rate"
      />
      
      <MetricsCard
        title="Page Views"
        value={156820}
        change={15.3}
        trend="up"
        icon={Activity}
        color="orange"
        loading={loading}
        description="Total monthly page views"
      />
    </motion.div>
  )
}