import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import type { User } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

// Types for our company data
interface Company {
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

interface SearchFilters {
  query: string;
  country: string;
  company_type: string;
  trade_volume: string;
  product_category: string;
  hs_code: string;
  is_verified: string;
}

interface SearchResponse {
  companies: Company[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    country: '',
    company_type: '',
    trade_volume: '',
    product_category: '',
    hs_code: '',
    is_verified: ''
  });

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        // Load initial data
        searchCompanies();
      }
    };
    getSession();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const searchCompanies = async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value.trim() !== '')
        )
      });

      const response = await fetch(`/api/companies/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResponse = await response.json();
      setCompanies(data.companies);
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
      setTotalCount(data.total_count);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search companies');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    searchCompanies(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    searchCompanies(page);
  };

  const toggleCompanySelection = (companyId: string) => {
    const newSelected = new Set(selectedCompanies);
    if (newSelected.has(companyId)) {
      newSelected.delete(companyId);
    } else {
      newSelected.add(companyId);
    }
    setSelectedCompanies(newSelected);
  };

  const selectAllCompanies = () => {
    if (selectedCompanies.size === companies.length) {
      setSelectedCompanies(new Set());
    } else {
      setSelectedCompanies(new Set(companies.map(c => c.id)));
    }
  };

  const handleExport = async (format: 'csv' | 'excel') => {
    if (selectedCompanies.size === 0) {
      toast.error('Please select companies to export');
      return;
    }

    try {
      const response = await fetch('/api/companies/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_ids: Array.from(selectedCompanies),
          format
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Export failed');
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `companies_export_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Successfully exported ${selectedCompanies.size} companies`);
      setSelectedCompanies(new Set());
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || 'Export failed');
    }
  };

  const handleReportData = async (companyId: string) => {
    const description = prompt('Please describe the issue with this company data:');
    if (!description) return;

    try {
      const response = await fetch('/api/companies/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: companyId,
          report_type: 'other',
          description
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Report error:', error);
      toast.error('Failed to submit report');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">BMN Connect - Export/Import Database</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-white text-sm font-medium py-2 px-4 rounded-md hover:opacity-90"
              style={{ backgroundColor: '#2046f5' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Vertical Filter Sidebar */}
        <aside className="w-1/4 pr-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Search & Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Query</label>
                <input 
                  type="text" 
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  placeholder="Company name, product, etc."
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input 
                  type="text" 
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  placeholder="e.g., India, Germany"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                <select 
                  value={filters.company_type}
                  onChange={(e) => handleFilterChange('company_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Types</option>
                  <option value="exporter">Exporter</option>
                  <option value="importer">Importer</option>
                  <option value="both">Both</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trade Volume</label>
                <select 
                  value={filters.trade_volume}
                  onChange={(e) => handleFilterChange('trade_volume', e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Volumes</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
                <input 
                  type="text" 
                  value={filters.product_category}
                  onChange={(e) => handleFilterChange('product_category', e.target.value)}
                  placeholder="e.g., textiles, electronics"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HS Code</label>
                <input 
                  type="text" 
                  value={filters.hs_code}
                  onChange={(e) => handleFilterChange('hs_code', e.target.value)}
                  placeholder="e.g., 5208, 8517"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verified Only</label>
                <select 
                  value={filters.is_verified}
                  onChange={(e) => handleFilterChange('is_verified', e.target.value)}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Companies</option>
                  <option value="true">Verified Only</option>
                  <option value="false">Unverified Only</option>
                </select>
              </div>
              
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#2046f5' }}
              >
                {loading ? 'Searching...' : 'Search Companies'}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="w-3/4">
          <div className="bg-white rounded-lg shadow-md">
            {/* Header with export controls */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Companies ({totalCount} results)</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedCompanies.size} selected
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExport('csv')}
                    disabled={selectedCompanies.size === 0}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    disabled={selectedCompanies.size === 0}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Export Excel
                  </button>
                </div>
              </div>
            </div>
            
            {/* Company table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Searching companies...</p>
                </div>
              ) : companies.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No companies found. Try adjusting your search criteria.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedCompanies.size === companies.length && companies.length > 0}
                          onChange={selectAllCompanies}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedCompanies.has(company.id)}
                            onChange={() => toggleCompanySelection(company.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{company.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{company.description}</div>
                            {company.email && (
                              <div className="text-sm text-blue-600">{company.email}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{company.country}</div>
                          {company.city && (
                            <div className="text-sm text-gray-500">{company.city}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            company.company_type === 'exporter' ? 'bg-green-100 text-green-800' :
                            company.company_type === 'importer' ? 'bg-blue-100 text-blue-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {company.company_type}
                          </span>
                          {company.trade_volume && (
                            <div className="text-xs text-gray-500 mt-1 capitalize">{company.trade_volume}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {company.product_categories.slice(0, 2).join(', ')}
                            {company.product_categories.length > 2 && (
                              <span className="text-gray-500"> +{company.product_categories.length - 2} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {company.is_verified ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                Unverified
                              </span>
                            )}
                            <div className="text-xs text-gray-500 ml-2">
                              Score: {company.data_quality_score}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleReportData(company.id)}
                            className="text-sm text-red-600 hover:text-red-900"
                          >
                            Report Issue
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
