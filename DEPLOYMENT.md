# Deployment Guide for Vercel

## Quick Deploy

The easiest way to deploy this app is with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Manual Deployment Steps

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub, GitLab, or Bitbucket:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Create Vercel Account

1. Go to [https://vercel.com/](https://vercel.com/)
2. Sign up with your GitHub/GitLab/Bitbucket account

### 3. Import Your Project

1. Click "Add New..." → "Project"
2. Select your repository
3. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 4. Add Environment Variables

In the Vercel project settings, add these environment variables:

```
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

**Steps:**
1. Go to Project Settings → Environment Variables
2. Add each variable with its value
3. Select all environments (Production, Preview, Development)
4. Click "Save"

### 5. Deploy

Click "Deploy" and wait for the build to complete (usually 1-2 minutes).

### 6. Test Your Deployment

1. Once deployed, Vercel will provide a URL (e.g., `your-app.vercel.app`)
2. Visit the URL and test the upload flow
3. Upload a short audio file to verify everything works

## Post-Deployment

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning (~30 minutes)

### Monitoring

Vercel provides built-in monitoring:
- Analytics: Track page views and performance
- Logs: View function execution logs
- Speed Insights: Monitor page load times

Access these in your Vercel dashboard.

## Important Notes

### API Route Timeouts

Vercel has API route timeout limits:
- **Hobby (Free)**: 10 seconds
- **Pro**: 60 seconds  
- **Enterprise**: 300 seconds

Our app handles this gracefully:
- Upload happens quickly (streaming)
- Transcription is async with client-side polling
- No long-running API routes

### File Upload Limits

Next.js/Vercel body size limits:
- **Free**: 4.5 MB
- **Pro**: 50 MB

Our streaming approach works around this by streaming files directly through the API route without loading them entirely into memory.

For files larger than 50 MB on Pro, consider:
1. Using direct browser upload to AssemblyAI (requires exposing key or proxy)
2. Using cloud storage (S3, Cloudflare R2) as intermediary

### Cost Considerations

**Vercel (Free Tier):**
- 100 GB bandwidth/month
- 100 GB-hours serverless function execution
- Usually sufficient for personal/small team use

**AssemblyAI (Free Tier):**
- 5 hours transcription/month
- $0.65/hour after that

**OpenAI:**
- GPT-4o-mini: ~$0.15-0.60 per 1M tokens
- Each document generation uses ~1,000-5,000 tokens
- Cost: ~$0.0002-0.003 per document

### Scaling Up

If you exceed free tier limits:

**Vercel:**
- Upgrade to Pro ($20/month) for higher limits

**AssemblyAI:**
- Pay-as-you-go after free hours
- Consider bulk discounts for high volume

**OpenAI:**
- Set up billing and usage limits
- Monitor costs in dashboard

## Troubleshooting Deployment

### Build Fails

**Error: Missing dependencies**
```bash
# Locally verify build works
npm run build
```

**Error: Environment variables not set**
- Check environment variables in Vercel dashboard
- Redeploy after adding variables

### Runtime Errors

**"Internal Server Error"**
- Check Vercel function logs
- Verify API keys are correct
- Ensure API keys are set for all environments

**CORS Errors**
- Not applicable for this app (same-origin requests)
- If issues arise, add CORS headers in API routes

### Performance Issues

**Slow Page Loads**
- Enable Vercel Speed Insights
- Check bundle size: `npm run build` and review output
- Consider code splitting if needed

**Timeout Errors**
- Verify you're on the correct Vercel plan
- Check function execution time in logs
- Our app is designed to avoid timeouts (async + polling)

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

To disable auto-deploy:
1. Project Settings → Git
2. Configure deployment branches

## Environment-Specific Variables

For different API keys in development vs. production:

1. Development: Use `.env.local` locally
2. Preview: Set separate values in Vercel for "Preview" environment
3. Production: Set separate values for "Production" environment

## Security Best Practices

1. ✅ Never commit API keys to Git
2. ✅ Use environment variables for secrets
3. ✅ Rotate API keys periodically
4. ✅ Set up usage alerts in AssemblyAI/OpenAI dashboards
5. ✅ Consider rate limiting for production
6. ✅ Add authentication if app is sensitive

## Rollback

If deployment has issues:

1. Go to Vercel dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Support

- Vercel Docs: [https://vercel.com/docs](https://vercel.com/docs)
- Vercel Support: Available in dashboard (Pro plans get priority)

## Next Steps

After successful deployment:

1. Test with various audio files
2. Monitor usage and costs
3. Set up error tracking (Sentry, LogRocket, etc.)
4. Consider adding authentication
5. Customize template for your use case
6. Share with users! 🚀


