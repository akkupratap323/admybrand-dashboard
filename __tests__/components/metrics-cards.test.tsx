import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MetricsCards } from '@/components/metrics-cards'
import { DashboardData } from '@/lib/types'

const mockData: DashboardData = {
  revenue: 284500,
  revenueChange: 12.5,
  users: 12547,
  usersChange: 8.2,
  conversions: 1847,
  conversionsChange: -2.1,
  growthRate: 24.8,
  growthRateChange: 5.3,
  revenueData: [],
  userGrowthData: [],
  trafficData: [],
  tableData: []
}

describe('MetricsCards', () => {
  it('renders loading state correctly', () => {
    render(<MetricsCards isLoading={true} />)
    
    // Should show skeleton cards
    const skeletonCards = screen.getAllByRole('generic')
    expect(skeletonCards.length).toBeGreaterThan(0)
  })

  it('renders metrics cards with data', () => {
    render(<MetricsCards data={mockData} />)
    
    // Check if all metric cards are rendered
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('Conversions')).toBeInTheDocument()
    expect(screen.getByText('Growth Rate')).toBeInTheDocument()
    
    // Check formatted values
    expect(screen.getByText('$284,500.00')).toBeInTheDocument()
    expect(screen.getByText('12,547')).toBeInTheDocument()
    expect(screen.getByText('1,847')).toBeInTheDocument()
    expect(screen.getByText('24.8%')).toBeInTheDocument()
  })

  it('displays trend indicators correctly', () => {
    render(<MetricsCards data={mockData} />)
    
    // Check for positive and negative trend indicators
    const trendUpIcons = screen.getAllByTestId('trending-up')
    const trendDownIcons = screen.getAllByTestId('trending-down')
    
    expect(trendUpIcons.length).toBeGreaterThan(0)
    expect(trendDownIcons.length).toBeGreaterThan(0)
  })

  it('handles metric visibility toggle', async () => {
    render(<MetricsCards data={mockData} />)
    
    const hideAllButton = screen.getByText('Hide All')
    fireEvent.click(hideAllButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Total Revenue')).not.toBeInTheDocument()
    })
    
    const showAllButton = screen.getByText('Show All')
    fireEvent.click(showAllButton)
    
    await waitFor(() => {
      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    })
  })

  it('expands metric details on click', async () => {
    render(<MetricsCards data={mockData} />)
    
    const revenueCard = screen.getByText('Total Revenue').closest('div')
    expect(revenueCard).toBeInTheDocument()
    
    if (revenueCard) {
      fireEvent.click(revenueCard)
      
      await waitFor(() => {
        expect(screen.getByText(/Total revenue generated across all channels/)).toBeInTheDocument()
      })
    }
  })

  it('handles missing data gracefully', () => {
    render(<MetricsCards />)
    
    // Should render with default values
    expect(screen.getByText('$0.00')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<MetricsCards data={mockData} />)
    
    // Check for proper ARIA labels and structure
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-label')
    })
  })

  it('updates in real-time when data changes', () => {
    const { rerender } = render(<MetricsCards data={mockData} />)
    
    expect(screen.getByText('$284,500.00')).toBeInTheDocument()
    
    const updatedData = { ...mockData, revenue: 300000 }
    rerender(<MetricsCards data={updatedData} />)
    
    expect(screen.getByText('$300,000.00')).toBeInTheDocument()
  })
})