import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        router.push('/login');
      }
    };
    checkSession();
  }, []);

  return (
    <div>Dashboard Content</div>
  );
}
