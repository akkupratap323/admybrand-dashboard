// Analytics dashboard types

export interface DashboardData {
  revenue: number
  revenueChange: number
  users: number
  usersChange: number
  conversions: number
  conversionsChange: number
  growthRate: number
  growthRateChange: number
  revenueData: RevenueData[]
  userGrowthData: UserGrowthData[]
  trafficData: TrafficData[]
  tableData: CustomerData[]
}

export interface RevenueData {
  month: string
  revenue: number
}

export interface UserGrowthData {
  month: string
  users: number
}

export interface TrafficData {
  name: string
  value: number
  color?: string
}

export interface CustomerData {
  id: string
  customer: string
  email: string
  status: 'Active' | 'Inactive'
  revenue: number
  date: string
}

export interface MetricCard {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor?: string
  borderColor?: string
  description?: string
}

export interface FilterState {
  search: string
  status: string[]
  dateRange: string
  categories: string[]
}

export interface NotificationData {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: Date
  read: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  variant?: 'default' | 'destructive'
}

export interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  url?: string
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area'
  data: any[]
  title: string
  description?: string
  colors?: string[]
}

export interface ReportConfig {
  id: string
  name: string
  description: string
  template: string
  parameters: Record<string, any>
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    time: string
  }
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  lastLogin: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: {
    email: boolean
    desktop: boolean
    mobile: boolean
  }
  dashboard: {
    defaultView: string
    refreshInterval: number
  }
}