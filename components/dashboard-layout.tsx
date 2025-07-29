"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Menu,
  X,
  Home,
  Bell,
  Search,
  ChevronDown,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  href?: string
  badge?: string
  shortcut?: string
  subItems?: Omit<SidebarItem, 'subItems'>[]
}

const sidebarItems: SidebarItem[] = [
  { 
    icon: Home, 
    label: "Overview", 
    active: true, 
    href: "/",
    shortcut: "⌘1"
  },
  { 
    icon: BarChart3, 
    label: "Analytics", 
    href: "/analytics",
    shortcut: "⌘2",
    subItems: [
      { icon: TrendingUp, label: "Trends", href: "/analytics/trends" },
      { icon: BarChart3, label: "Reports", href: "/analytics/reports" }
    ]
  },
  { 
    icon: Users, 
    label: "Customers", 
    href: "/customers",
    badge: "12",
    shortcut: "⌘3"
  },
  { 
    icon: DollarSign, 
    label: "Revenue", 
    href: "/revenue",
    shortcut: "⌘4"
  },
  { 
    icon: TrendingUp, 
    label: "Growth", 
    href: "/growth",
    shortcut: "⌘5"
  },
  { 
    icon: Settings, 
    label: "Settings", 
    href: "/settings",
    shortcut: "⌘,"
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [activeItem, setActiveItem] = useState('Overview')
  const [notifications] = useState(3)

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const item = sidebarItems.find(item => {
          const shortcut = item.shortcut?.replace('⌘', '')
          return shortcut === e.key || (shortcut === ',' && e.key === ',')
        })
        if (item) {
          e.preventDefault()
          setActiveItem(item.label)
          // Navigate to item.href in a real app
        }
      }
      // ESC to close sidebar on mobile
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen])

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: -224 }}
          animate={{ x: sidebarOpen ? 0 : -224 }}
          transition={{ type: "spring", damping: 20 }}
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-56 bg-card border-r transform transition-transform lg:translate-x-0 lg:static lg:inset-0",
            "glass-effect"
          )}
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
                role="img"
                aria-label="ADmyBRAND logo"
              />
              <span className="text-xl font-bold">ADmyBRAND</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="p-2 space-y-1" aria-label="Main navigation menu">
            {sidebarItems.map((item, index) => {
              const isActive = activeItem === item.label
              const isExpanded = expandedItems.has(item.label)
              const hasSubItems = item.subItems && item.subItems.length > 0
              
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left group relative",
                      isActive && "bg-primary text-primary-foreground shadow-sm"
                    )}
                    onClick={() => {
                      setActiveItem(item.label)
                      if (hasSubItems) {
                        toggleExpanded(item.label)
                      }
                      // Navigate to item.href in a real app
                    }}
                    aria-expanded={hasSubItems ? isExpanded : undefined}
                    aria-haspopup={hasSubItems ? "menu" : undefined}
                    title={`${item.label}${item.shortcut ? ` (${item.shortcut})` : ''}`}
                  >
                    <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                    <span className="flex-1">{item.label}</span>
                    
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 h-5 px-2 text-xs"
                        aria-label={`${item.badge} notifications`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    
                    {item.shortcut && (
                      <span className="ml-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.shortcut}
                      </span>
                    )}
                    
                    {hasSubItems && (
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 ml-2 transition-transform",
                          isExpanded && "rotate-180"
                        )} 
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                  
                  {/* Sub-items */}
                  <AnimatePresence>
                    {hasSubItems && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-8 mt-1 space-y-1"
                        role="menu"
                        aria-label={`${item.label} submenu`}
                      >
                        {item.subItems?.map((subItem) => (
                          <Button
                            key={subItem.label}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left text-sm"
                            onClick={() => setActiveItem(subItem.label)}
                            role="menuitem"
                          >
                            <subItem.icon className="h-4 w-4 mr-3" aria-hidden="true" />
                            {subItem.label}
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </nav>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <div className="lg:ml-56">
        {/* Header */}
        <header 
          className="fixed top-0 left-0 right-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          role="banner"
        >
          <div className="flex h-12 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={sidebarOpen}
                aria-controls="sidebar-nav"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back! Here's your marketing performance overview.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="Search"
                title="Search (⌘K)"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label={`Notifications${notifications > 0 ? ` (${notifications} unread)` : ''}`}
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white"
                      aria-hidden="true"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <ThemeToggle />
              
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="User menu"
                title="User menu"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main 
          id="main-content"
          className="px-1 py-2 focus:outline-none"
          role="main"
          aria-label="Dashboard content"
          tabIndex={-1}
          style={{ marginTop: '3.5rem' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
