"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SkeletonChart } from "@/components/ui/skeleton"
import { DashboardData } from '@/lib/types'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Download, Maximize2 } from 'lucide-react'

interface ChartsSectionProps {
  data?: DashboardData
  isLoading?: boolean
}

const COLORS = {
  primary: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'],
  gradients: {
    revenue: ['#8884d8', '#9c92e0'],
    users: ['#82ca9d', '#95d6ab'],
    conversions: ['#ffc658', '#ffd07a']
  }
}

type ChartType = 'line' | 'bar' | 'area'
type TimeRange = '7d' | '30d' | '90d' | '1y'

export function ChartsSection({ data, isLoading = false }: ChartsSectionProps) {
  const [revenueChartType, setRevenueChartType] = useState<ChartType>('area')
  const [userChartType, setUserChartType] = useState<ChartType>('bar')
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any>(null)

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-lg p-3 shadow-lg"
        >
          <p className="font-medium text-card-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.dataKey}:</span>
              <span className="font-semibold text-foreground">
                {entry.dataKey === 'revenue' ? formatCurrency(entry.value) : formatNumber(entry.value)}
              </span>
            </div>
          ))}
        </motion.div>
      )
    }
    return null
  }

  const renderRevenueChart = () => {
    const chartData = data?.revenueData || []
    const commonProps = {
      data: chartData,
      onMouseEnter: setHoveredDataPoint,
      onMouseLeave: () => setHoveredDataPoint(null)
    }

    switch (revenueChartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" className="text-sm" tick={{ fontSize: 12 }} />
            <YAxis className="text-sm" tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, 'en-US', 'USD').replace('$', '$').slice(0, -3) + 'K'} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={COLORS.gradients.revenue[0]}
              strokeWidth={3}
              dot={{ fill: COLORS.gradients.revenue[0], strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: COLORS.gradients.revenue[0], strokeWidth: 2, fill: '#fff' }}
              animationDuration={1000}
            />
          </LineChart>
        )
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" className="text-sm" tick={{ fontSize: 12 }} />
            <YAxis className="text-sm" tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, 'en-US', 'USD').replace('$', '$').slice(0, -3) + 'K'} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="revenue" 
              fill={COLORS.gradients.revenue[0]}
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        )
      case 'area':
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.gradients.revenue[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.gradients.revenue[1]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" className="text-sm" tick={{ fontSize: 12 }} />
            <YAxis className="text-sm" tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, 'en-US', 'USD').replace('$', '$').slice(0, -3) + 'K'} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={COLORS.gradients.revenue[0]}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              strokeWidth={3}
              animationDuration={1000}
            />
          </AreaChart>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <Card><CardContent className="p-6"><SkeletonChart /></CardContent></Card>
        </div>
        <Card><CardContent className="p-6"><SkeletonChart /></CardContent></Card>
        <Card><CardContent className="p-6"><SkeletonChart /></CardContent></Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Enhanced Revenue Trend Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="col-span-1 lg:col-span-2"
      >
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Revenue Trend</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </CardTitle>
                {hoveredDataPoint && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-muted-foreground"
                  >
                    {hoveredDataPoint.month}: {formatCurrency(hoveredDataPoint.revenue)}
                  </motion.div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                  {(['area', 'line', 'bar'] as ChartType[]).map((type) => (
                    <Button
                      key={type}
                      variant={revenueChartType === type ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setRevenueChartType(type)}
                      className="h-7 px-2 text-xs"
                    >
                      {type === 'area' && <BarChart3 className="w-3 h-3" />}
                      {type === 'line' && <TrendingUp className="w-3 h-3" />}
                      {type === 'bar' && <BarChart3 className="w-3 h-3" />}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={revenueChartType}
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <ResponsiveContainer width="100%" height={350}>
                  {renderRevenueChart()}
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced User Growth Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span>User Growth</span>
                <Badge variant="secondary" className="ml-2">
                  +{data?.usersChange}%
                </Badge>
              </CardTitle>
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                {(['bar', 'line', 'area'] as ChartType[]).map((type) => (
                  <Button
                    key={type}
                    variant={userChartType === type ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setUserChartType(type)}
                    className="h-7 px-2 text-xs"
                  >
                    {type === 'area' && <BarChart3 className="w-3 h-3" />}
                    {type === 'line' && <TrendingUp className="w-3 h-3" />}
                    {type === 'bar' && <BarChart3 className="w-3 h-3" />}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={userChartType}
                variants={chartVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  {userChartType === 'bar' ? (
                    <BarChart data={data?.userGrowthData || []}>
                      <defs>
                        <linearGradient id="userBarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.gradients.users[0]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.gradients.users[1]} stopOpacity={0.6}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-sm" tick={{ fontSize: 12 }} />
                      <YAxis className="text-sm" tick={{ fontSize: 12 }} tickFormatter={(value) => formatNumber(value)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="users" 
                        fill="url(#userBarGradient)"
                        radius={[6, 6, 0, 0]}
                        animationDuration={1000}
                      />
                    </BarChart>
                  ) : userChartType === 'line' ? (
                    <LineChart data={data?.userGrowthData || []}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-sm" tick={{ fontSize: 12 }} />
                      <YAxis className="text-sm" tick={{ fontSize: 12 }} tickFormatter={(value) => formatNumber(value)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke={COLORS.gradients.users[0]}
                        strokeWidth={3}
                        dot={{ fill: COLORS.gradients.users[0], strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, stroke: COLORS.gradients.users[0], strokeWidth: 2, fill: '#fff' }}
                        animationDuration={1000}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={data?.userGrowthData || []}>
                      <defs>
                        <linearGradient id="userAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.gradients.users[0]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.gradients.users[1]} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-sm" tick={{ fontSize: 12 }} />
                      <YAxis className="text-sm" tick={{ fontSize: 12 }} tickFormatter={(value) => formatNumber(value)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stroke={COLORS.gradients.users[0]}
                        fillOpacity={1}
                        fill="url(#userAreaGradient)"
                        strokeWidth={2}
                        animationDuration={1000}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Traffic Sources Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="w-5 h-5 text-purple-500" />
                <span>Traffic Sources</span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Total: {formatNumber(data?.trafficData?.reduce((sum, item) => sum + item.value, 0) || 0)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data?.trafficData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {(data?.trafficData || []).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color || COLORS.primary[index % COLORS.primary.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Traffic Sources Legend */}
              <div className="space-y-3">
                {(data?.trafficData || []).map((source, index) => {
                  const total = data?.trafficData?.reduce((sum, item) => sum + item.value, 0) || 0
                  const percentage = total > 0 ? ((source.value / total) * 100).toFixed(1) : '0'
                  
                  return (
                    <motion.div
                      key={source.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: source.color || COLORS.primary[index % COLORS.primary.length] }}
                        />
                        <span className="font-medium text-sm">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{formatNumber(source.value)}</div>
                        <div className="text-xs text-muted-foreground">{percentage}%</div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
