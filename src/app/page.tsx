"use client"

import { useState, useEffect, lazy, Suspense, memo, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MetricsGrid } from "@/components/metrics/metrics-grid"
import { ChartsGrid } from "@/components/charts/charts-grid"
import { DataTable } from "@/components/data-table/data-table"
import { generateAnalyticsData } from "@/lib/utils/mock-data-generator"

// Lazy load heavy components
const RealTimeDashboard = lazy(() => import("@/components/real-time-dashboard").then(module => ({ default: module.RealTimeDashboard })))
const InteractiveChart = lazy(() => import("@/components/interactive-charts").then(module => ({ default: module.InteractiveChart })))
const ChartGallery = lazy(() => import("@/components/interactive-charts").then(module => ({ default: module.ChartGallery })))
const ReportingSystem = lazy(() => import("@/components/reporting-system").then(module => ({ default: module.ReportingSystem })))
const ScrollDemoDashboard = lazy(() => import("@/components/scroll-demo-dashboard").then(module => ({ default: module.ScrollDemoDashboard })))

// Loading component
const ComponentLoader = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

// Memoized Dashboard component for better performance
const Dashboard = memo(function Dashboard() {
  const [data, setData] = useState<ReturnType<typeof generateAnalyticsData> | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(generateAnalyticsData())
      setLoading(false)
    }, 800) // Reduced loading time

    return () => clearTimeout(timer)
  }, [])

  // Memoized chart data to avoid re-computation
  const sampleChartData = useMemo(() => [
    { name: 'Jan', value: 4000, category: 'A' },
    { name: 'Feb', value: 3000, category: 'B' },
    { name: 'Mar', value: 5000, category: 'A' },
    { name: 'Apr', value: 4500, category: 'C' },
    { name: 'May', value: 6000, category: 'A' },
    { name: 'Jun', value: 5500, category: 'B' },
  ], [])

  const chartGalleryData = useMemo(() => [
    {
      id: "revenue-trend",
      title: "Revenue Trend",
      type: "area" as const,
      data: sampleChartData,
      color: "#10b981"
    },
    {
      id: "user-growth",
      title: "User Growth",
      type: "line" as const,
      data: sampleChartData.map(d => ({ ...d, value: d.value * 0.8 })),
      color: "#3b82f6"
    },
    {
      id: "conversion-rates",
      title: "Conversion Rates",
      type: "bar" as const,
      data: sampleChartData.map(d => ({ ...d, value: d.value * 0.1 })),
      color: "#8b5cf6"
    },
    {
      id: "traffic-sources",
      title: "Traffic Sources",
      type: "pie" as const,
      data: [
        { name: 'Organic', value: 45 },
        { name: 'Direct', value: 30 },
        { name: 'Referral', value: 15 },
        { name: 'Social', value: 10 }
      ],
      color: "#f59e0b"
    }
  ], [sampleChartData])

  return (
    <DashboardLayout 
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="border-b pb-4"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            ADmyBRAND Insights
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive analytics dashboard with real-time insights and advanced reporting
          </p>
        </motion.div>

        {/* Enhanced Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 gap-1 sm:grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center justify-center px-2 py-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center justify-center px-2 py-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Real-time</span>
              <span className="sm:hidden">Live</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center justify-center px-2 py-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center justify-center px-2 py-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Customers</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger value="scroll-demo" className="flex items-center justify-center px-2 py-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Scroll Demo</span>
              <span className="sm:hidden">Demo</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center justify-center px-2 py-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Reports</span>
              <span className="sm:hidden">Docs</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent key={activeTab} value="overview" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Metrics Cards Section */}
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">Key Performance Indicators</h2>
                    <p className="text-muted-foreground">
                      Track your most important metrics at a glance
                    </p>
                  </div>
                  <MetricsGrid />
                </div>

                {/* Charts Section */}
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">Performance Analytics</h2>
                    <p className="text-muted-foreground">
                      Visualize trends and patterns in your data
                    </p>
                  </div>
                  <ChartsGrid />
                </div>

                {/* Quick Data Table */}
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <p className="text-muted-foreground">
                      Latest customer interactions and transactions
                    </p>
                  </div>
                  <DataTable />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent key={activeTab} value="realtime" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<ComponentLoader />}>
                  <RealTimeDashboard 
                    autoRefresh={true}
                    refreshInterval={3000}
                    onMetricClick={(metric) => console.log('Metric clicked:', metric)}
                  />
                </Suspense>
              </motion.div>
            </TabsContent>

            <TabsContent key={activeTab} value="analytics" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Interactive Charts Gallery */}
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">Interactive Analytics</h2>
                    <p className="text-muted-foreground">
                      Drill down into your data with interactive visualizations
                    </p>
                  </div>
                  <Suspense fallback={<ComponentLoader />}>
                    <ChartGallery charts={chartGalleryData} />
                  </Suspense>
                </div>

                {/* Advanced Metrics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Advanced Metrics</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Suspense fallback={<ComponentLoader />}>
                      <InteractiveChart
                        title="Revenue Growth Analysis"
                        data={sampleChartData}
                        type="area"
                        color="#10b981"
                        height={400}
                        enableDrillDown={true}
                        enableZoom={true}
                        enableExport={true}
                      />
                    </Suspense>
                    <Suspense fallback={<ComponentLoader />}>
                      <InteractiveChart
                        title="User Engagement Metrics"
                        data={sampleChartData.map(d => ({ ...d, value: d.value * 0.6 }))}
                        type="line"
                        color="#3b82f6"
                        height={400}
                        enableDrillDown={true}
                        enableZoom={true}
                        enableExport={true}
                      />
                    </Suspense>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent key={activeTab} value="customers" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Customer Analytics */}
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold">Customer Intelligence</h2>
                    <p className="text-muted-foreground">
                      Comprehensive customer data analysis and segmentation
                    </p>
                  </div>
                  
                  {/* Customer Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">Total Customers</h3>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12,847</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">+12% this month</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                      <h3 className="font-semibold text-green-900 dark:text-green-100">Active Users</h3>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">8,293</p>
                      <p className="text-sm text-green-700 dark:text-green-300">+8% this week</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100">Retention Rate</h3>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">87.4%</p>
                      <p className="text-sm text-purple-700 dark:text-purple-300">+2.1% improvement</p>
                    </div>
                  </div>
                  
                  <DataTable />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent key={activeTab} value="scroll-demo" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<ComponentLoader />}>
                  <ScrollDemoDashboard />
                </Suspense>
              </motion.div>
            </TabsContent>

            <TabsContent key={activeTab} value="reports" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<ComponentLoader />}>
                  <ReportingSystem />
                </Suspense>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </DashboardLayout>
  )
})

export default Dashboard