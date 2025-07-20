# In nano, delete all content with Ctrl+K until blank, then paste this entire block:
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Define interface for Company data
interface Company {
  id: number;
  company_name: string;
  country: string;
  product_category: string;
  hs_code: string;
  company_size: string;
  export_volume: number;
  import_volume: number;
  verified: boolean;
  rating: number;
  email: string;
  website: string;
  phone: string;
}

// Define interface for Filters state
interface Filters {
  product_category: string;
  hs_code: string;
  country: string;
  company_size: string;
  verified: string;
  rating: string;
}

const supabaseUrl = 'https://houzcaefzyxpuigazrvz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdXpjYWVmenl4cHVpZ2F6cnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzI4OTMsImV4cCI6MjA2ODQ0ODg5M30.CDfHn_42zdRo9K2zd9L2hHZz7GbuCyRrQRou';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filters, setFilters] = useState<Filters>({
    product_category: '',
    hs_code: '',
    country: '',
    company_size: '',
    verified: '',
    rating: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    let query = supabase.from('companies').select('*');

    if (filters.product_category) query = query.ilike('product_category', `%${filters.product_category}%`);
    if (filters.hs_code) query = query.ilike('hs_code', `%${filters.hs_code}%`);
    if (filters.country) query = query.ilike('country', `%${filters.country}%`);
    if (filters.company_size) query = query.ilike('company_size', `%${filters.company_size}%`);
    if (filters.verified) query = query.eq('verified', filters.verified === 'true');
    if (filters.rating) query = query.gte('rating', parseFloat(filters.rating) || 0);

    const { data, error } = await query;

    if (error) console.error('Error fetching companies:', error);
    else setCompanies(data || []);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    fetchCompanies();
  };

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4">
      <div className="md:w-1/4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md space-y-4">
        <h2 className="text-xl font-bold">Filters</h2>
        <input name="product_category" placeholder="Product Category" onChange={handleFilterChange} className="w-full border p-2 rounded-md" />
        <input name="hs_code" placeholder="HS Code" onChange={handleFilterChange} className="w-full border p-2 rounded-md" />
        <input name="country" placeholder="Country" onChange={handleFilterChange} className="w-full border p-2 rounded-md" />
        <input name="company_size" placeholder="Company Size" onChange={handleFilterChange} className="w-full border p-2 rounded-md" />
        <select name="verified" onChange={handleFilterChange} className="w-full border p-2 rounded-md">
          <option value="">Verified</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input name="rating" placeholder="Min Rating" onChange={handleFilterChange} className="w-full border p-2 rounded-md" />
        <button onClick={applyFilters} className="w-full bg-[#2046f5] text-white p-2 rounded-md hover:bg-[#1a3cd1] transition-colors">Apply Filters</button>
      </div>
      <div className="md:w-3/4">
        <h1 className="text-2xl font-bold mb-4">Export-Import Company Database</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border p-2">Company Name</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Product Category</th>
              <th className="border p-2">HS Code</th>
              <th className="border p-2">Company Size</th>
              <th className="border p-2">Export Volume</th>
              <th className="border p-2">Import Volume</th>
              <th className="border p-2">Verified</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Website</th>
              <th className="border p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <td className="border p-2">{company.company_name}</td>
                <td className="border p-2">{company.country}</td>
                <td className="border p-2">{company.product_category}</td>
                <td className="border p-2">{company.hs_code}</td>
                <td className="border p-2">{company.company_size}</td>
                <td className="border p-2">{company.export_volume}</td>
                <td className="border p-2">{company.import_volume}</td>
                <th className="border p-2">{company.verified ? 'Yes' : 'No'}</th>
                <th className="border p-2">{company.rating}</th>
                <td className="border p-2">{company.email}</td>
                <td className="border p-2">{company.website}</td>
                <td className="border p-2">{company.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
