"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, BarChart3, Info, Eye, EyeOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SkeletonMetricCard } from "@/components/ui/skeleton"
import { formatCurrency, formatNumber, formatPercentage, cn } from "@/lib/utils"
import { DashboardData, MetricCard } from '@/lib/types'

interface MetricsCardsProps {
  data?: DashboardData
  isLoading?: boolean
}

export function MetricsCards({ data, isLoading = false }: MetricsCardsProps) {
  const [hiddenMetrics, setHiddenMetrics] = useState<Set<string>>(new Set())
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  const toggleMetricVisibility = (title: string) => {
    const newHidden = new Set(hiddenMetrics)
    if (newHidden.has(title)) {
      newHidden.delete(title)
    } else {
      newHidden.add(title)
    }
    setHiddenMetrics(newHidden)
  }

  const getMetricDescription = (title: string): string => {
    const descriptions = {
      'Total Revenue': 'Total revenue generated across all channels and products this period',
      'Active Users': 'Number of unique users who have engaged with the platform',
      'Conversions': 'Number of users who completed desired actions or purchases',
      'Growth Rate': 'Overall business growth rate compared to previous period'
    }
    return descriptions[title as keyof typeof descriptions] || ''
  }

  const metrics: MetricCard[] = [
    {
      title: "Total Revenue",
      value: formatCurrency(data?.revenue || 0),
      change: data?.revenueChange || 0,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      description: getMetricDescription('Total Revenue'),
      trend: (data?.revenueChange || 0) > 0 ? 'up' : (data?.revenueChange || 0) < 0 ? 'down' : 'neutral'
    },
    {
      title: "Active Users",
      value: formatNumber(data?.users || 0),
      change: data?.usersChange || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: getMetricDescription('Active Users'),
      trend: (data?.usersChange || 0) > 0 ? 'up' : (data?.usersChange || 0) < 0 ? 'down' : 'neutral'
    },
    {
      title: "Conversions",
      value: formatNumber(data?.conversions || 0),
      change: data?.conversionsChange || 0,
      icon: ShoppingCart,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      description: getMetricDescription('Conversions'),
      trend: (data?.conversionsChange || 0) > 0 ? 'up' : (data?.conversionsChange || 0) < 0 ? 'down' : 'neutral'
    },
    {
      title: "Growth Rate",
      value: formatPercentage(data?.growthRate || 0),
      change: data?.growthRateChange || 0,
      icon: BarChart3,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      description: getMetricDescription('Growth Rate'),
      trend: (data?.growthRateChange || 0) > 0 ? 'up' : (data?.growthRateChange || 0) < 0 ? 'down' : 'neutral'
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <SkeletonMetricCard />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics Control Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">View:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHiddenMetrics(new Set())}
            className="h-7 text-xs"
          >
            Show All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHiddenMetrics(new Set(metrics.map(m => m.title)))}
            className="h-7 text-xs"
          >
            Hide All
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {metrics.length - hiddenMetrics.size} of {metrics.length} metrics visible
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <AnimatePresence>
          {metrics.map((metric, index) => {
            const isHidden = hiddenMetrics.has(metric.title)
            const isSelected = selectedMetric === metric.title

            if (isHidden) return null

            return (
              <motion.div
                key={metric.title}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => setSelectedMetric(isSelected ? null : metric.title)}
                className="cursor-pointer"
              >
                <Card className={cn(
                  "relative overflow-hidden group hover:shadow-xl transition-all duration-500 border-2",
                  metric.borderColor,
                  isSelected && "ring-2 ring-primary shadow-lg"
                )}>
                  <CardContent className="p-6 lg:p-8">
                    {/* Header with controls */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm lg:text-base font-medium text-muted-foreground uppercase tracking-wide">
                          {metric.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Show metric info
                          }}
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Info className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMetricVisibility(metric.title)
                        }}
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <EyeOff className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">
                          {metric.value}
                        </p>
                        <div className="flex items-center space-x-2">
                          {metric.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-green-500" />
                          ) : metric.trend === 'down' ? (
                            <TrendingDown className="h-4 w-4 lg:h-5 lg:w-5 text-red-500" />
                          ) : (
                            <div className="h-4 w-4 lg:h-5 lg:w-5 rounded-full bg-muted" />
                          )}
                          <Badge 
                            variant={metric.trend === 'up' ? 'default' : metric.trend === 'down' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {formatPercentage(Math.abs(metric.change))}
                          </Badge>
                          <span className="text-sm lg:text-base text-muted-foreground">
                            vs last month
                          </span>
                        </div>
                      </div>
                      <div className={cn(
                        "p-4 lg:p-5 rounded-2xl transition-all duration-300 group-hover:scale-110",
                        metric.bgColor
                      )}>
                        <metric.icon className={cn("h-6 w-6 lg:h-8 lg:w-8", metric.color)} />
                      </div>
                    </div>
                    
                    {/* Expanded info */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-border/50"
                        >
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {metric.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    {/* Bottom accent line */}
                    <div className={cn(
                      "absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
                      metric.color.replace('text-', 'bg-')
                    )} />
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
