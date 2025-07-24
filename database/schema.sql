-- BMN Connect Database Schema
-- This file contains the SQL commands to set up the database structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table - Core entity for export/import companies
CREATE TABLE companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    
    -- Contact information
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    
    -- Trade information
    company_type VARCHAR(20) CHECK (company_type IN ('exporter', 'importer', 'both')) NOT NULL,
    trade_volume VARCHAR(20) CHECK (trade_volume IN ('small', 'medium', 'large', 'enterprise')),
    established_year INTEGER,
    
    -- Product categories (JSON array for flexibility)
    product_categories JSONB DEFAULT '[]'::jsonb,
    hs_codes JSONB DEFAULT '[]'::jsonb,
    
    -- Verification and quality
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP,
    data_quality_score INTEGER DEFAULT 0 CHECK (data_quality_score >= 0 AND data_quality_score <= 100),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_activity_date TIMESTAMP,
    
    -- Search optimization
    search_vector tsvector
);

-- Create indexes for better search performance
CREATE INDEX idx_companies_country ON companies(country);
CREATE INDEX idx_companies_company_type ON companies(company_type);
CREATE INDEX idx_companies_trade_volume ON companies(trade_volume);
CREATE INDEX idx_companies_is_verified ON companies(is_verified);
CREATE INDEX idx_companies_product_categories ON companies USING GIN(product_categories);
CREATE INDEX idx_companies_hs_codes ON companies USING GIN(hs_codes);
CREATE INDEX idx_companies_search_vector ON companies USING GIN(search_vector);
CREATE INDEX idx_companies_created_at ON companies(created_at);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    company_name VARCHAR(255),
    
    -- Subscription information
    subscription_tier VARCHAR(20) DEFAULT 'trial' CHECK (subscription_tier IN ('trial', 'basic', 'premium')),
    subscription_start_date TIMESTAMP,
    subscription_end_date TIMESTAMP,
    
    -- Usage tracking
    searches_count INTEGER DEFAULT 0,
    exports_count INTEGER DEFAULT 0,
    monthly_searches_count INTEGER DEFAULT 0,
    monthly_exports_count INTEGER DEFAULT 0,
    last_reset_date TIMESTAMP DEFAULT NOW(),
    
    -- Preferences
    preferred_countries JSONB DEFAULT '[]'::jsonb,
    preferred_categories JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Search history table
CREATE TABLE search_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    search_query VARCHAR(500),
    filters JSONB DEFAULT '{}'::jsonb,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for search history
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

-- Data quality reports table (for flagging inaccurate data)
CREATE TABLE data_quality_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    reporter_user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    report_type VARCHAR(50) CHECK (report_type IN ('outdated', 'incorrect_contact', 'wrong_category', 'duplicate', 'other')),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Create indexes for data quality reports
CREATE INDEX idx_data_quality_reports_company_id ON data_quality_reports(company_id);
CREATE INDEX idx_data_quality_reports_status ON data_quality_reports(status);
CREATE INDEX idx_data_quality_reports_created_at ON data_quality_reports(created_at);

-- Export logs table (for tracking exports and enforcing limits)
CREATE TABLE export_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    company_ids JSONB NOT NULL,
    export_format VARCHAR(10) CHECK (export_format IN ('csv', 'excel')),
    companies_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for export logs
CREATE INDEX idx_export_logs_user_id ON export_logs(user_id);
CREATE INDEX idx_export_logs_created_at ON export_logs(created_at);

-- Function to update search vector for full-text search
CREATE OR REPLACE FUNCTION update_companies_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.country, '') || ' ' ||
        COALESCE(NEW.city, '') || ' ' ||
        COALESCE(array_to_string(ARRAY(SELECT jsonb_array_elements_text(NEW.product_categories)), ' '), '')
    );
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
CREATE TRIGGER trigger_update_companies_search_vector
    BEFORE INSERT OR UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_companies_search_vector();

-- Function to reset monthly usage counters
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET 
        monthly_searches_count = 0,
        monthly_exports_count = 0,
        last_reset_date = NOW()
    WHERE last_reset_date < DATE_TRUNC('month', NOW());
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_quality_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_logs ENABLE ROW LEVEL SECURITY;

-- Companies are readable by all authenticated users
CREATE POLICY "Companies are viewable by authenticated users" ON companies
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR ALL USING (auth.uid() = id);

-- Users can only access their own search history
CREATE POLICY "Users can view own search history" ON search_history
    FOR ALL USING (auth.uid() = user_id);

-- Users can create data quality reports and view their own
CREATE POLICY "Users can create and view own reports" ON data_quality_reports
    FOR ALL USING (auth.uid() = reporter_user_id);

-- Users can only access their own export logs
CREATE POLICY "Users can view own export logs" ON export_logs
    FOR ALL USING (auth.uid() = user_id);
