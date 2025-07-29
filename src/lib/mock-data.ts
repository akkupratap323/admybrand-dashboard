export interface DashboardData {
  metrics: {
    revenue: number
    users: number
    conversions: number
    growthRate: number
  }
  revenueData: {
    date: string
    amount: number
  }[]
  userGrowthData: {
    date: string
    users: number
  }[]
  trafficData: {
    source: string
    users: number
  }[]
  tableData: {
    id: string
    name: string
    email: string
    status: string
    lastActive: string
    revenue: number
  }[]
}

export function generateMockData(): DashboardData {
  return {
    metrics: {
      revenue: 125000,
      users: 5200,
      conversions: 1250,
      growthRate: 12.5
    },
    revenueData: [
      { date: '2024-01', amount: 95000 },
      { date: '2024-02', amount: 102000 },
      { date: '2024-03', amount: 108000 },
      { date: '2024-04', amount: 115000 },
      { date: '2024-05', amount: 120000 },
      { date: '2024-06', amount: 125000 }
    ],
    userGrowthData: [
      { date: '2024-01', users: 4200 },
      { date: '2024-02', users: 4400 },
      { date: '2024-03', users: 4600 },
      { date: '2024-04', users: 4800 },
      { date: '2024-05', users: 5000 },
      { date: '2024-06', users: 5200 }
    ],
    trafficData: [
      { source: 'Direct', users: 2000 },
      { source: 'Organic Search', users: 1500 },
      { source: 'Referral', users: 1000 },
      { source: 'Social', users: 700 }
    ],
    tableData: [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        status: 'active',
        lastActive: '2024-06-28',
        revenue: 2500
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        status: 'active',
        lastActive: '2024-06-27',
        revenue: 1800
      },
      {
        id: '3',
        name: 'Michael Brown',
        email: 'michael@example.com',
        status: 'inactive',
        lastActive: '2024-06-20',
        revenue: 1200
      }
    ]
  }
}