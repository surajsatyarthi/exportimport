import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export interface CompanyDetails {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
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
  created_at: string;
  updated_at: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompanyDetails | { error: string }>
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

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Company ID is required' });
    }

    // Fetch company details
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Company fetch error:', error);
      return res.status(404).json({ error: 'Company not found' });
    }

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(200).json(company);

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
