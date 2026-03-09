import { useState } from 'react'
import { X, Calendar, Clock, Scissors, User, LogOut, CheckCircle, XCircle } from 'lucide-react'
import { useAuth, type UserBooking } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import BarberPole from './BarberPole'

type Tab = 'upcoming' | 'history' | 'profile'

interface UserDashboardProps {
  onClose: () => void
}

function StatusBadge({ status, labels }: { status: UserBooking['status']; labels: Record<string, string> }) {
  const config = {
    confirmed:  { icon: CheckCircle,  className: 'text-gold border-gold/40 bg-gold/10' },
    completed:  { icon: CheckCircle,  className: 'text-paper-muted border-paper/10 bg-paper/5' },
    cancelled:  { icon: XCircle,      className: 'text-barber-red border-barber-red/30 bg-barber-red/10' },
  }
  const { icon: Icon, className } = config[status]
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 border font-mono text-[10px] tracking-widest uppercase ${className}`}>
      <Icon size={10} />
      {labels[status]}
    </span>
  )
}

function BookingCard({
  booking,
  onCancel,
  statusLabels,
  cancelLabel,
}: {
  booking:      UserBooking
  onCancel?:    (id: string) => void
  statusLabels: Record<string, string>
  cancelLabel:  string
}) {
  const dateFormatted = new Date(booking.date + 'T00:00:00').toLocaleDateString('pt-PT', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div className="border border-gold/20 bg-[#0A0A0A] animate-fade-in overflow-hidden">
      {/* Linha de acento topo */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="p-4 space-y-3">
        {/* Nome do serviço + status */}
        <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-paper/5">
          <h4 className="font-display text-paper font-semibold text-base leading-tight">
            {booking.serviceName}
          </h4>
          <StatusBadge status={booking.status} labels={statusLabels} />
        </div>

        {/* Detalhes */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-paper-muted font-body text-xs">
            <Scissors size={11} className="text-gold/60" />
            {booking.barberName}
          </div>
          <div className="flex items-center gap-2 text-paper-muted font-body text-xs">
            <Calendar size={11} className="text-gold/60" />
            {dateFormatted}
          </div>
          <div className="flex items-center gap-2 text-paper-muted font-body text-xs">
            <Clock size={11} className="text-gold/60" />
            {booking.time}
          </div>
        </div>

        {/* Separador gold */}
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gold/20" />
          <span className="w-1 h-1 bg-gold/40 rotate-45 flex-shrink-0" />
          <div className="h-px flex-1 bg-gold/20" />
        </div>

        {/* Preço + cancelar */}
        <div className="flex items-center justify-between">
          <span className="font-heading text-2xl text-gold">{booking.price}€</span>
          {onCancel && booking.status === 'confirmed' && (
            <button
              onClick={() => onCancel(booking.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-barber-red/30 text-barber-red font-mono text-[10px] tracking-widest uppercase hover:bg-barber-red hover:text-paper transition-all"
            >
              <XCircle size={10} />
              {cancelLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function UserDashboard({ onClose }: UserDashboardProps) {
  const { user, logout, cancelBooking } = useAuth()
  const { t, tr } = useLanguage()
  const [tab, setTab] = useState<Tab>('upcoming')

  if (!user) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = user.bookings.filter(b => {
    const d = new Date(b.date + 'T00:00:00')
    return d >= today && b.status !== 'cancelled'
  }).sort((a, b) => a.date.localeCompare(b.date))

  const history = user.bookings.filter(b => {
    const d = new Date(b.date + 'T00:00:00')
    return d < today || b.status === 'cancelled' || b.status === 'completed'
  }).sort((a, b) => b.date.localeCompare(a.date))

  const handleLogout = () => { logout(); onClose() }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'upcoming', label: tr.dashboard.tabs.upcoming },
    { key: 'history',  label: tr.dashboard.tabs.history  },
    { key: 'profile',  label: tr.dashboard.tabs.profile  },
  ]

  const memberDate = new Date(user.memberSince + 'T00:00:00').toLocaleDateString('pt-PT', {
    month: 'long', year: 'numeric',
  })

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-off-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Painel lateral */}
      <div className="relative w-full sm:w-[420px] h-full bg-off-black-2 border-l border-paper/10 flex flex-col animate-slide-up sm:animate-none overflow-hidden">
        <BarberPole height="4px" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-paper/5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold mb-0.5">
              {t('dashboard.hello')},
            </p>
            <h2 className="font-display text-xl text-paper font-semibold">{user.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-paper/10 hover:border-gold/50 hover:text-gold text-paper-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-paper/5">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`
                flex-1 py-3.5 font-mono text-xs tracking-widest uppercase transition-colors relative
                ${tab === key
                  ? 'text-gold'
                  : 'text-paper-muted hover:text-paper'
                }
              `}
            >
              {label}
              {tab === key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
              {/* Contador */}
              {key === 'upcoming' && upcoming.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gold text-off-black text-[9px] font-bold">
                  {upcoming.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Tab: Próximas */}
          {tab === 'upcoming' && (
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Calendar size={32} className="text-paper/10 mb-4" />
                  <p className="font-elegant italic text-lg text-paper-muted">
                    {t('dashboard.noUpcoming')}
                  </p>
                </div>
              ) : upcoming.map(b => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onCancel={cancelBooking}
                  statusLabels={tr.dashboard.status}
                  cancelLabel={t('dashboard.cancelBooking')}
                />
              ))}
            </div>
          )}

          {/* Tab: Histórico */}
          {tab === 'history' && (
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Clock size={32} className="text-paper/10 mb-4" />
                  <p className="font-elegant italic text-lg text-paper-muted">
                    {t('dashboard.noHistory')}
                  </p>
                </div>
              ) : history.map(b => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  statusLabels={tr.dashboard.status}
                  cancelLabel={t('dashboard.cancelBooking')}
                />
              ))}
            </div>
          )}

          {/* Tab: Perfil */}
          {tab === 'profile' && (
            <div className="space-y-3">
              {/* Avatar */}
              <div className="border border-gold/20 bg-[#0A0A0A] overflow-hidden">
                <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                <div className="flex items-center gap-4 p-4">
                  <div className="w-14 h-14 border-2 border-gold/40 flex items-center justify-center flex-shrink-0 bg-off-black-3">
                    <User size={24} className="text-gold/60" />
                  </div>
                  <div>
                    <p className="font-display text-paper font-semibold">{user.name}</p>
                    <p className="font-mono text-[10px] text-gold/60 tracking-widest uppercase mt-0.5">
                      {t('dashboard.profile.member')} {memberDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Campos */}
              {[
                { label: t('dashboard.profile.email'), value: user.email },
                { label: t('dashboard.profile.phone'), value: user.phone || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="border border-gold/20 bg-[#0A0A0A] overflow-hidden">
                  <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <div className="px-4 py-3">
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-1">{label}</p>
                    <p className="font-body text-sm text-paper">{value}</p>
                  </div>
                </div>
              ))}

              {/* Separador */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-gold/20" />
                <span className="w-1 h-1 bg-gold/40 rotate-45 flex-shrink-0" />
                <div className="h-px flex-1 bg-gold/20" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gold/20 bg-[#0A0A0A] overflow-hidden">
                  <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  <div className="p-4 text-center">
                    <p className="font-heading text-3xl text-gold">{user.bookings.filter(b => b.status === 'completed').length}</p>
                    <p className="font-mono text-[10px] text-paper-muted tracking-widest uppercase mt-1">Cortes</p>
                  </div>
                </div>
                <div className="border border-gold/20 bg-[#0A0A0A] overflow-hidden">
                  <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                  <div className="p-4 text-center">
                    <p className="font-heading text-3xl text-gold">
                      {user.bookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.price, 0)}€
                    </p>
                    <p className="font-mono text-[10px] text-paper-muted tracking-widest uppercase mt-1">Total</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer — Sair */}
        <div className="px-5 py-4 border-t border-paper/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 border border-paper/10 text-paper-muted hover:border-gold/50 hover:text-gold font-body text-sm tracking-widest uppercase transition-all"
          >
            <LogOut size={14} />
            {t('dashboard.logout')}
          </button>
        </div>
      </div>
    </div>
  )
}
