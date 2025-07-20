# In nano, paste this entire block (replace existing):
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
    };
    checkSession();
  }, [router]);

  return (
    <div>Dashboard Content</div>
  );
}
