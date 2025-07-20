import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        console.log('Checking session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session);
        if (!session) {
          console.log('No session, redirecting to /login');
          router.push('/login');
        } else {
          console.log('Session valid, allowing dashboard');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        router.push('/login');
      }
    })();
  }, []);

  return (
    <div>Dashboard Content</div>
  );
}
