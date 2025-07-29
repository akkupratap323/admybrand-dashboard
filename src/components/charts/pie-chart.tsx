"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

interface PieChartProps {
  title: string
  data: any[]
  loading?: boolean
  dataKey?: string
  nameKey?: string
}

const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899']

export function PieChart({
  title,
  data,
  loading = false,
  dataKey = "value",
  nameKey = "name",
}: PieChartProps) {
  const { theme } = useTheme()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardTitle>
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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey={dataKey}
                nameKey={nameKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const data = payload[0].payload

                  return (
                    <div className="rounded-lg border bg-popover p-2 shadow-md">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: payload[0].color }}
                        />
                        <span className="font-medium">{data[nameKey]}</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Value: {data[dataKey]}
                        {data.change && (
                          <span
                            className={data.change >= 0 ? "text-green-500" : "text-red-500"}
                          >
                            {" "}
                            ({data.change >= 0 ? "+" : ""}
                            {data.change}%)
                          </span>
                        )}
                      </div>
                    </div>
                  )
                }}
              />
              <Legend
                formatter={(value, entry: any) => (
                  <span className="text-sm">
                    {value}
                    {entry.payload.change && (
                      <span
                        className={entry.payload.change >= 0 ? "text-green-500" : "text-red-500"}
                        style={{ marginLeft: "0.5rem" }}
                      >
                        ({entry.payload.change >= 0 ? "+" : ""}
                        {entry.payload.change}%)
                      </span>
                    )}
                  </span>
                )}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}