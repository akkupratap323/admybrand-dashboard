# 🤖 AI Assistant Setup Guide

The ADmyBRAND Insights dashboard includes an AI assistant powered by OpenRouter that can help users understand analytics data, navigate the dashboard, and get insights.

## 🔑 API Key Setup

### 1. Get Your OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up or log in to your account
3. Generate a new API key
4. Copy your API key (it starts with `sk-or-v1-...`)

### 2. Configure Environment Variables

#### For Local Development:

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```env
   OPENROUTER_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true
   ```

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `OPENROUTER_API_KEY` = your OpenRouter API key
   - `NEXT_PUBLIC_ENABLE_AI_ASSISTANT` = `true`
   - `NEXT_PUBLIC_OPENROUTER_API_URL` = `https://openrouter.ai/api/v1`

## 🚀 Features

The AI assistant can help with:

- **Analytics Explanation**: Understand metrics and KPIs
- **Data Interpretation**: Explain chart patterns and trends
- **Dashboard Navigation**: Guide users through features
- **Business Insights**: Provide data-driven recommendations
- **Feature Discovery**: Help users find relevant dashboard sections

## 🛡️ Security Features

- ✅ API keys stored securely in environment variables
- ✅ No API keys exposed in client-side code
- ✅ Feature can be disabled via environment variable
- ✅ Proper error handling for missing API keys
- ✅ Environment files excluded from version control

## 🎯 Quick Questions

The AI assistant comes with pre-configured quick questions:

- "How is my revenue trending this month?"
- "What are my top performing metrics?"
- "How can I improve my conversion rate?"
- "Explain the real-time dashboard features"
- "What insights can I get from customer data?"

## 🔧 Troubleshooting

### AI Assistant Not Working?

1. **Check API Key**: Ensure `OPENROUTER_API_KEY` is set correctly
2. **Check Feature Flag**: Verify `NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true`
3. **Check Console**: Look for error messages in browser developer tools
4. **Restart Server**: After changing environment variables, restart your development server

### Common Error Messages:

- **"API key is not configured"**: Add your OpenRouter API key to environment variables
- **"AI Assistant is currently disabled"**: Set `NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true`
- **Network errors**: Check your internet connection and API key validity

## 📊 Usage Analytics

The AI assistant integrates with the dashboard's analytics context, providing:

- Real-time data awareness
- Dashboard section knowledge
- Metric explanations
- Business intelligence insights

## 🎨 UI Features

- **Floating Action Button**: Click the AI button in bottom-right corner
- **Keyboard Shortcut**: Press `⌘J` (or `Ctrl+J`) to open AI assistant
- **Streaming Responses**: Real-time response generation
- **Message History**: Conversation context maintained
- **Quick Actions**: Copy responses, thumbs up/down feedback
- **Minimizable Interface**: Collapse to save screen space

---

**Need Help?** Check the main README.md for general setup instructions or create an issue in the repository.