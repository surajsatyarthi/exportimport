import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else {
      alert('Logged in! Redirecting to dashboard...')
      router.push('/') // Redirect to home or dashboard
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1>Login</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-2" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-2" />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">Login</button>
    </div>
  )
}
