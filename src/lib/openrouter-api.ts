// OpenRouter API integration for AI assistant
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
  id?: string
}

export interface OpenRouterResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

class OpenRouterAPI {
  private apiKey: string = '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'
  private baseURL: string = 'https://openrouter.ai/api/v1'
  private model: string = 'openai/gpt-3.5-turbo'

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'ADmyBRAND Insights Dashboard'
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
      }

      const data: OpenRouterResponse = await response.json()
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content
      } else {
        throw new Error('No response from AI assistant')
      }
    } catch (error) {
      console.error('OpenRouter API Error:', error)
      throw new Error('Failed to get response from AI assistant. Please try again.')
    }
  }

  async sendStreamMessage(
    messages: ChatMessage[], 
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'ADmyBRAND Insights Dashboard'
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 1000,
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response stream available')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content
              if (content) {
                onChunk(content)
              }
            } catch (e) {
              // Ignore parsing errors for individual chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('OpenRouter Streaming Error:', error)
      throw new Error('Failed to get streaming response from AI assistant.')
    }
  }
}

export const openRouterAPI = new OpenRouterAPI()

// Dashboard-specific system prompts
export const getDashboardSystemPrompt = (): string => {
  return `You are an AI assistant for the ADmyBRAND Insights analytics dashboard. You help users understand their data, navigate the dashboard, and make data-driven decisions.

Key capabilities:
- Explain analytics metrics and KPIs
- Help interpret charts and data visualizations
- Provide insights about business performance
- Guide users through dashboard features
- Suggest optimization strategies
- Answer questions about data trends

Dashboard sections available:
- Overview: Key metrics, charts, and recent activity
- Real-time: Live data monitoring and updates
- Analytics: Interactive charts and advanced metrics
- Customers: Customer data analysis and segmentation
- Scroll Demo: Animated components showcase
- Reports: Report generation and management

Data context:
- Revenue metrics and growth trends
- User engagement and conversion rates
- Traffic sources and performance data
- Customer analytics and behavior
- Real-time monitoring capabilities

Always provide helpful, accurate information and suggest relevant dashboard features when appropriate. Be concise but informative, and use a professional yet friendly tone.`
}

// Pre-defined quick questions for the dashboard
export const getQuickQuestions = (): string[] => {
  return [
    "How is my revenue trending this month?",
    "What are my top performing metrics?",
    "How can I improve my conversion rate?",
    "Explain the real-time dashboard features",
    "What insights can I get from customer data?",
    "How do I generate custom reports?",
    "What do these chart patterns mean?",
    "How to use the scroll demo features?",
    "Show me key performance indicators",
    "How to export my analytics data?"
  ]
}