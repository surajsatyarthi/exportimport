import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    })();
  }, [router]);

  return (
    <div>Dashboard Content</div>
  );
}
