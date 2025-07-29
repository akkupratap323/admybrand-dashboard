"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { useTheme } from "next-themes"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import type { DateRange } from "react-day-picker"

interface BarChartProps {
  title: string
  data: any[]
  loading?: boolean
  valuePrefix?: string
  valueSuffix?: string
}

export function BarChart({
  title,
  data,
  loading = false,
  valuePrefix = "",
  valueSuffix = "",
}: BarChartProps) {
  const { theme } = useTheme()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const filteredData = dateRange?.from && dateRange?.to
    ? data.filter(item => {
        const date = new Date(item.date)
        return dateRange.from && dateRange.to && date >= dateRange.from && date <= dateRange.to
      })
    : data

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${valuePrefix}${(value / 1000000).toFixed(1)}M${valueSuffix}`
    }
    if (value >= 1000) {
      return `${valuePrefix}${(value / 1000).toFixed(1)}K${valueSuffix}`
    }
    return `${valuePrefix}${value.toFixed(0)}${valueSuffix}`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </CardTitle>
            <div className="h-10 w-[300px] bg-muted animate-pulse rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke={theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              />
              <YAxis
                stroke={theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatValue}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  return (
                    <div className="rounded-lg border bg-popover p-2 shadow-md">
                      <div className="font-medium">
                        {new Date(label).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      {payload.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.name}:</span>
                          <span className="font-medium">
                            {formatValue(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
              <Legend />
              <Bar
                dataKey="value"
                name="Current"
                fill={theme === "dark" ? "#60a5fa" : "#3b82f6"}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="previousValue"
                name="Previous"
                fill={theme === "dark" ? "#94a3b8" : "#64748b"}
                radius={[4, 4, 0, 0]}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}