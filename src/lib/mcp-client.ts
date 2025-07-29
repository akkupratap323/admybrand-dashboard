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
    // Return mock chart data for production builds
    const mockData: ChartDataPoint[] = [];
    for (let i = 0; i < 7; i++) {
      mockData.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 10000) + 5000,
        users: Math.floor(Math.random() * 500) + 100,
        visitors: Math.floor(Math.random() * 1000) + 200
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
    // Return mock customer data for production builds
    const mockCustomers: Customer[] = [
      { id: 1, name: "Alice Johnson", email: "alice@example.com", revenue: 15000, lastActive: "2024-01-15" },
      { id: 2, name: "Bob Smith", email: "bob@example.com", revenue: 12000, lastActive: "2024-01-14" },
      { id: 3, name: "Carol Brown", email: "carol@example.com", revenue: 18000, lastActive: "2024-01-13" }
    ];
    
    return Promise.resolve({
      customers: mockCustomers,
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