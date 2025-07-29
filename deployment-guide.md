# Deployment Configuration Guide

## Environment Variables Required

### 1. OpenRouter API Configuration
```bash
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
NEXT_PUBLIC_OPENROUTER_API_URL=https://openrouter.ai/api/v1
```

### 2. Application Configuration
```bash
NEXT_PUBLIC_APP_NAME=ADmyBRAND Insights
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 3. Feature Flags
```bash
NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 4. Environment Settings
```bash
NODE_ENV=production
```

## Vercel Deployment Steps

1. **Set Environment Variables in Vercel Dashboard:**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add all the variables listed above
   - Make sure `OPENROUTER_API_KEY` is set correctly

2. **Verify API Key Format:**
   - OpenRouter API keys should start with `sk-or-v1-`
   - If you don't have an API key, get one from https://openrouter.ai/

3. **Test Environment Variables:**
   ```bash
   # In your Vercel deployment logs, you should see:
   # "Making OpenRouter API request:" when AI chat is used
   ```

## Troubleshooting

### Error: "AI Assistant is not configured"
- Check that `OPENROUTER_API_KEY` is set in Vercel environment variables
- Verify the API key format starts with `sk-or-v1-`

### Error: "Invalid OpenRouter API key format"
- Your API key might be incorrect or from a different service
- Get a new API key from OpenRouter

### Error: "OpenRouter API error: 401"
- API key is invalid or expired
- Check your OpenRouter account and regenerate the key

### Error: "Sorry, I encountered an error"
- Check Vercel function logs for detailed error information
- API might be rate limited or temporarily unavailable

## Testing Locally

1. Create `.env.local` file:
```bash
OPENROUTER_API_KEY=sk-or-v1-your-api-key
NEXT_PUBLIC_OPENROUTER_API_URL=https://openrouter.ai/api/v1
NEXT_PUBLIC_ENABLE_AI_ASSISTANT=true
```

2. Start development server:
```bash
npm run dev
```

3. Test AI assistant functionality

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] API key is valid and has correct format
- [ ] AI assistant feature flag is enabled
- [ ] Deployment successful without build errors
- [ ] AI chat functionality tested in production