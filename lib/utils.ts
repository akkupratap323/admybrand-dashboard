import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DashboardData, FilterState } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, locale = 'en-US', currency = 'USD'): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00'
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number, locale = 'en-US'): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0'
  }
  
  return new Intl.NumberFormat(locale).format(num)
}

export function formatPercentage(value: number, decimals = 1): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%'
  }
  
  return `${value.toFixed(decimals)}%`
}

export function formatDate(date: string | Date, format: 'short' | 'medium' | 'long' = 'medium'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }
    
    const optionsMap = {
      short: { month: 'short', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions,
      medium: { month: 'short', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions,
      long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions
    }
    
    const options = optionsMap[format]
    
    return new Intl.DateTimeFormat('en-US', options).format(dateObj)
  } catch {
    return 'Invalid Date'
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function validateDashboardData(data: any): data is DashboardData {
  return (
    data &&
    typeof data.revenue === 'number' &&
    typeof data.users === 'number' &&
    Array.isArray(data.revenueData) &&
    Array.isArray(data.userGrowthData) &&
    Array.isArray(data.trafficData) &&
    Array.isArray(data.tableData)
  )
}

export function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export function generateGradient(color: string, direction = 'to-r'): string {
  const variations = {
    light: color.replace(/\/\d+/, '/20'),
    medium: color.replace(/\/\d+/, '/60'),
    dark: color.replace(/\/\d+/, '/90')
  }
  
  return `bg-gradient-${direction} from-${variations.light} via-${variations.medium} to-${variations.dark}`
}

export function filterData<T>(data: T[], filters: Partial<FilterState>): T[] {
  return data.filter((item: any) => {
    // Search filter
    if (filters.search) {
      const searchFields = ['customer', 'email', 'id']
      const matchesSearch = searchFields.some(field => 
        item[field]?.toString().toLowerCase().includes(filters.search!.toLowerCase())
      )
      if (!matchesSearch) return false
    }
    
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(item.status)) return false
    }
    
    // Date range filter
    if (filters.dateRange?.from || filters.dateRange?.to) {
      const itemDate = new Date(item.date)
      if (filters.dateRange.from && itemDate < filters.dateRange.from) return false
      if (filters.dateRange.to && itemDate > filters.dateRange.to) return false
    }
    
    return true
  })
}

export function sortData<T>(data: T[], sortBy: string, sortOrder: 'asc' | 'desc'): T[] {
  return [...data].sort((a: any, b: any) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }
    
    const aStr = String(aValue).toLowerCase()
    const bStr = String(bValue).toLowerCase()
    
    if (sortOrder === 'asc') {
      return aStr.localeCompare(bStr)
    } else {
      return bStr.localeCompare(aStr)
    }
  })
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return formatDate(date, 'short')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export function downloadCSV(data: any[], filename: string): void {
  try {
    const headers = Object.keys(data[0] || {})
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } catch (error) {
    console.error('Failed to download CSV:', error)
  }
}
