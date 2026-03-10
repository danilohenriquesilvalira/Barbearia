import { useState, useEffect } from 'react'
import {
  CalendarDays, User, LogOut, Scissors, CheckCircle2,
  PlayCircle, Clock, ChevronRight, Menu, X, Star,
  TrendingUp, Euro,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { asset } from '../lib/asset'

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface BarberRow {
  id:          string
  name:        string
  role_title:  string | null
  email:       string | null
  phone:       string | null
  photo_url:   string | null
  status:      string
  rating:      number
  specialties: string[]
}

interface BookingRow {
  id:           string
  client_name?: string
  barber_name:  string
  barber_id:    string
  service_name: string
  date:         string
  time_slot:    string
  price:        number
  status:       string
  user_id:      string
}

type BarberPage = 'today' | 'week' | 'profile'

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  confirmed:   { label: 'Confirmada',  cls: 'bg-blue-500/15 text-blue-400 border-blue-500/20'    },
  in_progress: { label: 'Em curso',    cls: 'bg-gold/15 text-gold border-gold/20'                },
  completed:   { label: 'Concluída',   cls: 'bg-green-500/15 text-green-400 border-green-500/20' },
  cancelled:   { label: 'Cancelada',   cls: 'bg-red-500/15 text-red-400 border-red-500/20'       },
  no_show:     { label: 'Falta',       cls: 'bg-white/5 text-paper-muted/60 border-white/10'     },
}

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

function todayStr() { return new Date().toISOString().slice(0, 10) }
function weekDates(): string[] {
  const dates: string[] = []
  const base = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[200px]">
      <span className="text-paper-muted/30 text-xs font-mono animate-pulse">A carregar…</span>
    </div>
  )
}

