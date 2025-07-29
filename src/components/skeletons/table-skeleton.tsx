"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-[300px] bg-muted animate-pulse rounded" />
              <div className="h-10 w-[120px] bg-muted animate-pulse rounded" />
            </div>

            <div className="rounded-md border">
              <div className="h-12 border-b px-4 flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 w-24 bg-muted animate-pulse rounded mx-4" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 border-b px-4 flex items-center">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-4 w-24 bg-muted animate-pulse rounded mx-4" />
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              <div className="flex items-center space-x-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-8 w-8 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}