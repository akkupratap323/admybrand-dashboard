"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Simple utility functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0)
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num || 0)
}

interface MetricsCardsProps {
  data?: any
}

export function MetricsCards({ data }: MetricsCardsProps) {
  const metrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(data?.revenue || 0),
      change: data?.revenueChange || 0,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      title: "Active Users",
      value: formatNumber(data?.users || 0),
      change: data?.usersChange || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      title: "Conversions",
      value: formatNumber(data?.conversions || 0),
      change: data?.conversionsChange || 0,
      icon: ShoppingCart,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Growth Rate",
      value: `${data?.growthRate || 0}%`,
      change: data?.growthRateChange || 0,
      icon: BarChart3,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className={cn(
            "relative overflow-hidden group hover:shadow-xl transition-all duration-500 border-2",
            metric.borderColor
          )}>
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <p className="text-sm lg:text-base font-medium text-muted-foreground uppercase tracking-wide">
                    {metric.title}
                  </p>
                  <p className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  <div className="flex items-center space-x-2">
                    {metric.change > 0 ? (
                      <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 lg:h-5 lg:w-5 text-red-500" />
                    )}
                    <span className={cn(
                      "text-sm lg:text-base font-semibold",
                      metric.change > 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {Math.abs(metric.change)}%
                    </span>
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
      ))}
    </div>
  )
}