import { NextRequest, NextResponse } from 'next/server'
import { getOpenRouterAPI } from '@/lib/openrouter-api'
import { ChatMessage } from '@/lib/chat-types'

export async function POST(request: NextRequest) {
  try {
    // Check if we're in a server environment
    if (typeof window !== 'undefined') {
      return NextResponse.json(
        { error: 'This API route should only be called from server-side' },
        { status: 500 }
      )
    }

    // Validate environment variables first
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'AI Assistant is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    const { messages } = await request.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Validate messages format
    for (const message of messages) {
      if (!message.role || !message.content) {
        return NextResponse.json(
          { error: 'Invalid message format. Each message must have role and content.' },
          { status: 400 }
        )
      }
    }

    const openRouterAPI = getOpenRouterAPI()
    const response = await openRouterAPI.sendMessage(messages as ChatMessage[])
    
    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API Error:', error)
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please contact support.' },
          { status: 503 }
        )
      }
      
      if (error.message.includes('client side')) {
        return NextResponse.json(
          { error: 'Invalid API usage detected.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('OpenRouter API error')) {
        return NextResponse.json(
          { error: 'AI service is temporarily unavailable. Please try again later.' },
          { status: 503 }
        )
      }
      
      // Log the full error for debugging in production
      console.error('Detailed error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    
    return NextResponse.json(
      { error: 'Sorry, I encountered an error. Please try again or check your connection.' },
      { status: 500 }
    )
  }
}