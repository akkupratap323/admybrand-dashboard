"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, BarChart3, Users, DollarSign } from "lucide-react"

interface MetricsCardProps {
  title: string
  value: string | number
  change: number
  trend: "up" | "down"
  prefix?: string
  suffix?: string
  loading?: boolean
  icon?: React.ComponentType<{ className?: string }>
  color?: "blue" | "green" | "purple" | "orange" | "red"
  description?: string
}

export function MetricsCard({
  title,
  value,
  change,
  trend,
  prefix = "",
  suffix = "",
  loading = false,
  icon: Icon = Activity,
  color = "blue",
  description
}: MetricsCardProps) {
  const formattedValue = typeof value === "number" 
    ? new Intl.NumberFormat("en-US").format(value)
    : value

  const formattedChange = Math.abs(Math.round(change * 10) / 10)
  const isPositive = trend === "up"

  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return {
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconText: "text-blue-600 dark:text-blue-400",
          gradient: "from-blue-500/10 to-blue-600/5",
          border: "border-blue-200/50 dark:border-blue-800/50"
        }
      case "green":
        return {
          iconBg: "bg-green-100 dark:bg-green-900/30",
          iconText: "text-green-600 dark:text-green-400",
          gradient: "from-green-500/10 to-green-600/5",
          border: "border-green-200/50 dark:border-green-800/50"
        }
      case "purple":
        return {
          iconBg: "bg-purple-100 dark:bg-purple-900/30",
          iconText: "text-purple-600 dark:text-purple-400",
          gradient: "from-purple-500/10 to-purple-600/5",
          border: "border-purple-200/50 dark:border-purple-800/50"
        }
      case "orange":
        return {
          iconBg: "bg-orange-100 dark:bg-orange-900/30",
          iconText: "text-orange-600 dark:text-orange-400",
          gradient: "from-orange-500/10 to-orange-600/5",
          border: "border-orange-200/50 dark:border-orange-800/50"
        }
      case "red":
        return {
          iconBg: "bg-red-100 dark:bg-red-900/30",
          iconText: "text-red-600 dark:text-red-400",
          gradient: "from-red-500/10 to-red-600/5",
          border: "border-red-200/50 dark:border-red-800/50"
        }
      default:
        return {
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconText: "text-blue-600 dark:text-blue-400",
          gradient: "from-blue-500/10 to-blue-600/5",
          border: "border-blue-200/50 dark:border-blue-800/50"
        }
    }
  }

  const colorClasses = getColorClasses()

  if (loading) {
    return (
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 bg-muted/60 rounded-lg animate-pulse" />
              <div className="h-4 w-20 bg-muted/60 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-32 bg-muted/60 rounded animate-pulse" />
              <div className="h-3 w-40 bg-muted/60 rounded animate-pulse" />
            </div>
            <div className="h-4 w-24 bg-muted/60 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden border bg-gradient-to-br from-card to-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group ${colorClasses.border}`}>
        <CardContent className="p-4 sm:p-6 relative">
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity duration-300 ${colorClasses.gradient}`} />
          
          {/* Content */}
          <div className="relative space-y-3 sm:space-y-4">
            {/* Header with Icon */}
            <div className="flex items-center justify-between">
              <motion.div 
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${colorClasses.iconBg} ${colorClasses.iconText}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.div>
              <div className="flex items-center space-x-1">
                <motion.div 
                  className={isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                </motion.div>
                <motion.span 
                  className={`text-xs sm:text-sm font-medium ${
                    isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {formattedChange}%
                </motion.span>
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
              {description && (
                <p className="text-xs text-muted-foreground/80 line-clamp-2 sm:line-clamp-none">{description}</p>
              )}
            </div>

            {/* Value */}
            <motion.div
              key={value.toString()}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
              className="text-2xl sm:text-3xl font-bold text-foreground truncate"
            >
              {prefix}{formattedValue}{suffix}
            </motion.div>

            {/* Trend Info */}
            <motion.p 
              className="text-xs text-muted-foreground flex items-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span>•</span>
              <span>vs previous period</span>
            </motion.p>
          </div>

          {/* Hover Effect Border */}
          <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${colorClasses.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`} />
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Predefined metric card variants for common use cases
export const RevenueCard = ({ value, change, trend, loading, description }: Omit<MetricsCardProps, 'title' | 'icon' | 'color' | 'prefix'>) => (
  <MetricsCard 
    title="Total Revenue" 
    value={value} 
    change={change} 
    trend={trend} 
    loading={loading}
    icon={DollarSign} 
    color="green" 
    prefix="$" 
    description={description || "Total revenue generated"}
  />
)

export const UsersCard = ({ value, change, trend, loading, description }: Omit<MetricsCardProps, 'title' | 'icon' | 'color'>) => (
  <MetricsCard 
    title="Active Users" 
    value={value} 
    change={change} 
    trend={trend} 
    loading={loading}
    icon={Users} 
    color="blue" 
    description={description || "Currently active users"}
  />
)

export const ConversionsCard = ({ value, change, trend, loading, description }: Omit<MetricsCardProps, 'title' | 'icon' | 'color' | 'suffix'>) => (
  <MetricsCard 
    title="Conversions" 
    value={value} 
    change={change} 
    trend={trend} 
    loading={loading}
    icon={BarChart3} 
    color="purple" 
    suffix="%" 
    description={description || "Conversion rate"}
  />
)