import { useState, useEffect } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { AdminBarber, AdminBooking, BookingStatus } from '../types'
import { fetchBookings, fetchBarbers, todayStr, weekStartStr, monthStartStr } from '../lib/adminApi'

type DateFilter = 'today' | 'week' | 'month' | 'all'

const DATE_TABS: { id: DateFilter; label: string }[] = [
  { id: 'today', label: 'Hoje'   },
  { id: 'week',  label: 'Semana' },
  { id: 'month', label: 'Mês'    },
  { id: 'all',   label: 'Todas'  },
]

const STATUS_OPT: { id: BookingStatus | 'all'; label: string }[] = [
  { id: 'all',         label: 'Todos'       },
  { id: 'confirmed',   label: 'Confirmadas' },
  { id: 'in_progress', label: 'Em curso'    },
  { id: 'completed',   label: 'Concluídas'  },
  { id: 'cancelled',   label: 'Canceladas'  },
  { id: 'no_show',     label: 'Faltas'      },
]

const STATUS_STYLE: Record<BookingStatus, { label: string; cls: string }> = {
  confirmed:   { label: 'Confirmada',  cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20'    },
  completed:   { label: 'Concluída',   cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
  in_progress: { label: 'Em curso',    cls: 'bg-gold/10 text-gold border-gold/20'                },
  cancelled:   { label: 'Cancelada',   cls: 'bg-red-500/10 text-red-400 border-red-500/20'       },
  no_show:     { label: 'Falta',       cls: 'bg-white/5 text-paper-muted/40 border-white/10'     },
}

export default function Appointments() {
  const [allBks,       setAllBks]       = useState<AdminBooking[]>([])
  const [barbers,      setBarbers]      = useState<AdminBarber[]>([])
  const [loading,      setLoading]      = useState(true)
  const [dateFilter,   setDateFilter]   = useState<DateFilter>('today')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [barberFilter, setBarberFilter] = useState('all')

  useEffect(() => {
    Promise.all([fetchBookings(), fetchBarbers()])
      .then(([bks, bs]) => { setAllBks(bks); setBarbers(bs) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[200px]">
      <span className="text-paper-muted/30 text-xs font-mono animate-pulse">A carregar…</span>
    </div>
  )

  const today      = todayStr()
  const weekStart  = weekStartStr()
  const monthStart = monthStartStr()

  let bks = [...allBks].sort((a, b) =>
    b.date.localeCompare(a.date) || a.time.localeCompare(b.time),
  )
  if (dateFilter === 'today') bks = bks.filter(b => b.date === today)
  if (dateFilter === 'week')  bks = bks.filter(b => b.date >= weekStart  && b.date <= today)
  if (dateFilter === 'month') bks = bks.filter(b => b.date >= monthStart && b.date <= today)
  if (statusFilter !== 'all') bks = bks.filter(b => b.status === statusFilter)
  if (barberFilter !== 'all') bks = bks.filter(b => b.barberId === barberFilter)

  const revenue = bks
    .filter(b => b.status === 'completed' || b.status === 'in_progress')
    .reduce((s, b) => s + b.price, 0)

  return (
    <div className="min-h-full lg:h-full flex flex-col gap-4 px-4 lg:px-6 py-4 lg:py-5 lg:overflow-hidden">

      {/* Título */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-heading text-paper tracking-wide">Marcações</h1>
        <p className="text-paper-muted/50 text-[11px] font-body mt-0.5">
          Histórico completo de marcações
        </p>
      </div>

      {/* Filtros */}
      <div className="flex-shrink-0 flex flex-wrap gap-2 items-center">
        {/* Tabs data */}
        <div className="flex rounded-lg border border-white/[0.08] overflow-hidden bg-off-black-3">
          {DATE_TABS.map(t => (
            <button key={t.id} onClick={() => setDateFilter(t.id)}
              className={`px-3 py-1.5 text-xs font-body transition-colors ${
                dateFilter === t.id
                  ? 'bg-gold text-off-black font-semibold'
                  : 'text-paper-muted/50 hover:text-paper hover:bg-white/[0.04]'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Estado */}
        <div className="relative">
          <SlidersHorizontal size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-paper-muted/30 pointer-events-none" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as BookingStatus | 'all')}
            className="pl-7 pr-3 py-1.5 bg-off-black-3 border border-white/[0.08] rounded-lg text-paper text-xs font-body appearance-none cursor-pointer focus:outline-none focus:border-gold/30 transition-colors">
            {STATUS_OPT.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>

        {/* Barbeiro */}
        <select value={barberFilter} onChange={e => setBarberFilter(e.target.value)}
          className="px-3 py-1.5 bg-off-black-3 border border-white/[0.08] rounded-lg text-paper text-xs font-body appearance-none cursor-pointer focus:outline-none focus:border-gold/30 transition-colors">
          <option value="all">Todos</option>
          {barbers.map(b => <option key={b.id} value={b.id}>{b.name.split(' ')[0]}</option>)}
        </select>

        {/* Contadores */}
        <div className="ml-auto flex items-center gap-3 text-[11px] font-body">
          <span className="text-paper-muted/40">{bks.length}</span>
          {revenue > 0 && <span className="text-gold font-mono">€{revenue}</span>}
        </div>
      </div>

      {/* Mini badges de estado */}
      <div className="flex-shrink-0 flex gap-2 flex-wrap">
        {(Object.keys(STATUS_STYLE) as BookingStatus[]).map(s => {
          const count = bks.filter(b => b.status === s).length
          const style = STATUS_STYLE[s]
          return (
            <div key={s} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-body ${
              count > 0 ? style.cls : 'bg-white/[0.02] text-paper-muted/20 border-white/[0.04]'
            }`}>
              <span className="font-mono font-semibold">{count}</span>
              <span className="opacity-70 hidden sm:inline">{style.label}</span>
            </div>
          )
        })}
      </div>

      {/* Tabela */}
      <div className="flex-1 min-h-0 flex flex-col bg-off-black-3 border border-white/[0.07] rounded-xl overflow-hidden">
        {bks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-paper-muted/30 text-xs font-body">Nenhuma marcação encontrada</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {/* Cabeçalho desktop sticky */}
              <div className="hidden lg:grid sticky top-0 grid-cols-[72px_72px_1fr_1fr_1fr_56px_96px] gap-2 px-5 py-2.5 border-b border-white/[0.06] bg-off-black-3 z-10">
                {['Data', 'Hora', 'Cliente', 'Barbeiro', 'Serviço', 'Preço', 'Estado'].map(h => (
                  <span key={h} className="text-paper-muted/30 text-[9px] font-mono uppercase tracking-[0.15em]">{h}</span>
                ))}
              </div>

              {bks.map(bk => {
                const s       = STATUS_STYLE[bk.status]
                const isNow   = bk.status === 'in_progress'
                const isToday = bk.date === today
                return (
                  <div key={bk.id}
                    className={`border-b border-white/[0.03] last:border-0 transition-colors ${isNow ? 'bg-gold/[0.03]' : 'hover:bg-white/[0.02]'}`}>

                    {/* Mobile card */}
                    <div className="flex items-center gap-3 px-4 py-3 lg:hidden">
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0 w-10">
                        <span className={`text-[10px] font-mono ${isToday ? 'text-gold' : 'text-paper-muted/40'}`}>
                          {isToday ? 'Hoje' : bk.date.slice(5)}
                        </span>
                        <span className="text-paper text-xs font-mono">{bk.time}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-paper text-xs font-body truncate">{bk.clientName}</p>
                        <p className="text-paper-muted/40 text-[10px] font-body truncate">
                          {bk.barberName.split(' ')[0]} · {bk.serviceName}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-paper text-xs font-mono">€{bk.price}</span>
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] border ${s.cls}`}>{s.label}</span>
                      </div>
                    </div>

                    {/* Desktop row */}
                    <div className="hidden lg:grid grid-cols-[72px_72px_1fr_1fr_1fr_56px_96px] gap-2 px-5 py-2.5 items-center">
                      <span className={`text-[10px] font-mono ${isToday ? 'text-gold' : 'text-paper-muted/40'}`}>
                        {isToday ? 'Hoje' : bk.date.slice(5)}
                      </span>
                      <span className="text-paper text-xs font-mono">{bk.time}</span>
                      <div className="min-w-0">
                        <p className="text-paper text-xs font-body truncate">{bk.clientName}</p>
                        <p className="text-paper-muted/30 text-[10px] font-body truncate">{bk.clientPhone}</p>
                      </div>
                      <span className="text-paper-muted/50 text-xs font-body truncate">{bk.barberName}</span>
                      <span className="text-paper-muted/40 text-xs font-body truncate">{bk.serviceName}</span>
                      <span className="text-paper text-xs font-mono">€{bk.price}</span>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] border ${s.cls} whitespace-nowrap`}>{s.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-white/[0.06] px-4 lg:px-5 py-2.5 bg-off-black-2/30 flex items-center justify-between text-[11px] font-body text-paper-muted/40">
              <span>{bks.length} marcações</span>
              <span>Faturado: <span className="text-gold font-mono">€{revenue}</span></span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
