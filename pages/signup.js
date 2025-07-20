# In nano, paste this entire block (replace existing):
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Signup successful! Check your email for confirmation!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1>Signup</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-2" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-2" />
      <button onClick={handleSignup} className="bg-green-500 text-white p-2 rounded">Signup</button>
    </div>
  );
}
