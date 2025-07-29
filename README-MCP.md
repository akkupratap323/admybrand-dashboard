# MCP Integration for ADmyBRAND Insights

This document describes the Model Context Protocol (MCP) integration setup for the ADmyBRAND Insights dashboard.

## Overview

The MCP integration provides a standardized way to expose dashboard data and functionality through tools and resources that can be accessed by AI assistants and other clients.

## Files Added

- `mcp.config.json` - MCP server configuration
- `mcp-server.js` - MCP server implementation
- `src/lib/mcp-client.ts` - TypeScript client for MCP integration

## Available Tools

### 1. `get_dashboard_metrics`
Get current dashboard metrics including revenue, users, conversions, and growth rate.

**Parameters:**
- `timeRange` (optional): '24h', '7d', '30d', or '90d' (default: '30d')

### 2. `get_chart_data`
Get chart data for revenue, user growth, or traffic analytics.

**Parameters:**
- `chartType` (required): 'revenue', 'userGrowth', or 'traffic'
- `timeRange` (optional): '24h', '7d', '30d', or '90d' (default: '30d')

### 3. `get_customer_data`
Get customer table data with pagination.

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of customers per page (default: 10)

## Available Resources

### 1. `admybrand://metrics`
Current dashboard metrics and KPIs in JSON format.

### 2. `admybrand://analytics`
Complete analytics data including all chart types in JSON format.

## Usage

### Running the MCP Server
```bash
npm run mcp:server
```

### Testing the Setup
```bash
npm run mcp:test
```

### Using the TypeScript Client
```typescript
import { getMCPClient } from '@/lib/mcp-client';

// Get dashboard metrics
const client = await getMCPClient();
const metrics = await client.getDashboardMetrics('30d');

// Get chart data
const revenueData = await client.getChartData('revenue', '7d');

// Get customer data
const customers = await client.getCustomerData(1, 10);
```

## Configuration

The MCP server is configured to run as a standalone Node.js process. The configuration in `mcp.config.json` can be used by MCP-compatible clients to automatically discover and connect to the server.

## Development

The MCP server generates mock data similar to the main dashboard application. For production use, you would replace the mock data generation with actual database queries or API calls to your backend services.

## Troubleshooting

1. **Import errors**: Make sure `"type": "module"` is set in package.json
2. **Connection issues**: Ensure the MCP server process is running before attempting client connections
3. **Data format**: All data is returned in JSON format with timestamps for tracking freshness