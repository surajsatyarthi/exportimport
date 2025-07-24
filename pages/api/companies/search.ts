import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export interface CompanySearchFilters {
  query?: string;
  country?: string;
  company_type?: 'exporter' | 'importer' | 'both';
  trade_volume?: 'small' | 'medium' | 'large' | 'enterprise';
  product_category?: string;
  hs_code?: string;
  is_verified?: boolean;
  page?: number;
  limit?: number;
}

export interface CompanySearchResult {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  email: string;
  phone: string;
  website: string;
  company_type: string;
  trade_volume: string;
  established_year: number;
  product_categories: string[];
  hs_codes: string[];
  is_verified: boolean;
  verification_date: string;
  data_quality_score: number;
  last_activity_date: string;
}

export interface SearchResponse {
  companies: CompanySearchResult[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Parse query parameters
    const {
      query = '',
      country,
      company_type,
      trade_volume,
      product_category,
      hs_code,
      is_verified,
      page = '1',
      limit = '20'
    } = req.query as { [key: string]: string };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build the search query
    let searchQuery = supabase
      .from('companies')
      .select('*', { count: 'exact' });

    // Apply text search if query is provided
    if (query.trim()) {
      searchQuery = searchQuery.textSearch('search_vector', query.trim());
    }

    // Apply filters
    if (country) {
      searchQuery = searchQuery.ilike('country', `%${country}%`);
    }

    if (company_type) {
      searchQuery = searchQuery.eq('company_type', company_type);
    }

    if (trade_volume) {
      searchQuery = searchQuery.eq('trade_volume', trade_volume);
    }

    if (product_category) {
      searchQuery = searchQuery.contains('product_categories', [product_category]);
    }

    if (hs_code) {
      searchQuery = searchQuery.contains('hs_codes', [hs_code]);
    }

    if (is_verified !== undefined) {
      searchQuery = searchQuery.eq('is_verified', is_verified === 'true');
    }

    // Apply pagination and ordering
    searchQuery = searchQuery
      .order('data_quality_score', { ascending: false })
      .order('is_verified', { ascending: false })
      .order('last_activity_date', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: companies, error, count } = await searchQuery;

    if (error) {
      console.error('Search error:', error);
      return res.status(500).json({ error: 'Search failed' });
    }

    // Log the search for analytics and history
    await logSearch(session.user.id, query, {
      country,
      company_type,
      trade_volume,
      product_category,
      hs_code,
      is_verified
    }, count || 0);

    // Update user search count
    await updateUserSearchCount(session.user.id);

    const totalPages = Math.ceil((count || 0) / limitNum);

    const response: SearchResponse = {
      companies: companies || [],
      total_count: count || 0,
      page: pageNum,
      limit: limitNum,
      total_pages: totalPages
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to log search for history and analytics
async function logSearch(
  userId: string, 
  query: string, 
  filters: any, 
  resultsCount: number
) {
  try {
    await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        search_query: query,
        filters: filters,
        results_count: resultsCount
      });
  } catch (error) {
    console.error('Failed to log search:', error);
  }
}

// Helper function to update user search count
async function updateUserSearchCount(userId: string) {
  try {
    await supabase.rpc('increment_user_searches', { user_id: userId });
  } catch (error) {
    console.error('Failed to update search count:', error);
  }
}
