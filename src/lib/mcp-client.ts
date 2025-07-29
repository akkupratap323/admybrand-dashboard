import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

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
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;

  async connect(): Promise<void> {
    try {
      // Spawn the MCP server process
      const serverProcess = spawn('node', ['./mcp-server.js'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Create transport using the spawned process
      this.transport = new StdioClientTransport({
        stdin: serverProcess.stdin,
        stdout: serverProcess.stdout
      });

      // Create and connect the client
      this.client = new Client(
        {
          name: 'admybrand-insights-client',
          version: '0.1.0'
        },
        {
          capabilities: {}
        }
      );

      await this.client.connect(this.transport);
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.transport) {
      await this.client.close();
      this.client = null;
      this.transport = null;
    }
  }

  async getDashboardMetrics(timeRange: '24h' | '7d' | '30d' | '90d' = '30d'): Promise<DashboardMetrics> {
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'get_dashboard_metrics',
            arguments: { timeRange }
          }
        },
        { schema: { type: 'object' } }
      );

      if (result.content?.[0]?.type === 'text') {
        const data = JSON.parse(result.content[0].text);
        return data.metrics;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  async getChartData(
    chartType: 'revenue' | 'userGrowth' | 'traffic',
    timeRange: '24h' | '7d' | '30d' | '90d' = '30d'
  ): Promise<ChartDataPoint[]> {
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'get_chart_data',
            arguments: { chartType, timeRange }
          }
        },
        { schema: { type: 'object' } }
      );

      if (result.content?.[0]?.type === 'text') {
        const data = JSON.parse(result.content[0].text);
        return data.data;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error getting chart data:', error);
      throw error;
    }
  }

  async getCustomerData(page: number = 1, limit: number = 10): Promise<{
    customers: Customer[];
    page: number;
    limit: number;
    totalPages: number;
  }> {
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.request(
        {
          method: 'tools/call',
          params: {
            name: 'get_customer_data',
            arguments: { page, limit }
          }
        },
        { schema: { type: 'object' } }
      );

      if (result.content?.[0]?.type === 'text') {
        const data = JSON.parse(result.content[0].text);
        return {
          customers: data.customers,
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error getting customer data:', error);
      throw error;
    }
  }

  async getResource(uri: string): Promise<any> {
    if (!this.client) {
      throw new Error('MCP client not connected');
    }

    try {
      const result = await this.client.request(
        {
          method: 'resources/read',
          params: { uri }
        },
        { schema: { type: 'object' } }
      );

      if (result.contents?.[0]?.text) {
        return JSON.parse(result.contents[0].text);
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error getting resource:', error);
      throw error;
    }
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