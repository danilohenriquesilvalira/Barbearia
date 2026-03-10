import { useState } from 'react'
import { X, Loader2, User, Phone, Scissors, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { isSupabaseConfigured } from '../lib/supabase'
import BarberPole from './BarberPole'

interface AuthModalProps {
  onClose:   () => void
  onSuccess: () => void
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { signInWithGoogle, completeProfile, needsProfile, user } = useAuth()
  const { t } = useLanguage()

  const [step]                = useState<'choose' | 'complete_profile'>(needsProfile ? 'complete_profile' : 'choose')
  const [name, setName]       = useState(user?.name ?? '')
  const [phone, setPhone]     = useState(user?.phone ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  if (!isSupabaseConfigured) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-off-black/90 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-off-black-2 border-2 border-paper/10 animate-slide-up">
          <BarberPole height="4px" />
          <div className="p-10 text-center space-y-3">
            <Scissors size={32} className="text-gold/40 mx-auto" />
            <p className="font-display text-xl text-paper">Configuração necessária</p>
            <p className="font-body text-sm text-paper-muted">Ficheiro .env.local não configurado.</p>
            <button onClick={onClose} className="mt-2 px-6 py-3 border border-paper/20 text-paper-muted font-mono text-xs tracking-widest uppercase hover:border-gold/50 hover:text-gold transition-colors">{t('booking.close')}</button>
          </div>
        </div>
      </div>
    )
  }

  const handleGoogle = async () => {
    setLoading(true)
    await signInWithGoogle()
  }

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    const result = await completeProfile(name.trim(), phone.trim())
    setLoading(false)
    if (result === 'ok') { onSuccess() }
    else setError(t('auth.saveError'))
  }

  const showClose = step !== 'complete_profile'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-off-black/90 backdrop-blur-sm"
        onClick={!loading && showClose ? onClose : undefined}
      />

      <div className="relative w-full max-w-md bg-off-black-2 border-2 border-paper/10 animate-slide-up overflow-hidden">
        <BarberPole height="5px" />

        {/* ── CHOOSE ───────────────────────────────────────────────────────── */}
        {step === 'choose' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-0">
              <div>
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-gold/70 mb-1">
                  Connect Barber
                </p>
                <h2 className="font-display text-3xl text-paper font-semibold leading-tight">
                  {t('auth.areaTitle')}
                </h2>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-2.5 border border-paper/10 hover:border-gold/50 hover:text-gold text-paper-muted transition-colors disabled:opacity-30 flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Linha decorativa */}
            <div className="mx-8 mt-5 h-px bg-gradient-to-r from-gold/40 via-gold/20 to-transparent" />

            <div className="px-8 py-8 space-y-6">
              {/* Texto intro */}
              <p className="font-body text-paper-muted leading-relaxed">
                {t('auth.areaIntro')}
              </p>

              {/* Botão Google — grande e destacado */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 py-5 bg-white text-[#1f1f1f] font-body font-semibold text-base hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 shadow-lg"
              >
                {loading
                  ? <Loader2 size={22} className="animate-spin text-gray-400" />
                  : <GoogleIcon />
                }
                {loading ? t('auth.redirecting') : t('auth.googleBtn')}
              </button>

              {/* Garantias */}
              <div className="space-y-2.5 pt-1">
                {[t('auth.guarantee1'), t('auth.guarantee2'), t('auth.guarantee3')].map(txt => (
                  <div key={txt} className="flex items-center gap-2.5">
                    <ShieldCheck size={13} className="text-gold/60 flex-shrink-0" />
                    <span className="font-body text-xs text-paper/40">{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rodapé com nota RGPD */}
            <div className="px-8 py-4 border-t border-paper/5 bg-off-black/40">
              <p className="font-mono text-[10px] text-paper/20 tracking-widest text-center uppercase">
                {t('auth.gdprNote')}
              </p>
            </div>
          </>
        )}

        {/* ── COMPLETE PROFILE ─────────────────────────────────────────────── */}
        {step === 'complete_profile' && (
          <>
            <div className="px-8 pt-8 pb-0">
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-gold/70 mb-1">
                {t('auth.lastStep')}
              </p>
              <h2 className="font-display text-3xl text-paper font-semibold leading-tight">
                {t('auth.profileTitle')}
              </h2>
              <div className="mt-5 h-px bg-gradient-to-r from-gold/40 via-gold/20 to-transparent" />
            </div>

            <form onSubmit={handleCompleteProfile} className="px-8 py-8 space-y-5">
              <p className="font-body text-paper-muted leading-relaxed">
                {t('auth.profileIntro')}
              </p>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-2">
                  <User size={9} className="inline mr-1.5" />{t('auth.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t('auth.namePlaceholder')}
                  autoFocus
                  className="w-full bg-off-black border-2 border-paper/10 focus:border-gold text-paper font-body text-base px-5 py-3.5 outline-none transition-colors placeholder:text-paper/20"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-2">
                  <Phone size={9} className="inline mr-1.5" />{t('auth.phone')} <span className="text-paper/30 normal-case tracking-normal font-body text-[10px]">{t('auth.phoneOptional')}</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+351 912 345 678"
                  className="w-full bg-off-black border-2 border-paper/10 focus:border-gold text-paper font-mono text-sm px-5 py-3.5 outline-none transition-colors placeholder:text-paper/20"
                />
              </div>

              {error && (
                <p className="text-barber-red font-body text-sm border-l-2 border-barber-red pl-3 animate-fade-in">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full py-4 bg-gold text-off-black font-body font-semibold text-sm tracking-[0.2em] uppercase border-2 border-gold hover:bg-transparent hover:text-gold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> {t('auth.saving')}</>
                  : t('auth.saveBtn')
                }
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
