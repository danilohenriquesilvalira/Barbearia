import { useState } from 'react'
import { X, Loader2, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import BarberPole from './BarberPole'

type Mode = 'login' | 'register'

interface AuthModalProps {
  onClose:   () => void
  onSuccess: () => void
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { login, register } = useAuth()
  const { t } = useLanguage()

  const [mode, setMode]           = useState<Mode>('login')
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [phone, setPhone]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const reset = () => {
    setName(''); setEmail(''); setPhone(''); setPassword('')
    setError(null); setLoading(false)
  }

  const switchMode = (m: Mode) => { setMode(m); reset() }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (mode === 'login') {
      const result = await login(email, password)
      if (result === 'invalid') { setError(t('auth.errorInvalid')); setLoading(false); return }
    } else {
      const result = await register(name, email, phone, password)
      if (result === 'exists') { setError(t('auth.errorExists')); setLoading(false); return }
    }

    setLoading(false)
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-off-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-off-black-2 border-2 border-paper/10 animate-slide-up">
        <BarberPole height="4px" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-paper/5">
          <div className="flex items-center gap-3">
            {mode === 'login'
              ? <LogIn size={18} className="text-gold" />
              : <UserPlus size={18} className="text-gold" />
            }
            <h2 className="font-display text-xl text-paper font-semibold">
              {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-paper/10 hover:border-gold/50 hover:text-gold text-paper-muted transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Hint para o demo */}
        {mode === 'login' && (
          <div className="mx-6 mt-5 px-4 py-3 border border-gold/20 bg-gold/5">
            <p className="font-mono text-[10px] text-gold tracking-widest uppercase mb-1">Demo</p>
            <p className="font-body text-xs text-paper-muted">
              Email: <span className="text-paper font-mono">demo@navalha.pt</span>
              &nbsp;·&nbsp;
              Pass: <span className="text-paper font-mono">demo123</span>
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-paper-muted mb-2">
                {t('auth.name')} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="António Silva"
                className="w-full bg-off-black border-2 border-paper/10 focus:border-gold text-paper font-body text-sm px-4 py-3 outline-none transition-colors placeholder:text-paper/20"
              />
            </div>
          )}

          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-paper-muted mb-2">
              {t('auth.email')} *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@exemplo.pt"
              className="w-full bg-off-black border-2 border-paper/10 focus:border-gold text-paper font-body text-sm px-4 py-3 outline-none transition-colors placeholder:text-paper/20"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block font-mono text-[10px] tracking-widest uppercase text-paper-muted mb-2">
                {t('auth.phone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+351 912 345 678"
                className="w-full bg-off-black border-2 border-paper/10 focus:border-gold text-paper font-mono text-sm px-4 py-3 outline-none transition-colors placeholder:text-paper/20"
              />
            </div>
          )}

          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-paper-muted mb-2">
              {t('auth.password')} *
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-off-black border-2 border-paper/10 focus:border-gold text-paper font-mono text-sm px-4 py-3 pr-12 outline-none transition-colors placeholder:text-paper/20"
              />
              <button
                type="button"
                onClick={() => setShowPwd(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-muted hover:text-gold transition-colors"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Erro */}
          {error && (
            <p className="text-barber-red font-body text-sm border-l-2 border-barber-red pl-3 animate-fade-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gold text-off-black font-body font-semibold text-sm tracking-[0.2em] uppercase border-2 border-gold hover:bg-transparent hover:text-gold transition-all duration-300 flex items-center justify-center gap-2 mt-2"
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" />{mode === 'login' ? t('auth.loggingIn') : t('auth.registering')}</>
              : mode === 'login' ? t('auth.loginBtn') : t('auth.registerBtn')
            }
          </button>

          {/* Switch de modo */}
          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="w-full text-center font-body text-xs text-paper-muted hover:text-gold transition-colors py-1"
          >
            {mode === 'login' ? t('auth.switchToRegister') : t('auth.switchToLogin')}
          </button>
        </form>
      </div>
    </div>
  )
}
