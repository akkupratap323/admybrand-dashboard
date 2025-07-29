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
  private apiKey: string
  private baseURL: string
  private model: string = 'openai/gpt-3.5-turbo'

  constructor() {
    // Only initialize API key on server side where environment variables are available
    if (typeof window === 'undefined') {
      // Server side - environment variables are available
      this.apiKey = process.env.OPENROUTER_API_KEY || ''
      this.baseURL = process.env.NEXT_PUBLIC_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'
    } else {
      // Client side - use empty values, API calls should go through /api/chat route
      this.apiKey = ''
      this.baseURL = 'https://openrouter.ai/api/v1'
    }
  }

  private validateApiKey(): void {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not found. Please set OPENROUTER_API_KEY in your environment variables.')
    }
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    this.validateApiKey()

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
    this.validateApiKey()

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

// Lazy instantiation to avoid errors during module loading
let _openRouterAPIInstance: OpenRouterAPI | null = null

export const getOpenRouterAPI = (): OpenRouterAPI => {
  if (!_openRouterAPIInstance) {
    _openRouterAPIInstance = new OpenRouterAPI()
  }
  return _openRouterAPIInstance
}

