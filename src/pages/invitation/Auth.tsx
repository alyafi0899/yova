import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { invitationService } from '../../lib/invitation/invitationService'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    await invitationService.login(email)
    setLoading(false)
    navigate('/invitation/dashboard')
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-nude p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-2xl tracking-wide text-charcoal">YOVA</Link>
          <h2 className="font-display text-4xl text-charcoal mt-6">
            {isLogin ? 'Welcome Back' : 'Join YOVA'}
          </h2>
          <p className="text-muted text-[11px] uppercase tracking-[0.2em] mt-3">
            Premium Wedding Invitations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-muted tracking-widest">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-soft border border-nude px-4 py-3 text-sm focus:outline-none focus:border-mocha transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-muted tracking-widest">Password</label>
            <input
              type="password"
              required
              className="w-full bg-soft border border-nude px-4 py-3 text-sm focus:outline-none focus:border-mocha transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-charcoal text-ivory text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-bold text-mocha uppercase tracking-[0.2em] hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  )
}
