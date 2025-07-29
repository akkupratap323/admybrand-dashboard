"use client"

import React from "react"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  PieChart,
  Target,
  Clock,
  Zap,
  ArrowRight
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface DashboardContextProps {
  onQuestionClick: (question: string) => void
}

export function DashboardContext({ onQuestionClick }: DashboardContextProps) {
  const contextCards = [
    {
      title: "Revenue Analytics",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      questions: [
        "How is my revenue trending this month?",
        "What's driving my revenue growth?",
        "Show me revenue breakdown by source"
      ],
      insights: ["$284.5K total revenue", "+24.5% growth", "Best month yet"]
    },
    {
      title: "User Metrics",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      questions: [
        "How many active users do I have?",
        "What's my user retention rate?",
        "Which user segments are growing?"
      ],
      insights: ["23,847 active users", "87.4% retention", "+12.3% growth"]
    },
    {
      title: "Performance Data",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      questions: [
        "What are my top performing metrics?",
        "How can I improve conversion rates?",
        "What trends should I watch?"
      ],
      insights: ["3.24% conversion rate", "1.2s page load", "98% uptime"]
    },
    {
      title: "Real-time Monitoring",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      questions: [
        "What's happening right now?",
        "Show me live metrics",
        "Any alerts or issues?"
      ],
      insights: ["Live data streaming", "All systems green", "24/7 monitoring"]
    }
  ]

  const quickActions = [
    {
      label: "Generate Report",
      icon: BarChart3,
      question: "How do I generate a custom analytics report?"
    },
    {
      label: "Export Data",
      icon: ArrowRight,
      question: "How can I export my dashboard data?"
    },
    {
      label: "Set Alerts",
      icon: Target,
      question: "How do I set up custom alerts for my metrics?"
    },
    {
      label: "Optimize Performance",
      icon: Zap,
      question: "What can I do to improve my dashboard performance?"
    }
  ]

  return (
    <div className="space-y-4">
      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contextCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm">{card.title}</h3>
                </div>
                
                <div className="space-y-2 mb-3">
                  {card.insights.map((insight, i) => (
                    <Badge key={i} variant="secondary" className="text-xs mr-1">
                      {insight}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-1">
                  {card.questions.slice(0, 2).map((question, i) => (
                    <button
                      key={i}
                      onClick={() => onQuestionClick(question)}
                      className="w-full text-left text-xs text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/50"
                    >
                      • {question}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-yellow-500" />
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => onQuestionClick(action.question)}
              className="flex items-center space-x-2 p-2 text-xs bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors text-left"
            >
              <action.icon className="w-3 h-3 text-primary" />
              <span>{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Current Dashboard State */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            Current Dashboard Status
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-green-600">98.5%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">1.2s</div>
              <div className="text-muted-foreground">Load Time</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">Live</div>
              <div className="text-muted-foreground">Data Status</div>
            </div>
          </div>
          <Button
            onClick={() => onQuestionClick("Give me a complete overview of my dashboard performance")}
            variant="outline"
            size="sm"
            className="w-full mt-3 text-xs"
          >
            Get Full Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}