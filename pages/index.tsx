import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import type { User } from '@supabase/supabase-js';

// We will define the Company and Filter interfaces here later
// For now, we just need the layout.

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    getSession();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">EXIM Data Dashboard</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-white text-sm font-medium py-2 px-4 rounded-md"
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
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            {/* Filter controls will go here */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Category</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">HS Code</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
               <button
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                  style={{ backgroundColor: '#2046f5' }}
                >
                  Apply Filters
                </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="w-3/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
             <h3 className="text-lg font-semibold mb-4">Companies</h3>
            {/* Company data table will go here */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg h-96 p-4 text-center text-gray-500">
              Your data table will appear here.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
