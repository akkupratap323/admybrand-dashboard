import { NextRequest, NextResponse } from 'next/server'
import { getOpenRouterAPI } from '@/lib/openrouter-api'
import { ChatMessage } from '@/lib/chat-types'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const openRouterAPI = getOpenRouterAPI()
    const response = await openRouterAPI.sendMessage(messages as ChatMessage[])
    
    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API Error:', error)
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured. Please add your API key to the environment variables.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to get response from AI assistant. Please try again.' },
      { status: 500 }
    )
  }
}