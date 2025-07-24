# BMN Connect Setup Guide

This guide will help you set up the BMN Connect Export-Import Company Database MVP.

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Git (for version control)

## Step 1: Clone and Install Dependencies

```bash
# Navigate to your project directory
cd /Users/surajsatyarthi/my-mvp

# Install dependencies
npm install
```

## Step 2: Set Up Supabase Database

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2.2 Set Up Database Schema
1. Go to your Supabase dashboard → SQL Editor
2. Run the following SQL files in order:

**First, run `database/schema.sql`:**
- This creates all the tables, indexes, and basic structure
- Sets up Row Level Security (RLS) policies
- Creates triggers for search optimization

**Then, run `database/functions.sql`:**
- This adds helper functions for user management
- Sets up automatic user profile creation
- Adds quality scoring and analytics functions

**Finally, run `database/sample_data.sql`:**
- This populates the database with sample companies for testing
- Adds sample user profiles and search history

### 2.3 Configure Environment Variables
1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Configure Authentication

### 3.1 Enable Email Authentication
1. In Supabase Dashboard → Authentication → Settings
2. Enable "Email" provider
3. Configure email templates (optional)
4. Set up SMTP for production (optional)

### 3.2 Set Up Magic Link Authentication
The app uses magic link (passwordless) authentication:
- Users enter their email
- Supabase sends a magic link
- Clicking the link logs them in

## Step 4: Run the Application

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 5: Test the Application

### 5.1 Sign Up Process
1. Go to `http://localhost:3000/signup`
2. Enter an email address
3. Check your email for the magic link
4. Click the link to confirm your account

### 5.2 Test Search Functionality
1. After logging in, you'll see the dashboard
2. Try searching for companies:
   - Search "textiles" to find textile companies
   - Filter by country: "India"
   - Filter by company type: "exporter"
3. Select companies and test CSV export

### 5.3 Test Data Quality Features
1. Click "Report Issue" on any company
2. Submit a data quality report
3. Check the admin can see reports in the database

## Features Overview

### ✅ Implemented Features
- **User Authentication**: Magic link signup/login
- **Company Search**: Full-text search with filters
- **Advanced Filtering**: By country, type, trade volume, products, HS codes
- **Data Export**: CSV and Excel export with subscription limits
- **Data Quality**: Users can report inaccurate data
- **Responsive UI**: Works on desktop and mobile
- **Pagination**: Efficient browsing of large datasets
- **User Profiles**: Automatic profile creation with usage tracking

### 🔄 Ready for Enhancement
- **Payment Integration**: Stripe integration for subscriptions
- **Admin Dashboard**: For managing companies and reports
- **Advanced Analytics**: User behavior and search analytics
- **Email Notifications**: For data updates and reports
- **API Rate Limiting**: To prevent abuse
- **Company Profiles**: Detailed individual company pages

## Database Schema Overview

### Core Tables
- **companies**: Main company data with search optimization
- **user_profiles**: User subscription and usage tracking
- **search_history**: User search analytics
- **data_quality_reports**: User feedback on data accuracy
- **export_logs**: Track user exports for limits

### Key Features
- **Full-text search**: Optimized search across company data
- **Row Level Security**: Secure data access per user
- **Automatic triggers**: For search indexing and user management
- **Usage tracking**: For subscription limits and analytics

## Subscription Tiers

### Trial (Default)
- 10 companies per export
- 5 exports per month
- Basic search and filtering

### Basic (Future)
- 100 companies per export
- 50 exports per month
- Priority support

### Premium (Future)
- 1000 companies per export
- 500 exports per month
- Advanced analytics
- API access

## Troubleshooting

### Common Issues

**1. "Unauthorized" errors**
- Check your Supabase URL and anon key in `.env.local`
- Ensure RLS policies are set up correctly

**2. Search returns no results**
- Run the sample data SQL to populate test companies
- Check that the search vector trigger is working

**3. Export not working**
- Verify user has a profile in `user_profiles` table
- Check subscription limits in the database

**4. Magic link not received**
- Check spam folder
- Verify SMTP settings in Supabase
- Use a real email address for testing

### Database Debugging

```sql
-- Check if companies exist
SELECT COUNT(*) FROM companies;

-- Check user profile
SELECT * FROM user_profiles WHERE email = 'your-email@example.com';

-- Check search history
SELECT * FROM search_history ORDER BY created_at DESC LIMIT 10;

-- Check data quality reports
SELECT * FROM data_quality_reports ORDER BY created_at DESC;
```

## Next Steps

1. **Add Real Data**: Replace sample data with actual company information
2. **Set Up Production**: Deploy to Vercel/Netlify with production Supabase
3. **Add Payment**: Integrate Stripe for subscription management
4. **Admin Tools**: Build admin dashboard for data management
5. **Analytics**: Add user behavior tracking and insights

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the database schema and API endpoints
3. Check Supabase logs for authentication issues
4. Verify environment variables are set correctly

The application is now ready for development and testing!
