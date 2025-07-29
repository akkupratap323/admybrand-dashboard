import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DashboardData, FilterState } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency with proper locale support
export function formatCurrency(
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  if (isNaN(amount) || amount == null) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(0)
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format numbers with proper locale support
export function formatNumber(num: number, locale: string = 'en-US'): string {
  if (isNaN(num) || num == null) {
    return '0'
  }
  
  return new Intl.NumberFormat(locale).format(num)
}

// Format percentage
export function formatPercentage(num: number, decimals: number = 1): string {
  if (isNaN(num) || num == null) {
    return '0.0%'
  }
  
  return `${num.toFixed(decimals)}%`
}

// Format dates
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }
    
    const optionsMap = {
      short: { month: 'short', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions,
      medium: { month: 'short', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions,
      long: { month: 'long', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions
    }
    
    const options = optionsMap[format]
    
    return new Intl.DateTimeFormat('en-US', options).format(dateObj)
  } catch {
    return 'Invalid Date'
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// Download CSV function
export function downloadCSV(data: any[], filename: string): void {
  if (!data.length) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
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
}

// Validate dashboard data
export function validateDashboardData(data: any): data is DashboardData {
  if (!data || typeof data !== 'object') return false
  
  const requiredFields = [
    'revenue', 'revenueChange', 'users', 'usersChange',
    'conversions', 'conversionsChange', 'growthRate', 'growthRateChange',
    'revenueData', 'userGrowthData', 'trafficData', 'tableData'
  ]
  
  return requiredFields.every(field => field in data)
}

// Get contrast color
export function getContrastColor(hexColor: string): string {
  const color = hexColor.replace('#', '')
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

// Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100
  }
  
  return ((current - previous) / previous) * 100
}

// Filter data
export function filterData<T extends Record<string, any>>(
  data: T[],
  filters: Partial<FilterState>
): T[] {
  return data.filter(item => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const searchableFields = ['customer', 'email', 'name', 'title']
      const matches = searchableFields.some(field => 
        item[field]?.toString().toLowerCase().includes(searchTerm)
      )
      if (!matches) return false
    }
    
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(item.status)) return false
    }
    
    return true
  })
}

// Sort data
export function sortData<T extends Record<string, any>>(
  data: T[],
  key: keyof T,
  direction: 'asc' | 'desc'
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    return 0
  })
}