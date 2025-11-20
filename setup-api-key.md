🚀 API KEY SETUP GUIDE - FOLLOW THESE STEPS:

## STEP 1: Get Your Anthropic API Key
1. Go to: https://console.anthropic.com/
2. Sign up or log in to your Anthropic account
3. Click on "Get API Keys" or "Create Key"
4. Create a new key named "DentEdTech GDC Analyzer"
5. COPY the entire key (it should start with `sk-ant-api` and be 40+ characters)

## STEP 2: Add to Netlify Environment Variables
1. Go to: https://app.netlify.com/
2. Click on your site "gdc-dental-analyzer"
3. Go to: Site settings → Environment variables
4. Click "Edit variables"
5. Add a new variable:
   - Key: ANTHROPIC_API_KEY
   - Value: [PASTE YOUR API KEY HERE]
6. Click "Save"

## STEP 3: Redeploy Your Site
1. In Netlify dashboard, go to "Deploys"
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Wait for deployment to complete (green checkmark ✅)

## STEP 4: Verify It Works
After deployment, test:
1. Health check: https://gdc-dental-analyzer.netlify.app/.netlify/functions/health-check
2. Should show: "status": "configured" instead of "not-configured"

## TROUBLESHOOTING:
- ✅ Key must start with: sk-ant-api
- ✅ Key must be 40+ characters long
- ✅ No spaces before/after the key
- ✅ Must be from Anthropic, not OpenAI
- ✅ Redeploy after adding the key

Your platform is 100% ready - just need that API key! 🎯
