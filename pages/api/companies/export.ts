import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export interface ExportRequest {
  company_ids: string[];
  format: 'csv' | 'excel';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { company_ids, format }: ExportRequest = req.body;

    // Validate request
    if (!company_ids || !Array.isArray(company_ids) || company_ids.length === 0) {
      return res.status(400).json({ error: 'Company IDs are required' });
    }

    if (!format || !['csv', 'excel'].includes(format)) {
      return res.status(400).json({ error: 'Invalid export format' });
    }

    // Check user's subscription tier and export limits
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('subscription_tier, monthly_exports_count')
      .eq('id', session.user.id)
      .single();

    if (profileError || !userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Apply export limits based on subscription tier
    const exportLimits = {
      trial: 10,
      basic: 100,
      premium: 1000
    };

    const userLimit = exportLimits[userProfile.subscription_tier as keyof typeof exportLimits] || 10;
    
    if (company_ids.length > userLimit) {
      return res.status(403).json({ 
        error: `Export limit exceeded. Your ${userProfile.subscription_tier} plan allows up to ${userLimit} companies per export.`,
        limit: userLimit,
        requested: company_ids.length
      });
    }

    // Check monthly export limits (example: 5 exports per month for trial)
    const monthlyLimits = {
      trial: 5,
      basic: 50,
      premium: 500
    };

    const monthlyLimit = monthlyLimits[userProfile.subscription_tier as keyof typeof monthlyLimits] || 5;
    
    if (userProfile.monthly_exports_count >= monthlyLimit) {
      return res.status(403).json({ 
        error: `Monthly export limit reached. Your ${userProfile.subscription_tier} plan allows ${monthlyLimit} exports per month.`,
        monthly_limit: monthlyLimit,
        current_usage: userProfile.monthly_exports_count
      });
    }

    // Fetch company data
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .in('id', company_ids);

    if (companiesError) {
      console.error('Companies fetch error:', companiesError);
      return res.status(500).json({ error: 'Failed to fetch company data' });
    }

    if (!companies || companies.length === 0) {
      return res.status(404).json({ error: 'No companies found' });
    }

    // Generate export data
    const exportData = companies.map(company => ({
      'Company Name': company.name,
      'Description': company.description || '',
      'Country': company.country,
      'City': company.city || '',
      'Address': company.address || '',
      'Email': company.email || '',
      'Phone': company.phone || '',
      'Website': company.website || '',
      'Company Type': company.company_type,
      'Trade Volume': company.trade_volume || '',
      'Established Year': company.established_year || '',
      'Product Categories': Array.isArray(company.product_categories) 
        ? company.product_categories.join(', ') 
        : '',
      'HS Codes': Array.isArray(company.hs_codes) 
        ? company.hs_codes.join(', ') 
        : '',
      'Verified': company.is_verified ? 'Yes' : 'No',
      'Verification Date': company.verification_date || '',
      'Data Quality Score': company.data_quality_score || '',
      'Last Activity': company.last_activity_date || ''
    }));

    // Log the export
    await supabase
      .from('export_logs')
      .insert({
        user_id: session.user.id,
        company_ids: company_ids,
        export_format: format,
        companies_count: companies.length
      });

    // Update user export count
    await supabase
      .from('user_profiles')
      .update({ 
        exports_count: userProfile.monthly_exports_count + 1,
        monthly_exports_count: userProfile.monthly_exports_count + 1
      })
      .eq('id', session.user.id);

    if (format === 'csv') {
      // Generate CSV
      const csvHeader = Object.keys(exportData[0]).join(',');
      const csvRows = exportData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
        ).join(',')
      );
      const csvContent = [csvHeader, ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="companies_export_${new Date().toISOString().split('T')[0]}.csv"`);
      res.status(200).send(csvContent);
    } else {
      // For Excel format, we'll return JSON that the frontend can convert to Excel
      // In a production app, you might want to use a library like xlsx to generate actual Excel files
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="companies_export_${new Date().toISOString().split('T')[0]}.json"`);
      res.status(200).json({
        data: exportData,
        metadata: {
          export_date: new Date().toISOString(),
          total_companies: companies.length,
          format: format
        }
      });
    }

  } catch (error) {
    console.error('Export API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
