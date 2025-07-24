-- Sample data for BMN Connect MVP
-- This file contains sample companies for testing and demonstration

-- Insert sample companies
INSERT INTO companies (
    name, description, country, city, address, email, phone, website,
    company_type, trade_volume, established_year, product_categories, hs_codes,
    is_verified, verification_date, data_quality_score, last_activity_date
) VALUES 
-- Textile Exporters
(
    'Global Textiles Ltd',
    'Leading manufacturer and exporter of high-quality cotton textiles, fabrics, and garments to international markets.',
    'India',
    'Mumbai',
    '123 Industrial Area, Andheri East, Mumbai 400069',
    'export@globaltextiles.com',
    '+91-22-2345-6789',
    'https://globaltextiles.com',
    'exporter',
    'large',
    1995,
    '["textiles", "cotton", "fabrics", "garments"]'::jsonb,
    '["5208", "6109", "6204"]'::jsonb,
    true,
    '2024-01-15 10:30:00',
    95,
    '2024-01-20 14:22:00'
),

-- Electronics Importers
(
    'TechImport Solutions',
    'Specialized importer of consumer electronics, smartphones, and computer accessories from Asia.',
    'Germany',
    'Berlin',
    'Friedrichstraße 200, 10117 Berlin',
    'info@techimport.de',
    '+49-30-1234-5678',
    'https://techimport.de',
    'importer',
    'medium',
    2010,
    '["electronics", "smartphones", "computers", "accessories"]'::jsonb,
    '["8517", "8471", "8473"]'::jsonb,
    true,
    '2024-01-10 09:15:00',
    88,
    '2024-01-18 11:45:00'
),

-- Food & Agriculture
(
    'Premium Spices Export Co',
    'Export of authentic Indian spices, herbs, and organic food products to global markets.',
    'India',
    'Kerala',
    'Spice Park, Kochi, Kerala 682037',
    'sales@premiumspices.in',
    '+91-484-123-4567',
    'https://premiumspices.in',
    'exporter',
    'medium',
    2005,
    '["spices", "herbs", "organic food", "agriculture"]'::jsonb,
    '["0904", "0910", "2103"]'::jsonb,
    true,
    '2024-01-12 16:20:00',
    92,
    '2024-01-19 08:30:00'
),

-- Automotive Parts
(
    'AutoParts International',
    'Import and distribution of automotive spare parts, components, and accessories.',
    'USA',
    'Detroit',
    '1500 Michigan Ave, Detroit, MI 48226',
    'procurement@autoparts-intl.com',
    '+1-313-555-0123',
    'https://autoparts-intl.com',
    'importer',
    'large',
    1988,
    '["automotive", "spare parts", "components", "accessories"]'::jsonb,
    '["8708", "8409", "8511"]'::jsonb,
    true,
    '2024-01-08 13:45:00',
    90,
    '2024-01-21 10:15:00'
),

-- Machinery Export
(
    'Industrial Machinery Export',
    'Manufacturer and exporter of industrial machinery, equipment, and tools for manufacturing.',
    'China',
    'Shanghai',
    'No. 888 Zhongshan Road, Shanghai 200001',
    'export@indmachinery.cn',
    '+86-21-6234-5678',
    'https://indmachinery.cn',
    'exporter',
    'enterprise',
    1992,
    '["machinery", "industrial equipment", "tools", "manufacturing"]'::jsonb,
    '["8479", "8466", "8207"]'::jsonb,
    true,
    '2024-01-05 11:30:00',
    94,
    '2024-01-22 15:20:00'
),

-- Chemical Importer
(
    'ChemTrade Europe',
    'Specialized importer of industrial chemicals, raw materials, and chemical compounds.',
    'Netherlands',
    'Rotterdam',
    'Westblaak 180, 3012 KN Rotterdam',
    'trading@chemtrade.nl',
    '+31-10-123-4567',
    'https://chemtrade.nl',
    'importer',
    'large',
    2001,
    '["chemicals", "raw materials", "industrial chemicals", "compounds"]'::jsonb,
    '["2902", "2917", "3824"]'::jsonb,
    true,
    '2024-01-14 14:10:00',
    87,
    '2024-01-17 09:45:00'
),

-- Furniture Export
(
    'Wooden Crafts Export',
    'Handcrafted wooden furniture, home decor, and handicrafts for international markets.',
    'Vietnam',
    'Ho Chi Minh City',
    '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    'export@woodencrafts.vn',
    '+84-28-1234-5678',
    'https://woodencrafts.vn',
    'exporter',
    'medium',
    2008,
    '["furniture", "wood products", "handicrafts", "home decor"]'::jsonb,
    '["9403", "4421", "9505"]'::jsonb,
    true,
    '2024-01-11 12:25:00',
    89,
    '2024-01-16 16:30:00'
),

