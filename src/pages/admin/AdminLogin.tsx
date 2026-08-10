import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface AdminLoginProps {
  onLogin: () => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      onLogin()
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 shadow-sm border border-nude">
        <div className="text-center mb-8">
          <div className="font-display text-2xl text-charcoal">YOVA</div>
          <p className="text-sm text-muted mt-2">Login Admin Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-charcoal uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-nude focus:border-mocha outline-none text-sm transition-colors"
              placeholder="admin@yova.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-charcoal uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-nude focus:border-mocha outline-none text-sm transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-mocha text-white text-sm font-medium hover:bg-mocha-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login Ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
