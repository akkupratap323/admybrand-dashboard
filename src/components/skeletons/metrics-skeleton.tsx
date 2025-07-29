"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function MetricsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded-full" />
              </div>
              <div className="h-8 w-32 bg-muted rounded" />
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )
}