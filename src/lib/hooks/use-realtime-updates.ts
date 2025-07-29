import { useState, useEffect, useCallback } from "react"
import { generateAnalyticsData, generateRealtimeUpdate, type AnalyticsData } from "@/lib/utils/mock-data-generator"

export function useRealtimeUpdates(interval: number = 5000) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)
    const newData = generateAnalyticsData()
    setData(newData)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Initial data load
    const initialData = generateAnalyticsData()
    setData(initialData)
    setLoading(false)

    // Set up real-time updates
    const timer = setInterval(() => {
      setData((prevData) => {
        if (!prevData) return null
        const update = generateRealtimeUpdate(prevData)
        return { ...prevData, ...update }
      })
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  return { data, loading, refresh }
}