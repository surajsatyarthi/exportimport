# BMN Connect Production Deployment Guide

## Step 1: Set Up Production Supabase Database

### 1.1 Create Production Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a **new project** for production
2. Choose a different name from your development project (e.g., "bmn-connect-prod")
3. Select a region close to your target users
4. Note down the new project URL and keys

### 1.2 Set Up Production Database Schema
Run these SQL scripts in your **production** Supabase project (SQL Editor):

**Execute in this order:**
1. `database/schema.sql` - Creates tables, indexes, RLS policies
2. `database/functions.sql` - Creates helper functions and triggers
3. `database/sample_data.sql` - Adds sample data for testing (optional for production)

### 1.3 Configure Production Authentication
1. In Supabase Dashboard → Authentication → Settings
2. Enable "Email" provider
3. Configure email templates for your brand
4. Set up custom SMTP (recommended for production):
   - Go to Authentication → Settings → SMTP Settings
   - Use a service like SendGrid, Mailgun, or AWS SES
   - This ensures reliable email delivery for magic links

### 1.4 Set Up Production Environment Variables
Create these environment variables for production:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
```

## Step 2: Deploy to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Deploy from Command Line
```bash
# Navigate to your project
cd /Users/surajsatyarthi/my-mvp

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### 2.3 Configure Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your production Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your production anon key

### 2.4 Set Custom Domain (Optional)
1. In Vercel dashboard → Domains
2. Add your custom domain (e.g., app.bmnconnect.com)
3. Configure DNS settings as instructed

## Step 3: Alternative - Deploy to Netlify

If you prefer Netlify:

### 3.1 Build the Application
```bash
npm run build
```

### 3.2 Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=.next
```

### 3.3 Configure Environment Variables in Netlify
1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Add the same environment variables as above

## Step 4: Post-Deployment Setup

### 4.1 Test the Production App
1. Visit your deployed URL
2. Test user registration flow
3. Test company search functionality
4. Test data export features
5. Test data quality reporting

### 4.2 Set Up Monitoring
1. **Supabase Monitoring**: Check database performance in Supabase dashboard
2. **Vercel Analytics**: Enable analytics in Vercel dashboard
3. **Error Tracking**: Consider adding Sentry for error monitoring

### 4.3 Configure Production Security
1. **Supabase RLS**: Ensure Row Level Security is enabled (already done in schema)
2. **CORS Settings**: Configure allowed origins in Supabase
3. **Rate Limiting**: Consider adding rate limiting for API endpoints

## Step 5: Beta User Setup

### 5.1 Create Beta User Accounts
1. Share the production URL with beta users
2. Have them sign up using the magic link flow
3. Monitor user registrations in Supabase dashboard

### 5.2 Monitor Usage
Track these metrics during beta:
- User registrations
- Search queries performed
- Companies exported
- Data quality reports submitted
- User feedback

### 5.3 Gather Feedback
Set up feedback collection:
- Add feedback forms in the app
- Monitor user behavior in analytics
- Track support requests
- Document feature requests

## Quick Deployment Commands

### For Vercel:
```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy
cd /Users/surajsatyarthi/my-mvp
vercel --prod
```

### For Netlify:
```bash
# One-time setup
npm install -g netlify-cli
netlify login

# Deploy
cd /Users/surajsatyarthi/my-mvp
npm run build
netlify deploy --prod --dir=.next
```

## Production Checklist

- [ ] Production Supabase project created
- [ ] Database schema deployed to production
- [ ] Sample data added (optional)
- [ ] Production environment variables configured
- [ ] App deployed to Vercel/Netlify
- [ ] Custom domain configured (optional)
- [ ] Email authentication tested
- [ ] All core features tested in production
- [ ] Beta users invited
- [ ] Monitoring and analytics set up

## Troubleshooting

### Common Issues:
1. **Magic links not working**: Check SMTP configuration in Supabase
2. **Database connection errors**: Verify environment variables
3. **Build failures**: Check for TypeScript errors or missing dependencies
4. **Authentication issues**: Ensure RLS policies are correctly set up

### Support Resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

Your BMN Connect MVP is now ready for production deployment and beta testing!