// ─── Página: Hoje ─────────────────────────────────────────────────────────────
function TodayPage({
  bookings,
  onStatusChange,
}: {
  bookings:       BookingRow[]
  onStatusChange: (id: string, status: string) => void
}) {
  const today       = todayStr()
  const todayBks    = bookings.filter(b => b.date === today)
  const sorted      = [...todayBks].sort((a, b) => {
    const order: Record<string, number> = { in_progress: 0, confirmed: 1, completed: 2, cancelled: 3, no_show: 4 }
    return (order[a.status] ?? 9) - (order[b.status] ?? 9) || a.time_slot.localeCompare(b.time_slot)
  })

  const done    = todayBks.filter(b => b.status === 'completed' || b.status === 'in_progress')
  const revenue = done.reduce((s, b) => s + b.price, 0)

  const todayLabel = new Date().toLocaleDateString('pt-PT', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 lg:py-5 min-h-full">

      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl font-heading text-paper tracking-wide">Hoje</h1>
        <p className="text-paper-muted/50 text-[11px] font-body mt-0.5 capitalize">
          {todayLabel} · {todayBks.length} marcações
        </p>
      </div>

      {/* Mini-stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-off-black-2 border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Scissors size={13} className="text-gold/60" />
            <span className="text-paper-muted/50 text-[10px] font-mono uppercase tracking-wider">Cortes hoje</span>
          </div>
          <p className="text-2xl font-heading text-paper">{done.length}</p>
          <p className="text-paper-muted/30 text-[10px] font-body mt-0.5">de {todayBks.length} marcações</p>
        </div>
        <div className="bg-off-black-2 border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Euro size={13} className="text-gold/60" />
            <span className="text-paper-muted/50 text-[10px] font-mono uppercase tracking-wider">Receita hoje</span>
          </div>
          <p className="text-2xl font-heading text-paper">€{revenue.toFixed(0)}</p>
          <p className="text-paper-muted/30 text-[10px] font-body mt-0.5">serviços concluídos</p>
        </div>
      </div>

      {/* Lista de marcações */}
      {sorted.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-12">
          <CalendarDays size={32} className="text-paper-muted/20" />
          <p className="text-paper-muted/50 font-body text-sm">Sem marcações para hoje</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map(bk => {
            const cfg = STATUS_CFG[bk.status] ?? STATUS_CFG.confirmed
            return (
              <div
                key={bk.id}
                className="bg-off-black-2 border border-white/[0.06] rounded-xl p-4 flex items-center gap-4"
              >
                {/* Hora */}
                <div className="flex-shrink-0 w-14 text-center">
                  <p className="text-paper font-mono text-sm font-semibold">{bk.time_slot}</p>
                  <p className="text-paper-muted/40 text-[10px] font-mono">{bk.date.slice(5).replace('-', '/')}</p>
                </div>

                {/* Separador */}
                <div className="w-px h-10 bg-white/[0.06] flex-shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-paper font-body text-sm font-medium truncate">
                    {(bk as any).profiles?.name ?? 'Cliente'}
                  </p>
                  <p className="text-paper-muted/50 text-xs font-body truncate">{bk.service_name}</p>
                </div>

                {/* Preço */}
                <p className="text-gold/80 font-mono text-sm flex-shrink-0">€{bk.price}</p>

                {/* Status + acções */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-mono px-2 py-1 rounded-full border ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                  {bk.status === 'confirmed' && (
                    <button
                      onClick={() => onStatusChange(bk.id, 'in_progress')}
                      title="Iniciar"
                      className="w-7 h-7 rounded-lg bg-gold/10 hover:bg-gold/20 flex items-center justify-center text-gold transition-colors"
                    >
                      <PlayCircle size={14} />
                    </button>
                  )}
                  {bk.status === 'in_progress' && (
                    <button
                      onClick={() => onStatusChange(bk.id, 'completed')}
                      title="Concluir"
                      className="w-7 h-7 rounded-lg bg-green-500/10 hover:bg-green-500/20 flex items-center justify-center text-green-400 transition-colors"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Página: Semana ───────────────────────────────────────────────────────────
function WeekPage({ bookings }: { bookings: BookingRow[] }) {
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const dates   = weekDates()
  const dayBks  = bookings.filter(b => b.date === selectedDate)
  const sorted  = [...dayBks].sort((a, b) => a.time_slot.localeCompare(b.time_slot))

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6 py-4 lg:py-5 min-h-full">
      <div>
        <h1 className="text-xl font-heading text-paper tracking-wide">Agenda da Semana</h1>
        <p className="text-paper-muted/50 text-[11px] font-body mt-0.5">
          Próximos 7 dias
        </p>
      </div>

      {/* Barra de dias */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((d) => {
          const count = bookings.filter(b => b.date === d).length
          const isToday    = d === todayStr()
          const isSelected = d === selectedDate
          const dayNum  = new Date(d + 'T12:00:00').getDate()
          const dayIdx  = new Date(d + 'T12:00:00').getDay()
          const weekday = WEEKDAYS[dayIdx === 0 ? 6 : dayIdx - 1]
          return (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`
                flex flex-col items-center py-2.5 px-1 rounded-xl border transition-all
                ${isSelected
                  ? 'bg-gold/15 border-gold/40 text-gold'
                  : isToday
                    ? 'bg-white/5 border-white/10 text-paper'
                    : 'bg-transparent border-transparent text-paper-muted/40 hover:bg-white/5 hover:border-white/10'
                }
              `}
            >
              <span className="text-[10px] font-mono uppercase">{weekday}</span>
              <span className="font-heading text-base mt-0.5">{dayNum}</span>
              {count > 0 && (
                <span className={`text-[9px] font-mono mt-1 px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-gold/30 text-gold' : 'bg-white/10 text-paper-muted/60'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Marcações do dia seleccionado */}
      <div className="flex-1">
        <p className="text-paper-muted/40 text-[10px] font-mono uppercase tracking-wider mb-3">
          {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
          {' · '}{dayBks.length} marcações
        </p>
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <Clock size={28} className="text-paper-muted/20" />
            <p className="text-paper-muted/40 font-body text-sm">Sem marcações neste dia</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map(bk => {
              const cfg = STATUS_CFG[bk.status] ?? STATUS_CFG.confirmed
              return (
                <div key={bk.id} className="bg-off-black-2 border border-white/[0.06] rounded-xl p-3.5 flex items-center gap-3">
                  <p className="text-paper font-mono text-sm w-10 flex-shrink-0">{bk.time_slot}</p>
                  <div className="flex-1 min-w-0">
                    <p className="text-paper font-body text-sm truncate">
                      {(bk as any).profiles?.name ?? 'Cliente'}
                    </p>
                    <p className="text-paper-muted/40 text-[11px] font-body truncate">{bk.service_name}</p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-1 rounded-full border flex-shrink-0 ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Página: Perfil ───────────────────────────────────────────────────────────
function ProfilePage({
  barber,
  weekBookings,
  monthBookings,
  onLogout,
}: {
  barber:        BarberRow
  weekBookings:  BookingRow[]
  monthBookings: BookingRow[]
  onLogout:      () => void
}) {
  const completedWeek  = weekBookings.filter(b => b.status === 'completed' || b.status === 'in_progress')
  const completedMonth = monthBookings.filter(b => b.status === 'completed' || b.status === 'in_progress')
  const revenueMonth   = completedMonth.reduce((s, b) => s + b.price, 0)

  const photo = barber.photo_url ?? asset('/barbeiro_1.jpg')

  return (
    <div className="flex flex-col gap-5 px-4 lg:px-6 py-4 lg:py-5 min-h-full">
      <h1 className="text-xl font-heading text-paper tracking-wide">Perfil</h1>

      {/* Avatar + info */}
      <div className="bg-off-black-2 border border-white/[0.06] rounded-2xl p-6 flex items-center gap-5">
        <img
          src={photo}
          alt={barber.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-gold/30 flex-shrink-0"
        />
        <div className="min-w-0">
          <h2 className="text-paper font-heading text-lg">{barber.name}</h2>
          <p className="text-gold/70 font-mono text-xs tracking-wider uppercase mt-0.5">
            {barber.role_title ?? 'Barber'}
          </p>
          {barber.email && (
            <p className="text-paper-muted/40 font-body text-xs mt-1 truncate">{barber.email}</p>
          )}
        </div>
      </div>

      {/* Especialidades */}
      {barber.specialties?.length > 0 && (
        <div className="bg-off-black-2 border border-white/[0.06] rounded-2xl p-5">
          <p className="text-paper-muted/50 text-[10px] font-mono uppercase tracking-wider mb-3">Especialidades</p>
          <div className="flex flex-wrap gap-2">
            {barber.specialties.map(s => (
              <span key={s} className="text-xs font-mono px-2.5 py-1 bg-gold/10 text-gold/80 rounded-full border border-gold/20">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-off-black-2 border border-white/[0.06] rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star size={11} className="text-gold/60" />
          </div>
          <p className="text-xl font-heading text-paper">{Number(barber.rating ?? 5).toFixed(1)}</p>
          <p className="text-paper-muted/30 text-[10px] font-body mt-0.5">Rating</p>
        </div>
        <div className="bg-off-black-2 border border-white/[0.06] rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Scissors size={11} className="text-gold/60" />
          </div>
          <p className="text-xl font-heading text-paper">{completedWeek.length}</p>
          <p className="text-paper-muted/30 text-[10px] font-body mt-0.5">Esta semana</p>
        </div>
        <div className="bg-off-black-2 border border-white/[0.06] rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp size={11} className="text-gold/60" />
          </div>
          <p className="text-xl font-heading text-paper">{completedMonth.length}</p>
          <p className="text-paper-muted/30 text-[10px] font-body mt-0.5">Este mês</p>
        </div>
      </div>

      {/* Receita do mês */}
      <div className="bg-off-black-2 border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-paper-muted/50 text-[10px] font-mono uppercase tracking-wider mb-1">Receita este mês</p>
          <p className="text-2xl font-heading text-paper">€{revenueMonth.toFixed(0)}</p>
        </div>
        <Euro size={28} className="text-gold/20" />
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-paper-muted/50 hover:text-barber-red font-body text-sm transition-colors mt-auto"
      >
        <LogOut size={15} />
        Terminar sessão
      </button>
    </div>
  )
}

// ─── BarberApp principal ──────────────────────────────────────────────────────
interface BarberAppProps {
  onExit: () => void
}

const NAV_ITEMS: { id: BarberPage; label: string; icon: typeof CalendarDays }[] = [
  { id: 'today',   label: 'Hoje',   icon: CalendarDays },
  { id: 'week',    label: 'Semana', icon: Clock        },
  { id: 'profile', label: 'Perfil', icon: User         },
]

export default function BarberApp({ onExit }: BarberAppProps) {
  const { user, logout } = useAuth()

  const [activePage,    setActivePage]    = useState<BarberPage>('today')
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [barber,        setBarber]        = useState<BarberRow | null>(null)
  const [allBookings,   setAllBookings]   = useState<BookingRow[]>([])
  const [weekBookings,  setWeekBookings]  = useState<BookingRow[]>([])
  const [monthBookings, setMonthBookings] = useState<BookingRow[]>([])
  const [loading,       setLoading]       = useState(true)

  // Load barber data + bookings
  useEffect(() => {
    if (!user?.email) return

    const today      = todayStr()
    const weekEnd    = (() => { const d = new Date(); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10) })()
    const monthStart = today.slice(0, 7) + '-01'
    const weekStart  = (() => { const d = new Date(); const day = d.getDay(); d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)); return d.toISOString().slice(0, 10) })()

    supabase
      .from('barbers')
      .select('*')
      .ilike('email', user.email)
      .maybeSingle()
      .then(({ data: barberRow }) => {
        if (!barberRow) { setLoading(false); return }
        setBarber(barberRow as BarberRow)

        const barberId = barberRow.id

        Promise.all([
          // próximos 7 dias (agenda semana + hoje)
          supabase.from('bookings')
            .select('*, profiles(name)')
            .eq('barber_id', barberId)
            .gte('date', today)
            .lte('date', weekEnd)
            .order('date')
            .order('time_slot'),
          // semana para stats
          supabase.from('bookings')
            .select('*')
            .eq('barber_id', barberId)
            .gte('date', weekStart)
            .lte('date', today),
          // mês para stats
          supabase.from('bookings')
            .select('*')
            .eq('barber_id', barberId)
            .gte('date', monthStart)
            .lte('date', today),
        ]).then(([{ data: agenda }, { data: wk }, { data: mo }]) => {
          setAllBookings((agenda ?? []) as BookingRow[])
          setWeekBookings((wk ?? []) as BookingRow[])
          setMonthBookings((mo ?? []) as BookingRow[])
          setLoading(false)
        })
      })
  }, [user?.email])

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)
    if (!error) {
      setAllBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b))
    }
  }

  const handleLogout = async () => {
    await logout()
    onExit()
  }

  const PageComponent = () => {
    if (loading) return <Skeleton />
    if (!barber)  return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <Scissors size={32} className="text-paper-muted/20" />
        <p className="text-paper-muted/50 font-body text-sm">Perfil de barbeiro não encontrado.</p>
        <p className="text-paper-muted/30 font-body text-xs">Contacte o administrador para verificar o email registado.</p>
        <button onClick={handleLogout} className="mt-4 text-paper-muted/50 hover:text-paper font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
          <LogOut size={13} /> Sair
        </button>
      </div>
    )
    return activePage === 'today'
      ? <TodayPage bookings={allBookings} onStatusChange={handleStatusChange} />
      : activePage === 'week'
        ? <WeekPage bookings={allBookings} />
        : <ProfilePage barber={barber} weekBookings={weekBookings} monthBookings={monthBookings} onLogout={handleLogout} />
  }

  return (
    <div className="fixed inset-0 z-50 bg-off-black flex overflow-hidden">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 h-full flex-shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <aside className="relative w-64 h-full bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col overflow-hidden select-none">

          {/* Pole strip */}
          <div
            className="absolute left-0 top-0 w-[3px] h-full animate-stripe"
            style={{
              backgroundImage: `repeating-linear-gradient(
                180deg,
                #C1121F 0px, #C1121F 8px,
                #F8F9FA 8px, #F8F9FA 16px,
                #023E8A 16px, #023E8A 24px,
                #F8F9FA 24px, #F8F9FA 32px
              )`,
              backgroundSize: '3px 32px',
            }}
          />

          {/* Logo */}
          <div className="pl-8 pr-5 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold/20">
                <Scissors size={16} className="text-off-black" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-paper text-[15px] leading-none tracking-wide">
                  Connect <span className="text-gold">Barber</span>
                </p>
                <p className="text-paper-muted/50 text-[10px] font-mono tracking-[0.2em] uppercase mt-1">
                  Barbeiro
                </p>
              </div>
            </div>
          </div>

          {/* Barber info */}
          {barber && (
            <div className="pl-8 pr-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <img
                  src={barber.photo_url ?? asset('/barbeiro_1.jpg')}
                  alt={barber.name}
                  className="w-8 h-8 rounded-full object-cover border border-gold/30 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-paper font-body text-xs font-medium truncate">{barber.name}</p>
                  <p className="text-paper-muted/40 font-mono text-[10px] uppercase tracking-wider truncate">
                    {barber.role_title ?? 'Barber'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navegação */}
          <nav className="flex-1 pl-6 pr-3 py-5 space-y-0.5">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              const active = activePage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => { setActivePage(item.id); setSidebarOpen(false) }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150
                    ${active
                      ? 'bg-gold/10 text-gold'
                      : 'text-paper-muted/50 hover:text-paper hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <Icon size={15} strokeWidth={active ? 2.5 : 1.8} />
                  <span className="text-xs font-body font-medium tracking-wide">{item.label}</span>
                  {active && <ChevronRight size={13} className="ml-auto" />}
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-6 py-5 border-t border-white/[0.06]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-paper-muted/40 hover:text-barber-red hover:bg-red-500/5 transition-all text-left"
            >
              <LogOut size={14} />
              <span className="text-xs font-body">Terminar sessão</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex-shrink-0 h-14 bg-off-black-2/80 backdrop-blur-md border-b border-white/[0.06] flex items-center gap-3 px-4 lg:px-6">
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center text-paper-muted hover:text-paper transition-colors"
            onClick={() => setSidebarOpen(s => !s)}
          >
            {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
          <p className="text-paper font-body text-sm">
            {NAV_ITEMS.find(n => n.id === activePage)?.label}
          </p>
        </header>

        {/* Conteúdo scrollável */}
        <main className="flex-1 overflow-y-auto scrollbar-none">
          <PageComponent />
        </main>
      </div>
    </div>
  )
}
