// AI assistant prompts and utilities - separated to avoid OpenRouter API instantiation

// Dashboard-specific system prompts
export const getDashboardSystemPrompt = (): string => {
  return `You are an AI assistant for the ADmyBRAND Insights analytics dashboard. You help users understand their data, navigate the dashboard, and make data-driven decisions.

Key capabilities:
- Explain analytics metrics and KPIs
- Help interpret charts and data visualizations
- Guide users through dashboard features
- Provide insights and recommendations based on data
- Answer questions about business intelligence and analytics

Please be helpful, accurate, and focus on actionable insights for the user's business analytics needs.`
}

// Quick question suggestions for users
export const getQuickQuestions = (): string[] => {
  return [
    "How is my revenue trending this month?",
    "What are my top performing metrics?",
    "How can I improve my conversion rate?",
    "Explain the real-time dashboard features",
    "What insights can you provide from the current data?",
    "How do I interpret the analytics charts?",
    "What are the key performance indicators I should focus on?",
    "Can you help me understand user engagement metrics?"
  ]
}