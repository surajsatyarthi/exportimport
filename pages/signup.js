import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!email.includes('@') || password.length < 6) return alert('Invalid email or password too short');
    if (password !== confirmPassword) return alert('Passwords do not match');
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.includes('duplicate key value')) {
        alert('User already exists. Log in instead?');
      } else {
        alert(error.message);
      }
    } else {
      alert('Signup successful! Check your email for confirmation!');
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1>Signup</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-2" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-2" />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border p-2 mb-2" />
      <button disabled={loading} onClick={handleSignup} className="bg-green-500 text-white p-2 rounded">{loading ? 'Signing Up...' : 'Signup'}</button>
    </div>
  )
}
