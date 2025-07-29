"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Pause,
  Play,
  Wifi,
  WifiOff,
  Settings
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MetricsCard } from "@/components/metrics/metrics-card"

interface RealTimeMetric {
  id: string
  name: string
  value: number
  previousValue: number
  trend: "up" | "down" | "stable"
  change: number
  unit: string
  prefix?: string
  suffix?: string
  color: "blue" | "green" | "purple" | "orange" | "red"
  icon: React.ComponentType<{ className?: string }>
}

interface RealTimeDashboardProps {
  autoRefresh?: boolean
  refreshInterval?: number
  onMetricClick?: (metric: RealTimeMetric) => void
}

export function RealTimeDashboard({
  autoRefresh = true,
  refreshInterval = 5000,
  onMetricClick
}: RealTimeDashboardProps) {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([])
  const [isConnected, setIsConnected] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate real-time data updates
  const generateMetrics = useCallback((): RealTimeMetric[] => {
    const baseMetrics = [
      {
        id: "revenue",
        name: "Revenue",
        value: 48750 + Math.random() * 10000,
        unit: "currency",
        prefix: "$",
        color: "green" as const,
        icon: DollarSign
      },
      {
        id: "users",
        name: "Active Users",
        value: 1247 + Math.random() * 500,
        unit: "count",
        color: "blue" as const,
        icon: Users
      },
      {
        id: "conversion",
        name: "Conversion Rate",
        value: 3.4 + Math.random() * 2,
        unit: "percentage",
        suffix: "%",
        color: "purple" as const,
        icon: TrendingUp
      },
      {
        id: "activity",
        name: "Page Views",
        value: 15420 + Math.random() * 5000,
        unit: "count",
        color: "orange" as const,
        icon: Activity
      }
    ]

    return baseMetrics.map(metric => {
      const previousValue = metrics.find(m => m.id === metric.id)?.value || metric.value
      const change = ((metric.value - previousValue) / previousValue) * 100
      const trend = change > 0.1 ? "up" : change < -0.1 ? "down" : "stable"

      return {
        ...metric,
        previousValue,
        change: Math.abs(change),
        trend
      }
    })
  }, [metrics])

  // Update metrics
  const updateMetrics = useCallback(async () => {
    setIsRefreshing(true)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const newMetrics = generateMetrics()
      setMetrics(newMetrics)
      setLastUpdated(new Date())
      setIsConnected(true)
    } catch (error) {
      setIsConnected(false)
      console.error("Failed to update metrics:", error)
    } finally {
      setIsRefreshing(false)
    }
  }, [generateMetrics])

  // Auto-refresh effect
  useEffect(() => {
    updateMetrics() // Initial load

    if (!autoRefresh || isPaused) return

    const interval = setInterval(() => {
      // Simulate occasional connection issues
      if (Math.random() < 0.05) {
        setIsConnected(false)
        setTimeout(() => setIsConnected(true), 2000)
        return
      }
      updateMetrics()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, isPaused, refreshInterval, updateMetrics])

  const formatLastUpdated = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diff < 60) return "Just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    return `${Math.floor(diff / 3600)}h ago`
  }

  return (
    <div className="space-y-6">
      {/* Real-time Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Real-time Dashboard</span>
              </CardTitle>
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className="flex items-center space-x-1"
              >
                {isConnected ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
                <span>{isConnected ? "Connected" : "Disconnected"}</span>
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Updated {formatLastUpdated(lastUpdated)}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center space-x-1"
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
                <span>{isPaused ? "Resume" : "Pause"}</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={updateMetrics}
                disabled={isRefreshing}
                className="flex items-center space-x-1"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="wait">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onMetricClick?.(metric)}
              className="cursor-pointer"
            >
              <div className="relative">
                <MetricsCard
                  title={metric.name}
                  value={Math.round(metric.value)}
                  change={metric.change}
                  trend={metric.trend === "stable" ? "up" : metric.trend as "up" | "down"}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  icon={metric.icon}
                  color={metric.color}
                  description={`Live ${metric.name.toLowerCase()} data`}
                />
                
                {/* Real-time indicator */}
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Change indicator */}
                {metric.trend !== "stable" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                      metric.trend === "up" ? "bg-green-400" : "bg-red-400"
                    }`}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <WifiOff className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-200">
                    Connection Lost
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Attempting to reconnect... Real-time updates are paused.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Paused State */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Pause className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-orange-800 dark:text-orange-200">
                      Real-time Updates Paused
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-300">
                      Click resume to continue receiving live data.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPaused(false)}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

// Hook for managing real-time data
export function useRealTimeData(refreshInterval = 5000) {
  const [data, setData] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const updateData = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100))
      const newData = {
        timestamp: new Date(),
        metrics: {
          revenue: 48750 + Math.random() * 10000,
          users: 1247 + Math.random() * 500,
          conversion: 3.4 + Math.random() * 2,
          pageViews: 15420 + Math.random() * 5000
        }
      }
      setData(newData)
      setLastUpdated(new Date())
      setIsConnected(true)
    } catch (error) {
      setIsConnected(false)
    }
  }, [])

  useEffect(() => {
    updateData()
    const interval = setInterval(updateData, refreshInterval)
    return () => clearInterval(interval)
  }, [updateData, refreshInterval])

  return { data, isConnected, lastUpdated, refresh: updateData }
}