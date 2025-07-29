"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Share,
  Mail,
  Settings,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Report {
  id: string
  name: string
  description: string
  type: "analytics" | "performance" | "customer" | "financial"
  format: "pdf" | "excel" | "csv" | "json"
  schedule: "manual" | "daily" | "weekly" | "monthly"
  status: "generating" | "ready" | "error" | "scheduled"
  createdAt: Date
  lastGenerated?: Date
  size?: string
  downloadUrl?: string
  metrics: string[]
  recipients?: string[]
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  metrics: string[]
  charts: string[]
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "executive-summary",
    name: "Executive Summary",
    description: "High-level overview with key metrics and trends",
    icon: TrendingUp,
    color: "blue",
    metrics: ["revenue", "users", "conversion", "growth"],
    charts: ["revenue-trend", "user-growth", "conversion-funnel"]
  },
  {
    id: "performance-deep-dive",
    name: "Performance Deep Dive",
    description: "Detailed performance analysis with technical metrics",
    icon: BarChart3,
    color: "green",
    metrics: ["pageviews", "bounce-rate", "load-time", "errors"],
    charts: ["performance-trends", "error-rates", "user-flows"]
  },
  {
    id: "customer-insights",
    name: "Customer Insights",
    description: "Customer behavior, demographics, and journey analysis",
    icon: Users,
    color: "purple",
    metrics: ["customer-segments", "lifetime-value", "churn-rate"],
    charts: ["customer-segments", "retention-cohorts", "journey-map"]
  },
  {
    id: "financial-overview",
    name: "Financial Overview",
    description: "Revenue, costs, and profitability analysis",
    icon: DollarSign,
    color: "orange",
    metrics: ["revenue", "costs", "profit-margin", "roi"],
    charts: ["revenue-breakdown", "cost-analysis", "profit-trends"]
  }
]

const statusColors = {
  generating: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  ready: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  scheduled: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
}

const statusIcons = {
  generating: RefreshCw,
  ready: CheckCircle,
  error: AlertCircle,
  scheduled: Clock
}

export function ReportingSystem() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  // Initialize with sample reports
  useEffect(() => {
    const sampleReports: Report[] = [
      {
        id: "1",
        name: "Weekly Performance Report",
        description: "Weekly overview of key metrics and performance indicators",
        type: "performance",
        format: "pdf",
        schedule: "weekly",
        status: "ready",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        size: "2.4 MB",
        metrics: ["pageviews", "users", "conversion", "bounce-rate"],
        recipients: ["john@admybrand.com", "sarah@admybrand.com"]
      },
      {
        id: "2",
        name: "Monthly Executive Summary",
        description: "High-level monthly summary for executives",
        type: "analytics",
        format: "pdf",
        schedule: "monthly",
        status: "generating",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        metrics: ["revenue", "users", "growth", "roi"]
      },
      {
        id: "3",
        name: "Customer Behavior Analysis",
        description: "Deep dive into customer patterns and segments",
        type: "customer",
        format: "excel",
        schedule: "manual",
        status: "ready",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        size: "5.8 MB",
        metrics: ["customer-segments", "lifetime-value", "churn-rate"]
      }
    ]
    setReports(sampleReports)
  }, [])

  const generateReport = async (templateId: string, customConfig?: any) => {
    setIsGenerating(true)
    
    const template = reportTemplates.find(t => t.id === templateId)
    if (!template) return

    const newReport: Report = {
      id: Date.now().toString(),
      name: customConfig?.name || `${template.name} - ${new Date().toLocaleDateString()}`,
      description: template.description,
      type: "analytics",
      format: customConfig?.format || "pdf",
      schedule: customConfig?.schedule || "manual",
      status: "generating",
      createdAt: new Date(),
      metrics: template.metrics
    }

    setReports(prev => [newReport, ...prev])

    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(report => 
        report.id === newReport.id 
          ? { 
              ...report, 
              status: "ready", 
              lastGenerated: new Date(),
              size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
              downloadUrl: "#"
            }
          : report
      ))
      setIsGenerating(false)
      setShowTemplates(false)
    }, 3000)
  }

  const downloadReport = (report: Report) => {
    // In a real implementation, this would trigger the actual download
    console.log(`Downloading report: ${report.name}`)
    
    // Create a dummy blob for demonstration
    const content = `Report: ${report.name}\nGenerated: ${report.lastGenerated}\nMetrics: ${report.metrics.join(", ")}`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.name.toLowerCase().replace(/\s+/g, "-")}.${report.format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareReport = (report: Report) => {
    // In a real implementation, this would open a sharing modal
    navigator.clipboard.writeText(`${window.location.origin}/reports/${report.id}`)
    console.log(`Share link copied for: ${report.name}`)
  }

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground">
            Generate, schedule, and manage your analytics reports
          </p>
        </div>
        <Button onClick={() => setShowTemplates(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Report</span>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", value: reports.length, icon: FileText, color: "blue" },
          { label: "Scheduled", value: reports.filter(r => r.schedule !== "manual").length, icon: Clock, color: "orange" },
          { label: "Ready", value: reports.filter(r => r.status === "ready").length, icon: CheckCircle, color: "green" },
          { label: "This Month", value: reports.filter(r => r.createdAt.getMonth() === new Date().getMonth()).length, icon: Calendar, color: "purple" }
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600 dark:bg-${color}-900 dark:text-${color}-300`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Reports</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {reports.map((report, index) => {
                const StatusIcon = statusIcons[report.status]
                return (
                  <motion.div
                    key={report.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium">{report.name}</h3>
                          <Badge className={statusColors[report.status]}>
                            <StatusIcon className={`h-3 w-3 mr-1 ${report.status === "generating" ? "animate-spin" : ""}`} />
                            {report.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {report.format.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {report.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Created: {formatDate(report.createdAt)}</span>
                          {report.lastGenerated && (
                            <span>Last generated: {formatDate(report.lastGenerated)}</span>
                          )}
                          {report.size && <span>Size: {report.size}</span>}
                          <span className="capitalize">Schedule: {report.schedule}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {report.metrics.slice(0, 3).map(metric => (
                              <Badge key={metric} variant="secondary" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                            {report.metrics.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{report.metrics.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log("View report", report.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.status === "ready" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => downloadReport(report)}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => shareReport(report)}
                              className="h-8 w-8 p-0"
                            >
                              <Share className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log("Edit report", report.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReport(report.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowTemplates(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 bg-background rounded-lg shadow-xl z-50 overflow-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Choose Report Template</h2>
                    <p className="text-muted-foreground">
                      Select a template to get started with your report
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => setShowTemplates(false)}>
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reportTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg bg-${template.color}-100 text-${template.color}-600 dark:bg-${template.color}-900 dark:text-${template.color}-300`}>
                              <template.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">{template.name}</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                {template.description}
                              </p>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Included Metrics:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {template.metrics.map(metric => (
                                      <Badge key={metric} variant="outline" className="text-xs">
                                        {metric}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Charts:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {template.charts.map(chart => (
                                      <Badge key={chart} variant="secondary" className="text-xs">
                                        {chart}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Button
                                className="w-full mt-4"
                                onClick={() => generateReport(template.id)}
                                disabled={isGenerating}
                              >
                                {isGenerating ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Generate Report
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}