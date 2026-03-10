import { useState } from 'react'
import { Loader2, Mail, Lock, Eye, EyeOff, Scissors } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BarberPole from './BarberPole'

export default function StaffLoginPage() {
  const { signInWithEmail } = useAuth()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    const result = await signInWithEmail(email.trim(), password)
    setLoading(false)
    if (result === 'error') {
      setError('Email ou password incorretos. Contacte o administrador.')
    }
    // Se ok → AppInner detecta o role e abre BarberApp/AdminApp automaticamente
  }

  return (
    <div className="min-h-screen bg-off-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-off-black-2 border border-white/10 mb-4">
            <Scissors size={22} className="text-gold" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-gold/60 mb-1">
            Connect Barber
          </p>
          <h1 className="font-display text-2xl text-paper font-semibold">
            Área de Funcionários
          </h1>
        </div>

        {/* Card */}
        <div className="bg-off-black-2 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          <BarberPole height="4px" />

          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Email */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                <Mail size={9} className="inline mr-1.5" />Email
              </label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seuemail@connectbarber.pt"
                className="w-full bg-off-black border border-white/[0.08] text-paper font-body text-sm px-4 py-3 rounded-lg outline-none focus:border-gold/40 transition-colors placeholder:text-paper/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-mono text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                <Lock size={9} className="inline mr-1.5" />Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-off-black border border-white/[0.08] text-paper font-body text-sm px-4 py-3 pr-10 rounded-lg outline-none focus:border-gold/40 transition-colors placeholder:text-paper/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-paper/30 hover:text-paper/60 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-barber-red text-xs font-body bg-barber-red/10 border border-barber-red/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full py-3 bg-gold hover:bg-gold-light disabled:opacity-40 text-off-black font-body font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> A entrar…</>
                : 'Entrar no Painel'
              }
            </button>
          </form>
        </div>

        {/* Link de volta */}
        <p className="text-center mt-6 font-body text-xs text-paper/20">
          <a href="/Barbearia/" className="hover:text-paper/40 transition-colors">
            ← Voltar ao site
          </a>
        </p>

      </div>
    </div>
  )
}
