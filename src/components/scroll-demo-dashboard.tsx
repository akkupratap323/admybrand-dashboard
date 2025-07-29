"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  ScrollExpansion,
  ProgressiveExpansion,
  ScrollReveal,
  ExpandableCard
} from "@/components/scroll-expansion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Target,
  Clock,
  Award,
  Zap,
  Shield,
  Globe
} from "lucide-react"

// Sample data for charts
const revenueData = [
  { month: "Jan", revenue: 12000, users: 1200, conversions: 145 },
  { month: "Feb", revenue: 15000, users: 1400, conversions: 167 },
  { month: "Mar", revenue: 18500, users: 1650, conversions: 198 },
  { month: "Apr", revenue: 22000, users: 1890, conversions: 234 },
  { month: "May", revenue: 25500, users: 2100, conversions: 267 },
  { month: "Jun", revenue: 28000, users: 2300, conversions: 298 }
]

const trafficData = [
  { name: "Organic", value: 4500, color: "#8884d8" },
  { name: "Direct", value: 3200, color: "#82ca9d" },
  { name: "Social", value: 2800, color: "#ffc658" },
  { name: "Referral", value: 1900, color: "#ff7300" },
  { name: "Email", value: 1500, color: "#8dd1e1" }
]

const performanceMetrics = [
  { 
    title: "Revenue Growth", 
    value: "$284,500", 
    change: "+24.5%", 
    trend: "up", 
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950"
  },
  { 
    title: "Active Users", 
    value: "23,847", 
    change: "+12.3%", 
    trend: "up", 
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950"
  },
  { 
    title: "Conversion Rate", 
    value: "3.24%", 
    change: "-0.8%", 
    trend: "down", 
    icon: Target,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950"
  },
  { 
    title: "Page Speed", 
    value: "1.2s", 
    change: "+15.7%", 
    trend: "up", 
    icon: Zap,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950"
  }
]

export function ScrollDemoDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header Section */}
      <ScrollExpansion direction="down" delay={200}>
        <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Real-time insights with scroll-triggered animations
                </p>
              </div>
              <Badge variant="outline" className="px-4 py-2">
                <Activity className="w-4 h-4 mr-2" />
                Live Data
              </Badge>
            </div>
          </div>
        </div>
      </ScrollExpansion>

      <div className="container mx-auto px-6 py-8 space-y-12">
        {/* Key Metrics Section */}
        <section>
          <ScrollExpansion direction="up" delay={100}>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-primary" />
              Key Performance Metrics
            </h2>
          </ScrollExpansion>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <ScrollExpansion
                key={metric.title}
                direction="scale"
                delay={index * 100}
                duration={0.5}
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                        <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                      <Badge 
                        variant={metric.trend === "up" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {metric.change}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollExpansion>
            ))}
          </div>
        </section>

        {/* Progressive Chart Loading */}
        <section>
          <ScrollExpansion direction="right" delay={200}>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <LineChartIcon className="w-6 h-6 mr-3 text-primary" />
              Progressive Data Visualization
            </h2>
          </ScrollExpansion>

          <ProgressiveExpansion
            stageDelay={400}
            direction="up"
            stages={[
              {
                content: (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        Revenue Trends
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#8884d8" 
                            strokeWidth={3}
                            dot={{ r: 6 }}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                ),
                delay: 0
              },
              {
                content: (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                          User Growth
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="users" fill="#82ca9d" radius={4} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PieChartIcon className="w-5 h-5 mr-2 text-purple-600" />
                          Traffic Sources
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={trafficData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                            >
                              {trafficData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                ),
                delay: 200
              }
            ]}
          />
        </section>

        {/* Expandable Cards Section */}
        <section>
          <ScrollExpansion direction="left" delay={150}>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-primary" />
              Detailed Analytics
            </h2>
          </ScrollExpansion>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpandableCard
              title="Performance Insights"
              icon={<Award className="w-6 h-6 text-yellow-600" />}
              preview={
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Your website performance has improved significantly this month.
                  </p>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">98%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">1.2s</div>
                      <div className="text-xs text-muted-foreground">Load Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">A+</div>
                      <div className="text-xs text-muted-foreground">Grade</div>
                    </div>
                  </div>
                </div>
              }
              expandedContent={
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                      Optimization Recommendations
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        Enable gzip compression for better load times
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                        Optimize images with WebP format
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                        Implement lazy loading for below-fold content
                      </li>
                    </ul>
                  </div>
                  <Button className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Run Full Performance Audit
                  </Button>
                </div>
              }
            />

            <ExpandableCard
              title="User Behavior Analysis"
              icon={<Users className="w-6 h-6 text-blue-600" />}
              preview={
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Understanding how users interact with your platform.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold">4.2m</div>
                      <div className="text-xs text-muted-foreground">Page Views</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">2:34</div>
                      <div className="text-xs text-muted-foreground">Avg Session</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">73%</div>
                      <div className="text-xs text-muted-foreground">Bounce Rate</div>
                    </div>
                  </div>
                </div>
              }
              expandedContent={
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Top Pages
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        /dashboard • /analytics • /reports
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-sm font-medium text-green-900 dark:text-green-100">
                        Peak Hours
                      </div>
                      <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                        2PM - 4PM • 8PM - 10PM
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    View Detailed Heatmap
                  </Button>
                </div>
              }
            />
          </div>
        </section>

        {/* Scroll Reveal Section */}
        <section>
          <ScrollExpansion direction="fade" delay={100}>
            <h2 className="text-2xl font-semibold mb-6">
              Scroll-Revealed Content
            </h2>
          </ScrollExpansion>

          <ScrollReveal showProgress revealHeight={150}>
            <Card className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Complete Analytics Suite</h3>
                  <p className="text-muted-foreground">
                    Discover comprehensive insights about your business performance
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Real-time Monitoring",
                      description: "Track your metrics as they happen with live updates and instant alerts.",
                      icon: Activity
                    },
                    {
                      title: "Advanced Analytics",
                      description: "Deep dive into your data with powerful analysis tools and custom reports.",
                      icon: BarChart3
                    },
                    {
                      title: "Predictive Insights",
                      description: "Forecast trends and make data-driven decisions for your business.",
                      icon: TrendingUp
                    }
                  ].map((feature, index) => (
                    <div key={index} className="text-center space-y-3">
                      <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t">
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button>
                      Get Started
                    </Button>
                    <Button variant="outline">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </section>
      </div>
    </div>
  )
}