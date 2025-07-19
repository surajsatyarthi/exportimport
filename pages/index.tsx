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

const supabaseUrl = 'https://houzcaefzyxpuigazrvz.supabase.co'; // Your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvdXpjYWVmenl4cHVpZ2F6cnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzI4OTMsImV4cCI6MjA2ODQ0ODg5M30.CDfHn_42zdRo99LJz1qS6qTYMk0EGX-kcrbVn2cbS9A'; // Your Anon Key

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

    if (filters.product_category) query = query.ilike('product_category', filters.product_category);
    if (filters.hs_code) query = query.ilike('hs_code', filters.hs_code);
    if (filters.country) query = query.ilike('country', filters.country);
    if (filters.company_size) query = query.ilike('company_size', filters.company_size);
    if (filters.verified) query = query.eq('verified', filters.verified === 'true');
    if (filters.rating) query = query.gte('rating', parseFloat(filters.rating));

    const { data } = await query;
    setCompanies(data as Company[] || []);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Export-Import Company Database</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          name="product_category"
          placeholder="Product Category"
          onChange={handleFilterChange}
          className="border p-2"
        />
        <input
          name="hs_code"
          placeholder="HS Code"
          onChange={handleFilterChange}
          className="border p-2"
        />
        <input
          name="country"
          placeholder="Country"
          onChange={handleFilterChange}
          className="border p-2"
        />
        <input
          name="company_size"
          placeholder="Company Size"
          onChange={handleFilterChange}
          className="border p-2"
        />
        <select
          name="verified"
          onChange={handleFilterChange}
          className="border p-2"
        >
          <option value="">Verified</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input
          name="rating"
          type="number"
          placeholder="Min Rating"
          onChange={handleFilterChange}
          className="border p-2"
        />
        <button
          onClick={fetchCompanies}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Apply Filters
        </button>
      </div>
      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Company Name</th>
            <th className="border p-2">Country</th>
            <th className="border p-2">Product Category</th>
            <th className="border p-2">HS Code</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Website</th>
            <th className="border p-2">Phone</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="border p-2">{company.company_name}</td>
              <td className="border p-2">{company.country}</td>
              <td className="border p-2">{company.product_category}</td>
              <td className="border p-2">{company.hs_code}</td>
              <td className="border p-2">{company.email}</td>
              <td className="border p-2">{company.website}</td>
              <td className="border p-2">{company.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}