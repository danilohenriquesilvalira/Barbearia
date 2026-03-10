import { useState, useEffect } from 'react'
import { CalendarDays, Euro, Users, Scissors } from 'lucide-react'
import StatCard from '../components/StatCard'
import type { AdminBarber, AdminBooking, BookingStatus } from '../types'
import { fetchDashboardStats, fetchBarbers, fetchBookings, todayStr } from '../lib/adminApi'

type DashStats = Awaited<ReturnType<typeof fetchDashboardStats>>

const STATUS_STYLE: Record<BookingStatus, { label: string; cls: string }> = {
  confirmed:   { label: 'Confirmada',  cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20'    },
  completed:   { label: 'Concluída',   cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
  in_progress: { label: 'Em curso',    cls: 'bg-gold/10 text-gold border-gold/20'                },
  cancelled:   { label: 'Cancelada',   cls: 'bg-red-500/10 text-red-400 border-red-500/20'       },
  no_show:     { label: 'Falta',       cls: 'bg-white/5 text-paper-muted/60 border-white/10'     },
}

const BARBER_STATUS = {
  available: { label: 'Livre',    dot: 'bg-green-400',          text: 'text-green-400'      },
  busy:      { label: 'Ocupado',  dot: 'bg-gold animate-pulse', text: 'text-gold'           },
  break:     { label: 'Pausa',    dot: 'bg-blue-400',           text: 'text-blue-400'       },
  off:       { label: 'Folga',    dot: 'bg-paper-muted/40',     text: 'text-paper-muted/40' },
}

export default function Dashboard() {
  const today = todayStr()
  const [stats,    setStats]    = useState<DashStats | null>(null)
  const [barbers,  setBarbers]  = useState<AdminBarber[]>([])
  const [todayBks, setTodayBks] = useState<AdminBooking[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      fetchDashboardStats(),
      fetchBarbers(),
      fetchBookings({ date: today }),
    ]).then(([s, bs, bks]) => {
      setStats(s)
      setBarbers(bs)
      setTodayBks(bks)
    }).finally(() => setLoading(false))
  }, [today])

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[200px]">
      <span className="text-paper-muted/30 text-xs font-mono animate-pulse">A carregar…</span>
    </div>
  )

  const weekly           = stats?.weeklyRevenue   ?? []
  const maxRev           = Math.max(...weekly.map(d => d.revenue), 1)
  const todayCompleted   = stats?.todayCompleted  ?? 0
  const todayBookings    = stats?.todayBookings   ?? 0
  const todayRevenue     = stats?.todayRevenue    ?? 0
  const monthRevenue     = stats?.monthRevenue    ?? 0
  const monthBookings    = stats?.monthBookings   ?? 0
  const availableBarbers = stats?.availableBarbers ?? 0
  const totalBarbers     = stats?.totalBarbers    ?? 0

  const todayLabel = new Date().toLocaleDateString('pt-PT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const todayLabelFmt = todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1)

  const sortedBks = [...todayBks].sort((a, b) => {
    const order: Record<BookingStatus, number> = {
      in_progress: 0, confirmed: 1, completed: 2, cancelled: 3, no_show: 4,
    }
    return order[a.status] - order[b.status] || a.time.localeCompare(b.time)
  })

  return (
    <div className="min-h-full lg:h-full flex flex-col gap-4 px-4 lg:px-6 py-4 lg:py-5 lg:overflow-hidden">

      {/* Título */}
      <div className="flex-shrink-0 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-heading text-paper tracking-wide">Dashboard</h1>
          <p className="text-paper-muted/50 text-[11px] font-body mt-0.5">
            {todayLabelFmt} · {todayBookings} marcações hoje
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-body text-paper-muted/40">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Dados em tempo real
        </div>
      </div>

      {/* KPIs */}
      <div className="flex-shrink-0 grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Marcações Hoje" value={todayBookings}
          sub={`${todayCompleted} concluídas · ${todayBookings - todayCompleted} por decorrer`}
          icon={CalendarDays} trend={8} trendLabel="vs ontem" accent="gold"
        />
        <StatCard
          label="Receita Hoje" value={`€${todayRevenue}`}
          sub={`Ticket médio €${todayCompleted ? Math.round(todayRevenue / todayCompleted) : 0}`}
          icon={Euro} trend={12} trendLabel="vs ontem" accent="green"
        />
        <StatCard
          label="Receita do Mês" value={`€${monthRevenue.toLocaleString('pt-PT')}`}
          sub={`${monthBookings} marcações`}
          icon={Scissors} trend={6} trendLabel="vs mês anterior" accent="gold"
        />
        <StatCard
          label="Barbeiros" value={`${availableBarbers} / ${totalBarbers}`}
          sub={`${totalBarbers > 0 ? Math.round((availableBarbers / totalBarbers) * 100) : 0}% disponíveis`}
          icon={Users} accent="blue"
        />
      </div>

      {/* Linha central: Status + Gráfico */}
      <div className="flex-shrink-0 grid grid-cols-1 xl:grid-cols-5 gap-3 xl:h-44">

        {/* Status barbeiros */}
        <div className="xl:col-span-2 bg-off-black-3 border border-white/[0.07] rounded-xl px-4 py-3 flex flex-col gap-3 xl:overflow-hidden">
          <p className="text-paper-muted/50 text-[10px] font-mono uppercase tracking-[0.15em] flex-shrink-0">
            Equipa — Agora
          </p>
          <div className="grid grid-cols-2 xl:grid-cols-1 xl:flex-1 gap-2 xl:gap-0 xl:flex xl:flex-col xl:justify-between">
            {barbers.map(barber => {
              const s = BARBER_STATUS[barber.status]
              return (
                <div key={barber.id} className="flex items-center gap-2.5">
                  <img
                    src={barber.photo} alt={barber.name}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 grayscale opacity-80"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-paper text-xs font-body leading-tight truncate">{barber.name}</p>
                    <p className="text-paper-muted/40 text-[10px] font-body truncate">
                      {barber.currentClient
                        ? `↳ ${barber.currentClient}`
                        : barber.nextAppointment
                          ? `Próx. ${barber.nextAppointment}`
                          : barber.role}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-body ${s.text} flex-shrink-0`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Gráfico semanal */}
        <div className="xl:col-span-3 bg-off-black-3 border border-white/[0.07] rounded-xl px-4 py-3 flex flex-col gap-2">
          <p className="text-paper-muted/50 text-[10px] font-mono uppercase tracking-[0.15em] flex-shrink-0">
            Receita — Esta Semana
          </p>
          <div className="flex items-end gap-2 h-20 xl:flex-1 xl:h-auto">
            {weekly.map((d, i) => {
              const isToday = d.date === today
              const pct = (d.revenue / maxRev) * 100
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className={`text-[9px] font-mono ${isToday ? 'text-gold' : 'text-paper-muted/30'}`}>
                    {d.revenue > 0 ? `€${d.revenue}` : '—'}
                  </span>
                  <div className="w-full flex flex-col justify-end" style={{ height: '75%' }}>
                    <div
                      className={`w-full rounded-t transition-all ${isToday ? 'bg-gradient-to-t from-gold to-gold-light shadow-lg shadow-gold/20' : 'bg-white/[0.07] hover:bg-white/[0.12]'}`}
                      style={{ height: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-body ${isToday ? 'text-gold font-semibold' : 'text-paper-muted/40'}`}>
                    {d.day}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 pt-2 border-t border-white/[0.06] flex-shrink-0">
            <div>
              <p className="text-paper-muted/40 text-[9px] font-body">Total semana</p>
              <p className="text-paper text-xs font-heading">€{weekly.reduce((s, d) => s + d.revenue, 0)}</p>
            </div>
            <div>
              <p className="text-paper-muted/40 text-[9px] font-body">Cortes</p>
              <p className="text-paper text-xs font-heading">{weekly.reduce((s, d) => s + d.cuts, 0)}</p>
            </div>
            <div>
              <p className="text-paper-muted/40 text-[9px] font-body">Mês</p>
              <p className="text-gold text-xs font-heading">€{monthRevenue.toLocaleString('pt-PT')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela marcações de hoje */}
      <div className="flex-shrink-0 lg:flex-1 lg:min-h-0 flex flex-col bg-off-black-3 border border-white/[0.07] rounded-xl overflow-hidden">

        <div className="flex-shrink-0 flex items-center justify-between px-4 lg:px-5 py-3 border-b border-white/[0.06]">
          <p className="text-paper-muted/50 text-[10px] font-mono uppercase tracking-[0.15em]">
            Marcações de Hoje
          </p>
          <div className="flex items-center gap-3 text-[11px] font-body">
            <span className="text-paper-muted/40">{todayBookings} total</span>
            <span className="text-gold font-mono">€{todayRevenue} faturado</span>
          </div>
        </div>

        <div className="hidden sm:grid flex-shrink-0 grid-cols-[72px_1fr_1fr_1fr_56px_96px] gap-2 px-5 py-2 border-b border-white/[0.04]">
          {['Hora', 'Cliente', 'Barbeiro', 'Serviço', 'Preço', 'Estado'].map(h => (
            <span key={h} className="text-paper-muted/30 text-[9px] font-mono uppercase tracking-[0.15em]">{h}</span>
          ))}
        </div>

        <div className="max-h-64 lg:max-h-none overflow-y-auto lg:flex-1">
          {sortedBks.length === 0 ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-paper-muted/30 text-xs font-body">Sem marcações para hoje</p>
            </div>
          ) : sortedBks.map(bk => {
            const s   = STATUS_STYLE[bk.status]
            const isNow = bk.status === 'in_progress'
            return (
              <div
                key={bk.id}
                className={`border-b border-white/[0.03] last:border-0 transition-colors px-4 lg:px-5 ${isNow ? 'bg-gold/[0.03]' : 'hover:bg-white/[0.02]'}`}
              >
                {/* Mobile */}
                <div className="flex items-center gap-3 py-2.5 sm:hidden">
                  <span className={`font-mono text-[11px] w-10 flex-shrink-0 ${isNow ? 'text-gold' : 'text-paper-muted/50'}`}>{bk.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-paper text-xs font-body truncate">{bk.clientName}</p>
                    <p className="text-paper-muted/40 text-[10px] font-body truncate">{bk.barberName} · {bk.serviceName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-paper text-xs font-mono">€{bk.price}</span>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] border ${s.cls}`}>{s.label}</span>
                  </div>
                </div>
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-[72px_1fr_1fr_1fr_56px_96px] gap-2 py-2.5 items-center">
                  <span className={`font-mono text-xs ${isNow ? 'text-gold' : 'text-paper-muted/50'}`}>{bk.time}</span>
                  <span className="text-paper text-xs font-body truncate">{bk.clientName}</span>
                  <span className="text-paper-muted/50 text-xs font-body truncate">{bk.barberName}</span>
                  <span className="text-paper-muted/40 text-xs font-body truncate">{bk.serviceName}</span>
                  <span className="text-paper text-xs font-mono">€{bk.price}</span>
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] border ${s.cls} whitespace-nowrap`}>{s.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
