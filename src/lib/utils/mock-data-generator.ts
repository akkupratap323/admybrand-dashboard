import { faker } from '@faker-js/faker'

export interface AnalyticsData {
  metrics: {
    revenue: number
    revenueGrowth: number
    users: number
    userGrowth: number
    conversions: number
    conversionRate: number
    averageOrderValue: number
  }
  revenueData: {
    date: string
    value: number
    previousValue: number
  }[]
  userGrowthData: {
    date: string
    value: number
    previousValue: number
  }[]
  trafficSources: {
    source: string
    value: number
    change: number
  }[]
  topProducts: {
    name: string
    revenue: number
    sales: number
    category: string
  }[]
  recentCustomers: {
    id: string
    name: string
    email: string
    lastPurchase: string
    totalSpent: number
    status: 'active' | 'inactive' | 'new'
    orders: number
  }[]
  conversionFunnel: {
    stage: string
    value: number
    change: number
  }[]
}

function generateDateRange(days: number): string[] {
  const dates: string[] = []
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

function generateTimeSeriesData(days: number, baseValue: number, volatility: number): number[] {
  const data: number[] = []
  let currentValue = baseValue

  for (let i = 0; i <= days; i++) {
    currentValue *= (1 + (Math.random() * volatility * 2 - volatility))
    data.push(Math.round(currentValue))
  }

  return data
}

export function generateAnalyticsData(): AnalyticsData {
  const days = 30
  const dates = generateDateRange(days)
  
  // Generate revenue data
  const baseRevenue = 100000
  const revenueData = generateTimeSeriesData(days, baseRevenue, 0.02)
  const prevRevenueData = generateTimeSeriesData(days, baseRevenue * 0.9, 0.02)

  // Generate user data
  const baseUsers = 5000
  const userData = generateTimeSeriesData(days, baseUsers, 0.01)
  const prevUserData = generateTimeSeriesData(days, baseUsers * 0.85, 0.01)

  const currentRevenue = revenueData[revenueData.length - 1]
  const prevRevenue = prevRevenueData[prevRevenueData.length - 1]
  const revenueGrowth = ((currentRevenue - prevRevenue) / prevRevenue) * 100

  const currentUsers = userData[userData.length - 1]
  const prevUsers = prevUserData[prevUserData.length - 1]
  const userGrowth = ((currentUsers - prevUsers) / prevUsers) * 100

  const trafficSources = [
    { source: 'Direct', value: 35, change: 5.2 },
    { source: 'Organic Search', value: 28, change: 3.8 },
    { source: 'Social Media', value: 22, change: 7.5 },
    { source: 'Referral', value: 15, change: -2.1 },
  ]

  const conversionFunnel = [
    { stage: 'Visitors', value: currentUsers, change: userGrowth },
    { stage: 'Product Views', value: Math.round(currentUsers * 0.6), change: 4.2 },
    { stage: 'Add to Cart', value: Math.round(currentUsers * 0.3), change: 5.8 },
    { stage: 'Purchases', value: Math.round(currentUsers * 0.15), change: 3.9 },
  ]

  return {
    metrics: {
      revenue: currentRevenue,
      revenueGrowth,
      users: currentUsers,
      userGrowth,
      conversions: Math.round(currentUsers * 0.15),
      conversionRate: 15,
      averageOrderValue: Math.round(currentRevenue / (currentUsers * 0.15))
    },
    revenueData: dates.map((date, i) => ({
      date,
      value: revenueData[i],
      previousValue: prevRevenueData[i]
    })),
    userGrowthData: dates.map((date, i) => ({
      date,
      value: userData[i],
      previousValue: prevUserData[i]
    })),
    trafficSources,
    topProducts: Array.from({ length: 10 }, () => ({
      name: faker.commerce.productName(),
      revenue: Math.round(faker.number.float({ min: 1000, max: 10000 })),
      sales: Math.round(faker.number.float({ min: 10, max: 100 })),
      category: faker.commerce.department()
    })),
    recentCustomers: Array.from({ length: 50 }, () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      lastPurchase: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      totalSpent: Math.round(faker.number.float({ min: 100, max: 2000 })),
      status: faker.helpers.arrayElement(['active', 'inactive', 'new']) as 'active' | 'inactive' | 'new',
      orders: Math.round(faker.number.float({ min: 1, max: 20 }))
    })),
    conversionFunnel
  }
}

export function generateRealtimeUpdate(currentData: AnalyticsData): Partial<AnalyticsData> {
  const volatility = 0.02
  const metrics = { ...currentData.metrics }
  
  // Update revenue
  const revenueChange = metrics.revenue * (1 + (Math.random() * volatility * 2 - volatility))
  metrics.revenue = Math.round(revenueChange)
  metrics.revenueGrowth = ((revenueChange - metrics.revenue) / metrics.revenue) * 100

  // Update users
  const userChange = metrics.users * (1 + (Math.random() * volatility * 2 - volatility))
  metrics.users = Math.round(userChange)
  metrics.userGrowth = ((userChange - metrics.users) / metrics.users) * 100

  // Update conversions
  metrics.conversions = Math.round(metrics.users * 0.15)
  metrics.conversionRate = (metrics.conversions / metrics.users) * 100
  metrics.averageOrderValue = Math.round(metrics.revenue / metrics.conversions)

  return {
    metrics,
    recentCustomers: [
      {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        lastPurchase: new Date().toISOString().split('T')[0],
        totalSpent: Math.round(faker.number.float({ min: 100, max: 2000 })),
        status: 'new',
        orders: 1
      },
      ...currentData.recentCustomers.slice(0, -1)
    ]
  }
}