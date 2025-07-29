// OpenRouter API integration for AI assistant
import { ChatMessage, OpenRouterResponse } from './chat-types'

// Re-export types for backward compatibility
export type { ChatMessage, OpenRouterResponse }

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
      // Client side - throw error since this should never be instantiated on client
      throw new Error('OpenRouter API should not be instantiated on the client side. Use /api/chat route instead.')
    }
  }

  private validateApiKey(): void {
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.error('OpenRouter API validation failed:', {
        hasApiKey: !!this.apiKey,
        apiKeyLength: this.apiKey?.length || 0,
        environment: process.env.NODE_ENV
      })
      throw new Error('OpenRouter API key not found. Please set OPENROUTER_API_KEY in your environment variables.')
    }
    
    // Validate API key format
    if (!this.apiKey.startsWith('sk-or-v1-')) {
      console.error('Invalid OpenRouter API key format')
      throw new Error('Invalid OpenRouter API key format.')
    }
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    this.validateApiKey()

    try {
      const requestBody = {
        model: this.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      }

      console.log('Making OpenRouter API request:', {
        url: `${this.baseURL}/chat/completions`,
        model: this.model,
        messageCount: messages.length
      })

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://admybrand-dashboard.vercel.app',
          'X-Title': 'ADmyBRAND Insights Dashboard'
        },
        body: JSON.stringify(requestBody)
      })

      console.log('OpenRouter API response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('OpenRouter API error response:', errorText)
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data: OpenRouterResponse = await response.json()
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
        return data.choices[0].message.content
      } else {
        console.error('Invalid response structure:', data)
        throw new Error('No valid response from AI assistant')
      }
    } catch (error) {
      console.error('OpenRouter API Error:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        messages: messages.length
      })
      
      if (error instanceof Error) {
        // Re-throw with more context
        throw new Error(`OpenRouter API failed: ${error.message}`)
      }
      
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
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://admybrand-dashboard.vercel.app',
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
  // Only allow instantiation on server side
  if (typeof window !== 'undefined') {
    throw new Error('OpenRouter API should only be used on the server side. Use /api/chat route from client components.')
  }
  
  if (!_openRouterAPIInstance) {
    _openRouterAPIInstance = new OpenRouterAPI()
  }
  return _openRouterAPIInstance
}