-- Pharmaceutical Importer
(
    'MedImport Solutions',
    'Import and distribution of pharmaceutical products, medical devices, and healthcare supplies.',
    'Brazil',
    'São Paulo',
    'Av. Paulista, 1000, São Paulo, SP 01310-100',
    'imports@medimport.com.br',
    '+55-11-3456-7890',
    'https://medimport.com.br',
    'importer',
    'large',
    2012,
    '["pharmaceuticals", "medical devices", "healthcare", "supplies"]'::jsonb,
    '["3004", "9018", "3005"]'::jsonb,
    true,
    '2024-01-09 10:50:00',
    91,
    '2024-01-20 13:15:00'
),

-- Both Importer/Exporter
(
    'Global Trade Hub',
    'International trading company dealing in both import and export of various commodities.',
    'Singapore',
    'Singapore',
    '1 Raffles Place, #20-61, Singapore 048616',
    'trade@globalhub.sg',
    '+65-6234-5678',
    'https://globalhub.sg',
    'both',
    'enterprise',
    1985,
    '["commodities", "raw materials", "finished goods", "trading"]'::jsonb,
    '["1001", "2601", "7208"]'::jsonb,
    true,
    '2024-01-07 15:40:00',
    96,
    '2024-01-23 11:20:00'
),

-- Small Scale Exporter
(
    'Artisan Crafts Export',
    'Small-scale exporter of handmade crafts, jewelry, and traditional art pieces.',
    'India',
    'Jaipur',
    'C-42, Malviya Nagar, Jaipur, Rajasthan 302017',
    'crafts@artisanexport.in',
    '+91-141-234-5678',
    'https://artisanexport.in',
    'exporter',
    'small',
    2015,
    '["handicrafts", "jewelry", "art", "traditional crafts"]'::jsonb,
    '["7113", "9505", "9701"]'::jsonb,
    false,
    null,
    75,
    '2024-01-15 09:30:00'
),

-- Unverified Company
(
    'Quick Import Co',
    'General import company for various consumer goods and products.',
    'Mexico',
    'Mexico City',
    'Av. Insurgentes Sur 1234, Mexico City',
    'info@quickimport.mx',
    '+52-55-1234-5678',
    null,
    'importer',
    'small',
    2020,
    '["consumer goods", "general products"]'::jsonb,
    '["9999"]'::jsonb,
    false,
    null,
    60,
    '2024-01-10 14:20:00'
),

-- Technology Exporter
(
    'TechExport Solutions',
    'Export of software solutions, IT services, and technology products to global markets.',
    'Israel',
    'Tel Aviv',
    'Rothschild Blvd 1, Tel Aviv 6688101',
    'export@techexport.co.il',
    '+972-3-123-4567',
    'https://techexport.co.il',
    'exporter',
    'medium',
    2018,
    '["software", "IT services", "technology", "digital products"]'::jsonb,
    '["8523", "9999"]'::jsonb,
    true,
    '2024-01-13 11:15:00',
    85,
    '2024-01-21 16:45:00'
);

-- Insert sample user profile (this would typically be created via trigger when user signs up)
-- Note: This is just for testing - in production, user_profiles are created automatically
INSERT INTO user_profiles (
    id, email, full_name, company_name, subscription_tier,
    searches_count, exports_count, monthly_searches_count, monthly_exports_count
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'test@example.com',
    'Test User',
    'Test Company Ltd',
    'trial',
    5,
    2,
    5,
    2
);

-- Insert sample search history
INSERT INTO search_history (user_id, search_query, filters, results_count) VALUES
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'textiles',
    '{"country": "India", "company_type": "exporter"}'::jsonb,
    3
),
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'electronics',
    '{"trade_volume": "medium"}'::jsonb,
    2
),
(
    '00000000-0000-0000-0000-000000000001'::uuid,
    'machinery',
    '{"country": "China", "is_verified": true}'::jsonb,
    1
);

-- Insert sample data quality report
INSERT INTO data_quality_reports (
    company_id, 
    reporter_user_id, 
    report_type, 
    description, 
    status
) VALUES (
    (SELECT id FROM companies WHERE name = 'Quick Import Co' LIMIT 1),
    '00000000-0000-0000-0000-000000000001'::uuid,
    'outdated',
    'Contact information seems outdated, emails are bouncing',
    'pending'
);
