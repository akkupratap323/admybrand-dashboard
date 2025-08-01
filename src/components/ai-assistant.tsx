"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  Send,
  Minimize2,
  Maximize2,
  X,
  Sparkles,
  MessageCircle,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Zap,
  Brain,
  TrendingUp,
  BarChart3,
  Users,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ChatMessage } from "@/lib/chat-types"
import { 
  getDashboardSystemPrompt, 
  getQuickQuestions 
} from "@/lib/ai-prompts"
import { DashboardContext } from "@/components/ai-dashboard-context"
import { cn } from "@/lib/utils"

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  onToggleMinimize?: () => void
  isMinimized?: boolean
}

export function AIAssistant({ 
  isOpen, 
  onClose, 
  onToggleMinimize, 
  isMinimized = false 
}: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI assistant for ADmyBRAND Insights. I can help you understand your analytics, navigate the dashboard, and provide insights about your data. What would you like to know?',
      timestamp: Date.now(),
      id: '1'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [showContext, setShowContext] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const quickQuestions = getQuickQuestions()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const generateMessageId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim()
    if (!text || isLoading) return

    // Check if AI assistant is enabled
    if (process.env.NEXT_PUBLIC_ENABLE_AI_ASSISTANT !== 'true') {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: '⚠️ AI Assistant is currently disabled. Please contact your administrator to enable this feature.',
        timestamp: Date.now(),
        id: generateMessageId()
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
      id: generateMessageId()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setIsStreaming(true)
    setShowContext(false) // Hide context when user starts chatting

    // Add system prompt for context
    const systemMessage: ChatMessage = {
      role: 'system',
      content: getDashboardSystemPrompt()
    }

    // Create assistant message placeholder for streaming
    const assistantMessageId = generateMessageId()
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      id: assistantMessageId
    }

    setMessages(prev => [...prev, assistantMessage])

    try {
      const conversationMessages = [systemMessage, ...messages.slice(-6), userMessage]
      
      // Call our API route instead of OpenRouter directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationMessages }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response from AI assistant')
      }

      const data = await response.json()
      
      // Update the assistant message with the response
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: data.response }
            : msg
        )
      )
    } catch (error) {
      console.error('Error sending message:', error)
      let errorMessage = '❌ Sorry, I encountered an error. Please try again or check your connection.'
      
      if (error instanceof Error) {  
        // Check for specific error types
        if (error.message.includes('API key') || error.message.includes('not configured')) {
          errorMessage = '🔑 AI Assistant is not properly configured. Please contact support.'
        } else if (error.message.includes('503') || error.message.includes('temporarily unavailable')) {
          errorMessage = '⏳ AI service is temporarily unavailable. Please try again in a few moments.'
        } else if (error.message.includes('401') || error.message.includes('unauthorized')) {
          errorMessage = '🔒 AI service authentication failed. Please contact support.'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = '🌐 Network error. Please check your internet connection and try again.'
        } else if (error.message.includes('timeout')) {
          errorMessage = '⏱️ Request timed out. Please try again with a shorter message.'
        }
        
        // Log detailed error for debugging
        console.error('AI Assistant Error Details:', {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        })
      }
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: errorMessage }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
    handleSendMessage(question)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // Could add a toast notification here
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: '👋 Chat cleared! How can I help you with your analytics dashboard?',
        timestamp: Date.now(),
        id: generateMessageId()
      }
    ])
    setShowContext(true) // Show context again when chat is cleared
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* AI Assistant Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0
        }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
          "fixed bg-background border shadow-2xl rounded-xl z-50 overflow-hidden",
          "flex flex-col",
          // Mobile: Full screen modal with proper margins
          "inset-4 max-h-[calc(100vh-2rem)]",
          // Tablet: Positioned modal with better spacing
          "sm:inset-6 sm:max-h-[calc(100vh-3rem)]",
          // Desktop: Fixed size with proper positioning
          "lg:bottom-4 lg:right-4 lg:left-auto lg:top-auto lg:w-[600px] lg:h-[600px] lg:max-h-[85vh]",
          // Large desktop: Better positioning to avoid overlap with sidebar
          "xl:right-6 xl:w-[650px] xl:h-[650px]",
          // When minimized, adjust size accordingly
          isMinimized && "lg:h-auto lg:w-[400px] xl:w-[420px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-background"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base sm:text-lg flex items-center truncate">
                <span className="truncate">AI Assistant</span>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 text-yellow-500 flex-shrink-0" />
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {isStreaming ? (
                  <span className="flex items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-1"
                    >
                      <Brain className="w-3 h-3" />
                    </motion.div>
                    Thinking...
                  </span>
                ) : (
                  "Powered by GPT-3.5 Turbo"
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {onToggleMinimize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hidden lg:flex"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              title="Clear chat"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
              title="Close"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Quick Questions */}
            <div className="p-3 sm:p-4 border-b bg-muted/30">
              <div className="flex items-center mb-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Quick Questions</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {quickQuestions.slice(0, 4).map((question, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickQuestion(question)}
                    className="px-2 py-1 sm:px-3 sm:py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors 
                               max-w-[120px] sm:max-w-[160px] lg:max-w-none truncate
                               hidden last:block sm:block
                               [&:nth-child(-n+2)]:block"
                    title={question}
                  >
                    <span className="sm:hidden">
                      {question.length > 18 ? question.substring(0, 18) + '...' : question}
                    </span>
                    <span className="hidden sm:inline">
                      {question.length > 30 ? question.substring(0, 30) + '...' : question}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-background to-muted/20">
              {/* Dashboard Context - Show when no conversation started */}
              {showContext && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4"
                >
                  <DashboardContext onQuestionClick={handleQuickQuestion} />
                </motion.div>
              )}

              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-start space-x-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                      message.role === 'user' 
                        ? "bg-primary text-primary-foreground ml-12" 
                        : "bg-card border"
                    )}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      
                      {message.role === 'assistant' && message.content && (
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyMessage(message.content)}
                              className="h-6 px-2 text-xs"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-card border rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                          className="w-2 h-2 bg-primary/60 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t bg-card">
              <div className="flex items-center space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about your dashboard..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1 text-sm sm:text-base"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    </motion.div>
                  ) : (
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground gap-2">
                <span className="flex-shrink-0">Press Enter to send</span>
                <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
                  <span className="flex items-center flex-shrink-0">
                    <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">Analytics Expert</span>
                    <span className="sm:hidden">Expert</span>
                  </span>
                  <span className="flex items-center flex-shrink-0">
                    <BarChart3 className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="hidden sm:inline">Dashboard Helper</span>
                    <span className="sm:hidden">Helper</span>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </>
  )
}

// Floating AI Assistant Button
interface AIAssistantButtonProps {
  onClick: () => void
  hasNewMessage?: boolean
}

export function AIAssistantButton({ onClick, hasNewMessage = false }: AIAssistantButtonProps) {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 relative group"
      >
        <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
        
        {hasNewMessage && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full border-2 border-background"
          />
        )}
        
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-30"
        />

        {/* Keyboard shortcut tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Assistant (⌘J)
        </div>
      </motion.button>
    </div>
  )
}