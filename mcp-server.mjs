#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class ADmyBrandInsightsServer {
  constructor() {
    this.server = new Server(
      {
        name: 'admybrand-insights-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_dashboard_metrics',
            description: 'Get current dashboard metrics including revenue, users, conversions',
            inputSchema: {
              type: 'object',
              properties: {
                timeRange: {
                  type: 'string',
                  description: 'Time range for metrics (24h, 7d, 30d, 90d)',
                  enum: ['24h', '7d', '30d', '90d'],
                  default: '30d'
                }
              }
            }
          },
          {
            name: 'get_chart_data',
            description: 'Get chart data for revenue, user growth, or traffic analytics',
            inputSchema: {
              type: 'object',
              properties: {
                chartType: {
                  type: 'string',
                  description: 'Type of chart data to retrieve',
                  enum: ['revenue', 'userGrowth', 'traffic']
                },
                timeRange: {
                  type: 'string',
                  description: 'Time range for chart data',
                  enum: ['24h', '7d', '30d', '90d'],
                  default: '30d'
                }
              },
              required: ['chartType']
            }
          },
          {
            name: 'get_customer_data',
            description: 'Get customer table data with pagination',
            inputSchema: {
              type: 'object',
              properties: {
                page: {
                  type: 'number',
                  description: 'Page number for pagination',
                  default: 1
                },
                limit: {
                  type: 'number',
                  description: 'Number of customers per page',
                  default: 10
                }
              }
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_dashboard_metrics':
            return await this.getDashboardMetrics(args?.timeRange || '30d');
          
          case 'get_chart_data':
            return await this.getChartData(args?.chartType, args?.timeRange || '30d');
          
          case 'get_customer_data':
            return await this.getCustomerData(args?.page || 1, args?.limit || 10);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  setupResourceHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'admybrand://metrics',
            mimeType: 'application/json',
            name: 'Dashboard Metrics',
            description: 'Current dashboard metrics and KPIs'
          },
          {
            uri: 'admybrand://analytics',
            mimeType: 'application/json',
            name: 'Analytics Data',
            description: 'Chart and analytics data for the dashboard'
          }
        ]
      };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'admybrand://metrics':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(await this.getDashboardMetrics('30d'), null, 2)
              }
            ]
          };
        
        case 'admybrand://analytics':
          return {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify({
                  revenue: await this.getChartData('revenue', '30d'),
                  userGrowth: await this.getChartData('userGrowth', '30d'),
                  traffic: await this.getChartData('traffic', '30d')
                }, null, 2)
              }
            ]
          };
        
        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });
  }

  async getDashboardMetrics(timeRange) {
    // Mock data generation similar to the dashboard
    const baseMetrics = {
      revenue: Math.floor(Math.random() * 50000) + 100000,
      users: Math.floor(Math.random() * 5000) + 10000,
      conversions: Math.floor(Math.random() * 1000) + 2000,
      growthRate: (Math.random() * 20 - 5).toFixed(1)
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            timeRange,
            metrics: baseMetrics,
            timestamp: new Date().toISOString()
          }, null, 2)
        }
      ]
    };
  }

  async getChartData(chartType, timeRange) {
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    let data = [];
    
    switch (chartType) {
      case 'revenue':
        data = Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 5000) + 15000
        }));
        break;
      
      case 'userGrowth':
        data = Array.from({ length: days }, (_, i) => ({
          date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          users: Math.floor(Math.random() * 500) + 1000
        }));
        break;
      
      case 'traffic':
        data = [
          { source: 'Direct', visitors: Math.floor(Math.random() * 1000) + 2000 },
          { source: 'Social', visitors: Math.floor(Math.random() * 800) + 1500 },
          { source: 'Search', visitors: Math.floor(Math.random() * 1200) + 1800 },
          { source: 'Referral', visitors: Math.floor(Math.random() * 600) + 800 }
        ];
        break;
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            chartType,
            timeRange,
            data,
            timestamp: new Date().toISOString()
          }, null, 2)
        }
      ]
    };
  }

  async getCustomerData(page, limit) {
    const customers = Array.from({ length: limit }, (_, i) => ({
      id: ((page - 1) * limit) + i + 1,
      name: `Customer ${((page - 1) * limit) + i + 1}`,
      email: `customer${((page - 1) * limit) + i + 1}@example.com`,
      revenue: Math.floor(Math.random() * 10000) + 1000,
      lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            page,
            limit,
            customers,
            totalPages: 10, // Mock total pages
            timestamp: new Date().toISOString()
          }, null, 2)
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ADmyBrand Insights MCP server running on stdio');
  }
}

const server = new ADmyBrandInsightsServer();
server.run().catch(console.error);