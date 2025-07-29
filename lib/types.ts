export interface DashboardData {
  revenue: number
  revenueChange: number
  users: number
  usersChange: number
  conversions: number
  conversionsChange: number
  growthRate: number
  growthRateChange: number
  revenueData: RevenueDataPoint[]
  userGrowthData: UserGrowthDataPoint[]
  trafficData: TrafficSource[]
  tableData: CustomerData[]
}

export interface RevenueDataPoint {
  month: string
  revenue: number
}

export interface UserGrowthDataPoint {
  month: string
  users: number
}

export interface TrafficSource {
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
  value: string
  change: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  borderColor: string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
}

export interface ChartConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    muted: string
  }
  gradients: {
    primary: string[]
    secondary: string[]
  }
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  isLoading: boolean
  isSuccess: boolean
}

export interface FilterState {
  search: string
  dateRange: {
    from: Date | null
    to: Date | null
  }
  status: string[]
  sortBy: 'name' | 'date' | 'revenue'
  sortOrder: 'asc' | 'desc'
}

export interface PaginationState {
  pageIndex: number
  pageSize: number
  totalCount: number
}

export type Theme = 'light' | 'dark' | 'system'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'viewer'
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}