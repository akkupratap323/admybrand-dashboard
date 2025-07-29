"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
  Line,
  Area,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush
} from "recharts"
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Maximize2,
  Minimize2,
  Download,
  Settings,
  Filter,
  Calendar,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ChartDataPoint {
  name: string
  value: number
  category?: string
  date?: string
  [key: string]: any
}

interface InteractiveChartProps {
  title: string
  data: ChartDataPoint[]
  type: "line" | "area" | "bar" | "pie"
  color?: string
  height?: number
  enableDrillDown?: boolean
  enableZoom?: boolean
  enableExport?: boolean
  onDataPointClick?: (data: ChartDataPoint) => void
  onDrillDown?: (category: string) => void
}

const COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", 
  "#8b5cf6", "#06b6d4", "#84cc16", "#f97316",
  "#ec4899", "#6366f1", "#14b8a6", "#eab308"
]

const chartTypeIcons = {
  line: LineChartIcon,
  area: LineChartIcon,
  bar: BarChart3,
  pie: PieChartIcon
}

export function InteractiveChart({
  title,
  data,
  type,
  color = "#3b82f6",
  height = 300,
  enableDrillDown = false,
  enableZoom = false,
  enableExport = false,
  onDataPointClick,
  onDrillDown
}: InteractiveChartProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null)
  const [hoveredData, setHoveredData] = useState<ChartDataPoint | null>(null)

  const ChartIcon = chartTypeIcons[type]

  // Filter data based on selected category
  const filteredData = useMemo(() => {
    if (!selectedCategory) return data
    return data.filter(item => item.category === selectedCategory)
  }, [data, selectedCategory])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3"
      >
        <p className="font-medium text-sm mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </motion.div>
    )
  }

  // Handle data point clicks
  const handleDataPointClick = useCallback((data: any) => {
    if (onDataPointClick) {
      onDataPointClick(data)
    }
    if (enableDrillDown && data.category && onDrillDown) {
      setSelectedCategory(data.category)
      onDrillDown(data.category)
    }
  }, [onDataPointClick, enableDrillDown, onDrillDown])

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    }

    switch (type) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {enableZoom && <Brush dataKey="name" height={30} stroke={color} />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              onClick={handleDataPointClick}
            />
          </LineChart>
        )

      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {enableZoom && <Brush dataKey="name" height={30} stroke={color} />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGradient)"
              onClick={handleDataPointClick}
            />
          </AreaChart>
        )

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            {enableZoom && <Brush dataKey="name" height={30} stroke={color} />}
            <Bar
              dataKey="value"
              fill={color}
              radius={[4, 4, 0, 0]}
              onClick={handleDataPointClick}
            />
          </BarChart>
        )

      case "pie":
        return (
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              outerRadius={height / 3}
              dataKey="value"
              onClick={handleDataPointClick}
            >
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        )

      default:
        return <div>Chart type not supported</div>
    }
  }

  const exportChart = () => {
    // In a real implementation, this would export the chart as image or data
    const csvData = filteredData.map(item => 
      Object.entries(item).map(([key, value]) => `${key}: ${value}`).join(", ")
    ).join("\n")
    
    const blob = new Blob([csvData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      layout
      className={`${isFullscreen ? "fixed inset-4 z-50" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`${isFullscreen ? "h-full" : ""} overflow-hidden border-0 bg-gradient-to-br from-background/80 to-muted/50 backdrop-blur-sm shadow-lg`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ChartIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                {selectedCategory && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      Filtered by: {selectedCategory}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                      className="text-xs h-auto p-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {enableZoom && (
                <>
                  <Button variant="ghost" size="sm" className="p-2">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              {enableExport && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={exportChart}
                  className="p-2"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className={`${isFullscreen ? "h-full" : ""}`}>
            <ResponsiveContainer width="100%" height={isFullscreen ? "100%" : height}>
              {renderChart()}
            </ResponsiveContainer>
          </div>

          {/* Chart Stats */}
          <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Data points: {filteredData.length}</span>
              {hoveredData && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-1"
                >
                  <span>•</span>
                  <span>Hover: {hoveredData.name} ({hoveredData.value})</span>
                </motion.span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Backdrop */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </motion.div>
  )
}

// Chart Gallery Component
interface ChartGalleryProps {
  charts: Array<{
    id: string
    title: string
    type: "line" | "area" | "bar" | "pie"
    data: ChartDataPoint[]
    color?: string
  }>
}

export function ChartGallery({ charts }: ChartGalleryProps) {
  const [selectedChart, setSelectedChart] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Chart Grid */}
      <div className={`grid gap-6 ${
        selectedChart 
          ? "grid-cols-1" 
          : "grid-cols-1 md:grid-cols-2"
      }`}>
        <AnimatePresence>
          {charts
            .filter(chart => !selectedChart || chart.id === selectedChart)
            .map((chart, index) => (
              <motion.div
                key={chart.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
              >
                <InteractiveChart
                  title={chart.title}
                  data={chart.data}
                  type={chart.type}
                  color={chart.color}
                  height={selectedChart ? 500 : 300}
                  enableDrillDown={true}
                  enableZoom={true}
                  enableExport={true}
                  onDataPointClick={(data) => console.log("Clicked:", data)}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Chart Selector */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant={selectedChart === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedChart(null)}
        >
          Show All
        </Button>
        {charts.map(chart => (
          <Button
            key={chart.id}
            variant={selectedChart === chart.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedChart(chart.id)}
          >
            {chart.title}
          </Button>
        ))}
      </div>
    </div>
  )
}