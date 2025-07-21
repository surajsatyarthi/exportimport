import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-toastify';
import type { FormEvent } from 'react';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // The same handler works for signup, as Supabase creates a new user if they don't exist.
  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      toast.success('Check your email for the confirmation link!');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h1>
        <p className="text-gray-600 mb-6">By Business Market Network</p>
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white"
              style={{ backgroundColor: '#2046f5' }}
            >
              {loading ? 'Sending...' : 'Sign Up'}
            </button>
          </div>
        </form>
         <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: '#2046f5' }}>
                Log in
            </Link>
        </p>
      </div>
    </div>
  );
}
