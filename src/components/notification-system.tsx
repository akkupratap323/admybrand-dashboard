"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface Notification {
  id: string
  type: "success" | "warning" | "info" | "error"
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationSystemProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
  onClearAll: () => void
}

const notificationIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: AlertCircle,
}

const notificationColors = {
  success: "text-green-500 bg-green-500/10 border-green-500/20",
  warning: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  info: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  error: "text-red-500 bg-red-500/10 border-red-500/20",
}

export function NotificationSystem({
  notifications,
  onMarkAsRead,
  onDismiss,
  onClearAll
}: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted/80"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.div>
        )}
      </Button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-96 max-h-96 z-50"
            >
              <Card className="border-0 shadow-xl bg-background/95 backdrop-blur-sm">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <div className="flex items-center space-x-2">
                      {notifications.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onClearAll}
                          className="text-xs"
                        >
                          Clear all
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      <AnimatePresence>
                        {notifications.map((notification, index) => {
                          const Icon = notificationIcons[notification.type]
                          return (
                            <motion.div
                              key={notification.id}
                              layout
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                                !notification.read ? "bg-muted/30" : ""
                              }`}
                              onClick={() => !notification.read && onMarkAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg ${notificationColors[notification.type]}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium truncate">
                                      {notification.title}
                                    </p>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        onDismiss(notification.id)
                                      }}
                                      className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-muted-foreground">
                                      {formatTime(notification.timestamp)}
                                    </span>
                                    {notification.action && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          notification.action!.onClick()
                                          onDismiss(notification.id) // Auto-dismiss after action
                                        }}
                                        className="text-xs h-6 px-2"
                                      >
                                        {notification.action.label}
                                      </Button>
                                    )}
                                  </div>
                                  {!notification.read && (
                                    <div className="absolute right-2 top-4">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Auto-generate sample notifications for demo
  useEffect(() => {
    const sampleNotifications = [
      {
        type: "success" as const,
        title: "Revenue Target Achieved",
        message: "Monthly revenue target of $50,000 has been reached!",
      },
      {
        type: "warning" as const,
        title: "High Traffic Alert",
        message: "Website traffic is 300% above normal. Monitor server performance.",
      },
      {
        type: "info" as const,
        title: "Weekly Report Ready",
        message: "Your weekly analytics report is ready for download.",
        action: {
          label: "Download",
          onClick: () => {
            // Simulate report download
            const link = document.createElement('a')
            link.href = 'data:text/plain;charset=utf-8,Weekly Analytics Report\n\nGenerated: ' + new Date().toLocaleDateString()
            link.download = 'weekly-report.txt'
            link.click()
          },
        },
      },
      {
        type: "error" as const,
        title: "API Error Detected",
        message: "Payment gateway API is experiencing issues. Some transactions may fail.",
      },
    ]

    sampleNotifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification)
      }, index * 2000)
    })
  }, [])

  return {
    notifications,
    addNotification,
    markAsRead,
    dismiss,
    clearAll,
  }
}