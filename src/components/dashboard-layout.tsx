"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  ChevronRight,
  LayoutDashboard,
  BarChart,
  Users,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  HelpCircle,
  User,
  LogOut,
  Plus,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationSystem, useNotifications } from "@/components/notification-system"
import { AdvancedSearch } from "@/components/advanced-search"
import { SettingsPanel } from "@/components/settings-panel"
import { ProfileSettings } from "@/components/profile-settings"
import { HelpSupport } from "@/components/help-support"
import { AIAssistant, AIAssistantButton } from "@/components/ai-assistant"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

interface UserMenuProps {
  isOpen: boolean
  onClose: () => void
  onOpenSettings: () => void
  onOpenProfile: () => void
  onOpenHelp: () => void
}

const getMenuItems = (activeTab: string) => [
  { id: "overview", name: "Overview", icon: LayoutDashboard, active: activeTab === "overview" },
  { id: "analytics", name: "Analytics", icon: BarChart, active: activeTab === "analytics" },
  { id: "customers", name: "Customers", icon: Users, active: activeTab === "customers" },
  { id: "realtime", name: "Real-time", icon: Activity, active: activeTab === "realtime" },
  { id: "scroll-demo", name: "Scroll Demo", icon: ChevronRight, active: activeTab === "scroll-demo" },
  { id: "reports", name: "Reports", icon: Settings, active: activeTab === "reports" },
]

function UserMenu({ isOpen, onClose, onOpenSettings, onOpenProfile, onOpenHelp }: UserMenuProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="absolute right-0 top-full mt-2 w-56 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg z-50"
      >
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div>
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-muted-foreground">john@admybrand.com</p>
            </div>
          </div>
        </div>
        <div className="p-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm" 
            onClick={() => {
              onOpenProfile()
              onClose()
            }}
          >
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm" 
            onClick={() => {
              onOpenSettings()
              onClose()
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm" 
            onClick={() => {
              onOpenHelp()
              onClose()
            }}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
          <div className="border-t my-2" />
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" 
            onClick={() => {
              // In a real app, this would handle logout
              alert("Sign out functionality would be implemented here")
              onClose()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </motion.div>
    </>
  )
}

export function DashboardLayout({ children, activeTab = "overview", onTabChange }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isAIMinimized, setIsAIMinimized] = useState(false)
  const notifications = useNotifications()
  const menuItems = getMenuItems(activeTab)

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Show search results or filter content based on query
      alert(`Searching for: "${query}". In a real app, this would filter the data.`)
    }
  }

  const handleFiltersChange = (filters: any) => {
    console.log('Filters applied:', filters)
    // In a real app, this would filter the dashboard data
    if (filters.query || filters.status.length > 0 || filters.categories.length > 0) {
      alert('Filters applied! Check console for filter details.')
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcuts({
    search: () => setIsSearchOpen(true),
    ai: () => setIsAIAssistantOpen(true)
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 sm:w-56 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-3 sm:px-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <motion.div 
            className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base sm:text-lg bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent truncate">
                ADmyBRAND
              </h1>
              <p className="text-xs text-muted-foreground">Insights</p>
            </div>
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="p-3 sm:p-4 space-y-2 overflow-y-auto flex-1">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full justify-start h-11 sm:h-10 transition-all duration-200 text-sm sm:text-base ${
                  item.active 
                    ? "bg-primary/10 border border-primary/20 shadow-sm" 
                    : "hover:bg-muted/80"
                }`}
                onClick={() => {
                  if (onTabChange) {
                    onTabChange(item.id)
                  }
                  setIsOpen(false) // Close mobile menu
                }}
              >
                <item.icon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.name}</span>
                {item.active && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto"
                  >
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </motion.div>
                )}
              </Button>
            </motion.div>
          ))}
          
          {/* Quick Actions */}
          <div className="pt-4 mt-4 border-t space-y-2">
            <p className="text-xs font-medium text-muted-foreground px-3 mb-2">Quick Actions</p>
            <Button 
              variant="ghost" 
              className="w-full justify-start h-10 text-sm"
              onClick={() => {
                if (onTabChange) {
                  onTabChange("reports")
                }
                setIsOpen(false)
              }}
            >
              <Plus className="mr-3 h-4 w-4" />
              New Report
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-56">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 lg:left-56 z-40 h-14 sm:h-16 border-b bg-background/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between h-full px-3 sm:px-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              
              {/* Desktop Search Toggle */}
              <Button
                variant="ghost"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden md:flex items-center space-x-2 text-muted-foreground hover:text-foreground min-w-0"
              >
                <Search className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm hidden lg:inline">Search...</span>
                <kbd className="pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </Button>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Notifications */}
              <div className="hidden sm:block">
                <NotificationSystem
                  notifications={notifications.notifications}
                  onMarkAsRead={notifications.markAsRead}
                  onDismiss={notifications.dismiss}
                  onClearAll={notifications.clearAll}
                />
              </div>
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* User Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                    JD
                  </div>
                </Button>
                <UserMenu 
                  isOpen={isUserMenuOpen} 
                  onClose={() => setIsUserMenuOpen(false)}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  onOpenProfile={() => setIsProfileOpen(true)}
                  onOpenHelp={() => setIsHelpOpen(true)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Global Search Overlay */}
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <AdvancedSearch
                onSearch={handleSearch}
                onFiltersChange={handleFiltersChange}
                placeholder="Search across all data..."
                showFilters={true}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Page content */}
        <main className="min-h-screen pt-14 sm:pt-16">
          <div className="p-3 sm:p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Profile Settings Modal */}
      <ProfileSettings 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      {/* Help & Support Modal */}
      <HelpSupport 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
      />

      {/* AI Assistant */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onToggleMinimize={() => setIsAIMinimized(!isAIMinimized)}
        isMinimized={isAIMinimized}
      />

      {/* AI Assistant Floating Button */}
      {!isAIAssistantOpen && (
        <AIAssistantButton
          onClick={() => setIsAIAssistantOpen(true)}
          hasNewMessage={false}
        />
      )}
    </div>
  )
}

// Keyboard shortcut hook
function useKeyboardShortcuts(callbacks: { [key: string]: () => void }) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        callbacks.search?.()
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'j') {
        event.preventDefault()
        callbacks.ai?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [callbacks])
}