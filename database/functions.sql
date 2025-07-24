-- Additional database functions for BMN Connect

-- Function to increment user search count
CREATE OR REPLACE FUNCTION increment_user_searches(user_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO user_profiles (id, searches_count, monthly_searches_count)
    VALUES (user_id, 1, 1)
    ON CONFLICT (id) 
    DO UPDATE SET 
        searches_count = user_profiles.searches_count + 1,
        monthly_searches_count = user_profiles.monthly_searches_count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, subscription_tier)
    VALUES (NEW.id, NEW.email, 'trial');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to get user subscription limits
CREATE OR REPLACE FUNCTION get_user_limits(user_id UUID)
RETURNS TABLE(
    subscription_tier TEXT,
    export_limit INTEGER,
    monthly_export_limit INTEGER,
    current_monthly_exports INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.subscription_tier,
        CASE 
            WHEN up.subscription_tier = 'trial' THEN 10
            WHEN up.subscription_tier = 'basic' THEN 100
            WHEN up.subscription_tier = 'premium' THEN 1000
            ELSE 10
        END as export_limit,
        CASE 
            WHEN up.subscription_tier = 'trial' THEN 5
            WHEN up.subscription_tier = 'basic' THEN 50
            WHEN up.subscription_tier = 'premium' THEN 500
            ELSE 5
        END as monthly_export_limit,
        up.monthly_exports_count
    FROM user_profiles up
    WHERE up.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update company data quality score based on reports
CREATE OR REPLACE FUNCTION update_company_quality_score(company_id UUID)
RETURNS void AS $$
DECLARE
    report_count INTEGER;
    resolved_count INTEGER;
    new_score INTEGER;
BEGIN
    -- Count total reports and resolved reports
    SELECT COUNT(*) INTO report_count
    FROM data_quality_reports
    WHERE company_id = company_id;
    
    SELECT COUNT(*) INTO resolved_count
    FROM data_quality_reports
    WHERE company_id = company_id AND status = 'resolved';
    
    -- Calculate new score (base 100, minus 10 for each unresolved report)
    new_score := GREATEST(0, 100 - ((report_count - resolved_count) * 10));
    
    -- Update company score
    UPDATE companies
    SET 
        data_quality_score = new_score,
        updated_at = NOW()
    WHERE id = company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update quality score when reports are added/updated
CREATE OR REPLACE FUNCTION trigger_update_quality_score()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_company_quality_score(COALESCE(NEW.company_id, OLD.company_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_quality_report_change
    AFTER INSERT OR UPDATE OR DELETE ON data_quality_reports
    FOR EACH ROW EXECUTE FUNCTION trigger_update_quality_score();

-- Function to get search suggestions based on popular searches
CREATE OR REPLACE FUNCTION get_search_suggestions(search_term TEXT DEFAULT '', limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    suggestion TEXT,
    frequency INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sh.search_query as suggestion,
        COUNT(*)::INTEGER as frequency
    FROM search_history sh
    WHERE sh.search_query ILIKE '%' || search_term || '%'
        AND sh.search_query IS NOT NULL
        AND LENGTH(sh.search_query) > 0
    GROUP BY sh.search_query
    ORDER BY frequency DESC, sh.search_query
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's recent searches
CREATE OR REPLACE FUNCTION get_user_recent_searches(user_id UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
    search_query TEXT,
    filters JSONB,
    results_count INTEGER,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sh.search_query,
        sh.filters,
        sh.results_count,
        sh.created_at
    FROM search_history sh
    WHERE sh.user_id = user_id
    ORDER BY sh.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get company statistics for admin dashboard
CREATE OR REPLACE FUNCTION get_company_stats()
RETURNS TABLE(
    total_companies INTEGER,
    verified_companies INTEGER,
    exporters INTEGER,
    importers INTEGER,
    both_types INTEGER,
    avg_quality_score NUMERIC,
    countries_count INTEGER,
    recent_additions INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_companies,
        COUNT(*) FILTER (WHERE is_verified = true)::INTEGER as verified_companies,
        COUNT(*) FILTER (WHERE company_type = 'exporter')::INTEGER as exporters,
        COUNT(*) FILTER (WHERE company_type = 'importer')::INTEGER as importers,
        COUNT(*) FILTER (WHERE company_type = 'both')::INTEGER as both_types,
        ROUND(AVG(data_quality_score), 2) as avg_quality_score,
        COUNT(DISTINCT country)::INTEGER as countries_count,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::INTEGER as recent_additions
    FROM companies;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
