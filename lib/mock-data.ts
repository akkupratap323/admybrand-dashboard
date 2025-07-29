import { DashboardData, CustomerData, RevenueDataPoint, UserGrowthDataPoint, TrafficSource } from './types'

const CUSTOMER_NAMES = [
  'John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson',
  'Emma Davis', 'Michael Chen', 'Sarah Williams', 'David Rodriguez', 'Lisa Anderson',
  'James Thompson', 'Maria Garcia', 'Robert Taylor', 'Jennifer Martinez', 'William Moore',
  'Ashley Johnson', 'Christopher Lee', 'Amanda White', 'Matthew Harris', 'Jessica Clark'
]

const COMPANIES = [
  'TechCorp', 'InnovateCo', 'GlobalSoft', 'DataDyne', 'CloudTech',
  'NextGen Solutions', 'Digital Dynamics', 'FutureTech', 'SmartSystems', 'TechVision'
]

function generateRandomDate(daysBack: number = 30): string {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
  return date.toISOString().split('T')[0]
}

function generateCustomerData(count: number = 50): CustomerData[] {
  return Array.from({ length: count }, (_, index) => {
    const name = CUSTOMER_NAMES[index % CUSTOMER_NAMES.length]
    const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)]
    const email = `${name.toLowerCase().replace(' ', '.')}@${company.toLowerCase()}.com`
    
    return {
      id: (index + 1).toString().padStart(3, '0'),
      customer: name,
      email,
      status: Math.random() > 0.2 ? 'Active' : 'Inactive' as const,
      revenue: Math.floor(Math.random() * 10000) + 500,
      date: generateRandomDate(60)
    }
  })
}

function generateRevenueData(): RevenueDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  const baseRevenue = 45000
  
  return months.slice(Math.max(0, currentMonth - 11), currentMonth + 1).map((month, index) => ({
    month,
    revenue: baseRevenue + (Math.random() * 20000) + (index * 2000) // Slight upward trend
  }))
}

function generateUserGrowthData(): UserGrowthDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const currentMonth = new Date().getMonth()
  const baseUsers = 1200
  
  return months.slice(Math.max(0, currentMonth - 11), currentMonth + 1).map((month, index) => ({
    month,
    users: baseUsers + Math.floor(Math.random() * 500) + (index * 150) // Growing user base
  }))
}

function generateTrafficData(): TrafficSource[] {
  return [
    { name: 'Organic Search', value: Math.floor(Math.random() * 2000) + 3000, color: '#8884d8' },
    { name: 'Social Media', value: Math.floor(Math.random() * 1500) + 2000, color: '#82ca9d' },
    { name: 'Direct Traffic', value: Math.floor(Math.random() * 1000) + 1500, color: '#ffc658' },
    { name: 'Email Marketing', value: Math.floor(Math.random() * 800) + 1000, color: '#ff7300' },
    { name: 'Referral Links', value: Math.floor(Math.random() * 600) + 800, color: '#8dd1e1' },
    { name: 'Paid Advertising', value: Math.floor(Math.random() * 500) + 600, color: '#d084d0' }
  ]
}

export function generateMockData(): DashboardData {
  const revenueData = generateRevenueData()
  const userGrowthData = generateUserGrowthData()
  const trafficData = generateTrafficData()
  const tableData = generateCustomerData()
  
  // Calculate current totals
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalUsers = userGrowthData[userGrowthData.length - 1]?.users || 0
  const totalConversions = Math.floor(totalUsers * 0.15) // 15% conversion rate
  const totalTraffic = trafficData.reduce((sum, item) => sum + item.value, 0)
  
  // Calculate growth rates (simulate previous period data)
  const revenueChange = Math.random() * 30 - 5 // -5% to +25%
  const usersChange = Math.random() * 20 + 2 // +2% to +22%
  const conversionsChange = Math.random() * 10 - 5 // -5% to +5%
  const growthRate = (totalUsers / (totalUsers - (totalUsers * usersChange / 100))) * 100 - 100
  const growthRateChange = Math.random() * 10 - 2 // -2% to +8%
  
  return {
    revenue: totalRevenue,
    revenueChange: Math.round(revenueChange * 10) / 10,
    users: totalUsers,
    usersChange: Math.round(usersChange * 10) / 10,
    conversions: totalConversions,
    conversionsChange: Math.round(conversionsChange * 10) / 10,
    growthRate: Math.round(growthRate * 10) / 10,
    growthRateChange: Math.round(growthRateChange * 10) / 10,
    revenueData,
    userGrowthData,
    trafficData,
    tableData
  }
}

export async function fetchDashboardData(): Promise<DashboardData> {
  // Simulate API call with random delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
  
  // Simulate occasional errors for testing
  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch dashboard data')
  }
  
  return generateMockData()
}

export function generateRealTimeUpdate(): Partial<DashboardData> {
  return {
    users: Math.floor(Math.random() * 100) + 12500,
    conversions: Math.floor(Math.random() * 50) + 1800,
  }
}
