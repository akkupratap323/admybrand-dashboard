// MCP imports commented out to avoid build issues in deployment
// import { Client } from '@modelcontextprotocol/sdk/client/index.js';
// import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
// import { spawn } from 'child_process';

export interface DashboardMetrics {
  revenue: number;
  users: number;
  conversions: number;
  growthRate: string;
}

export interface ChartDataPoint {
  date?: string;
  revenue?: number;
  users?: number;
  source?: string;
  visitors?: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  revenue: number;
  lastActive: string;
}

export class MCPDashboardClient {
  // MCP client functionality disabled for build compatibility
  private client: any = null;
  private transport: any = null;

  async connect(): Promise<void> {
    // MCP connection disabled for deployment compatibility
    console.log('MCP client connection disabled in production build');
    return Promise.resolve();
  }

  async disconnect(): Promise<void> {
    // MCP disconnect disabled for deployment compatibility
    return Promise.resolve();
  }

  async getDashboardMetrics(timeRange: '24h' | '7d' | '30d' | '90d' = '30d'): Promise<DashboardMetrics> {
    // Return mock data for production builds
    return Promise.resolve({
      revenue: 125000,
      users: 1250,
      conversions: 340,
      growthRate: "+12.5%"
    });
  }

  async getChartData(
    chartType: 'revenue' | 'userGrowth' | 'traffic',
    timeRange: '24h' | '7d' | '30d' | '90d' = '30d'
  ): Promise<ChartDataPoint[]> {
    // Return mock chart data for production builds - 50 data points
    const mockData: ChartDataPoint[] = [];
    for (let i = 0; i < 50; i++) {
      mockData.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 15000) + 3000,
        users: Math.floor(Math.random() * 800) + 50,
        visitors: Math.floor(Math.random() * 1500) + 100,
        source: ['Google', 'Facebook', 'Direct', 'Twitter', 'LinkedIn'][Math.floor(Math.random() * 5)]
      });
    }
    return Promise.resolve(mockData);
  }

  async getCustomerData(page: number = 1, limit: number = 10): Promise<{
    customers: Customer[];
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Return mock customer data for production builds - 50 customers
    const firstNames = ["Alice", "Bob", "Carol", "David", "Emma", "Frank", "Grace", "Henry", "Isabel", "Jack", "Kate", "Liam", "Maya", "Noah", "Olivia", "Peter", "Quinn", "Rachel", "Sam", "Tara", "Ulrich", "Vera", "Will", "Xara", "Yuki", "Zoe", "Adam", "Beth", "Chris", "Diana", "Eric", "Fiona", "George", "Hannah", "Ivan", "Julia", "Kevin", "Luna", "Mark", "Nina", "Oscar", "Paula", "Quincy", "Rita", "Steve", "Tina", "Uma", "Victor", "Wendy", "Xavier"];
    const lastNames = ["Johnson", "Smith", "Brown", "Davis", "Wilson", "Miller", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez"];
    
    const mockCustomers: Customer[] = [];
    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
      const revenue = Math.floor(Math.random() * 25000) + 5000;
      const daysAgo = Math.floor(Math.random() * 30);
      const lastActive = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      mockCustomers.push({
        id: i,
        name: `${firstName} ${lastName}`,
        email: email,
        revenue: revenue,
        lastActive: lastActive
      });
    }
    
    // Paginate the results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = mockCustomers.slice(startIndex, endIndex);
    
    return Promise.resolve({
      customers: paginatedCustomers,
      page: page,
      limit: limit,
      totalPages: Math.ceil(mockCustomers.length / limit)
    });
  }

  async getResource(uri: string): Promise<any> {
    // Return mock resource data for production builds
    return Promise.resolve({
      uri: uri,
      data: "Mock resource data",
      timestamp: new Date().toISOString()
    });
  }
}

// Singleton instance for the dashboard
let mcpClient: MCPDashboardClient | null = null;

export async function getMCPClient(): Promise<MCPDashboardClient> {
  if (!mcpClient) {
    mcpClient = new MCPDashboardClient();
    await mcpClient.connect();
  }
  return mcpClient;
}

export async function closeMCPClient(): Promise<void> {
  if (mcpClient) {
    await mcpClient.disconnect();
    mcpClient = null;
  }
}