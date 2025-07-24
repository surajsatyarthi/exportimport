import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export interface DataQualityReport {
  company_id: string;
  report_type: 'outdated' | 'incorrect_contact' | 'wrong_category' | 'duplicate' | 'other';
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { company_id, report_type, description }: DataQualityReport = req.body;

    // Validate required fields
    if (!company_id || !report_type || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Company ID, report type, and description are required' 
      });
    }

    // Validate report type
    const validReportTypes = ['outdated', 'incorrect_contact', 'wrong_category', 'duplicate', 'other'];
    if (!validReportTypes.includes(report_type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid report type' 
      });
    }

    // Check if company exists
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', company_id)
      .single();

    if (companyError || !company) {
      return res.status(404).json({ 
        success: false, 
        message: 'Company not found' 
      });
    }

    // Insert the report
    const { error: insertError } = await supabase
      .from('data_quality_reports')
      .insert({
        company_id,
        reporter_user_id: session.user.id,
        report_type,
        description,
        status: 'pending'
      });

    if (insertError) {
      console.error('Report insertion error:', insertError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to submit report' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Thank you for your feedback! We will review this report and take appropriate action.' 
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
