import { useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Confirm() {
  const router = useRouter()
  const { token, type } = router.query

  useEffect(() => {
    const confirmAuth = async () => {
      if (token && type) {
        const { error } = await supabase.auth.verifyOtp({ token, type })
        if (error) {
          alert('Confirmation failed: ' + error.message)
        } else {
          alert('Confirmed successfully! Redirecting to login...')
          router.push('/login')
        }
      }
    }
    confirmAuth()
  }, [token, type])

  return (
    <div className="container mx-auto p-4">
      <h1>Confirming Your Account</h1>
      <p>Processing your confirmation...</p>
    </div>
  )
}
