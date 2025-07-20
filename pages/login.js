import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) setError(authError.message);
    else router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Login</h1>
        {error && <p className="text-red-500 mb-4 text-center" role="alert" aria-live="polite">{error}</p>}
        <form onSubmit={handleLogin} aria-label="Login Form" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#2046f5] focus:border-transparent" required aria-required="true" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#2046f5] focus:border-transparent" required aria-required="true" />
          </div>
          <button type="submit" disabled={loading} className="w-full p-2 bg-[#2046f5] text-white rounded-md hover:bg-[#1a3cd1] focus:outline-none focus:ring-2 focus:ring-[#2046f5] focus:ring-opacity-50 transition-all duration-200" aria-label="Login Button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400"><a href="/forgot-password" className="text-[#2046f5] hover:underline">Forgot password?</a></p>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">New user? <a href="/signup" className="text-[#2046f5] hover:underline">Signup</a></p>
        </form>
      </div>
    </div>
  );
}
