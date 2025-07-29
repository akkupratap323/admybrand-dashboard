"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ChartsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
      
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
    </motion.div>
  )
}