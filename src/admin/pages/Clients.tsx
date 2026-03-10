import { useState, useEffect } from 'react'
import { Search, ChevronDown, ChevronUp, Phone, Mail, Calendar, Scissors, TrendingUp, Star } from 'lucide-react'
import type { AdminClient, AdminBooking, BookingStatus } from '../types'
import { fetchClients, fetchBookings } from '../lib/adminApi'

const STATUS_CLS: Record<BookingStatus, string> = {
  completed:   'bg-green-500/10 text-green-400 border-green-500/20',
  confirmed:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_progress: 'bg-gold/10 text-gold border-gold/20',
  cancelled:   'bg-red-500/10 text-red-400 border-red-500/20',
  no_show:     'bg-white/5 text-paper-muted/40 border-white/10',
}
const STATUS_LABEL: Record<BookingStatus, string> = {
  completed: 'Concluída', confirmed: 'Confirmada',
  in_progress: 'Em curso', cancelled: 'Cancelada', no_show: 'Falta',
}

// Avatar com foto ou iniciais
function Avatar({ name, url, size = 'md' }: { name: string; url: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const dim = size === 'lg' ? 'w-12 h-12 text-sm' : size === 'md' ? 'w-9 h-9 text-xs' : 'w-7 h-7 text-[10px]'

  if (url) return (
    <img src={url} alt={name}
      className={`${dim} rounded-full object-cover flex-shrink-0 ring-1 ring-white/10`}
    />
  )

  // Gera uma cor baseada no nome (determinística)
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center flex-shrink-0 font-body font-semibold text-white ring-1 ring-white/10`}
      style={{ background: `hsl(${hue}, 35%, 28%)` }}
    >
      {initials}
    </div>
  )
}

// Formata data pt-PT
function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Clients() {
  const [clients,  setClients]  = useState<AdminClient[]>([])
  const [allBks,   setAllBks]   = useState<AdminBooking[]>([])
  const [loading,  setLoading]  = useState(true)
  const [query,    setQuery]    = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([fetchClients(), fetchBookings()])
      .then(([cls, bks]) => { setClients(cls); setAllBks(bks) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[200px]">
      <span className="text-paper-muted/30 text-xs font-mono animate-pulse">A carregar…</span>
    </div>
  )

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase()) ||
    c.phone.includes(query),
  )

  const getHistory = (clientId: string) =>
    allBks.filter(b => b.clientId === clientId).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="min-h-full lg:h-full flex flex-col gap-4 px-4 lg:px-6 py-4 lg:py-5 lg:overflow-hidden">

      {/* Título + pesquisa */}
      <div className="flex-shrink-0 flex items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-heading text-paper tracking-wide">Clientes</h1>
          <p className="text-paper-muted/50 text-[11px] font-body mt-0.5">
            {clients.length} clientes registados
          </p>
        </div>
        <div className="relative flex-1 min-w-[160px] max-w-xs ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-muted/30 pointer-events-none" />
          <input
            type="text" placeholder="Nome, email ou telefone…"
            value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-off-black-3 border border-white/[0.08] rounded-lg text-paper text-xs font-body placeholder-paper-muted/30 focus:outline-none focus:border-gold/30 transition-colors"
          />
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 min-h-0 flex flex-col bg-off-black-3 border border-white/[0.07] rounded-xl overflow-hidden">

        {/* Cabeçalho desktop */}
        <div className="hidden lg:grid flex-shrink-0 grid-cols-[2.5fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-2.5 border-b border-white/[0.06]">
          {['Cliente', 'Cortes', 'Gasto total', 'Última visita', 'Barbeiro fav.'].map(h => (
            <span key={h} className="text-paper-muted/30 text-[9px] font-mono uppercase tracking-[0.15em]">{h}</span>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="flex items-center justify-center h-24">
              <p className="text-paper-muted/30 text-xs font-body">Nenhum cliente encontrado</p>
            </div>
          )}

          {filtered.map(client => {
            const isOpen  = expanded === client.id
            const history = isOpen ? getHistory(client.id) : []
            const completed = allBks.filter(b => b.clientId === client.id && b.status === 'completed').length
            const avgTicket = completed > 0 ? Math.round(client.totalSpent / completed) : 0

            return (
              <div key={client.id} className="border-b border-white/[0.04] last:border-0">

                {/* ── Linha principal ── */}
                <div
                  onClick={() => setExpanded(isOpen ? null : client.id)}
                  className={`cursor-pointer transition-colors ${isOpen ? 'bg-white/[0.025]' : 'hover:bg-white/[0.02]'}`}
                >
                  {/* Mobile */}
                  <div className="flex items-center gap-3 px-4 py-3 lg:hidden">
                    <Avatar name={client.name} url={client.avatarUrl} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-paper text-xs font-body font-medium truncate">{client.name}</p>
                      <p className="text-paper-muted/40 text-[10px] font-mono truncate">{client.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      <span className="text-gold text-xs font-mono font-semibold">€{client.totalSpent}</span>
                      <span className="text-paper-muted/40 text-[10px] font-body">{client.totalBookings} visitas</span>
                    </div>
                    <div className="text-paper-muted/30 ml-1">
                      {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden lg:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3 items-center">

                    {/* Coluna: Avatar + Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={client.name} url={client.avatarUrl} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-paper text-[13px] font-body font-medium truncate leading-tight">{client.name}</p>
                        </div>
                        <p className="text-paper-muted/40 text-[10px] font-mono truncate leading-tight mt-0.5">{client.email}</p>
                        {client.phone && (
                          <p className="text-paper-muted/30 text-[10px] font-body truncate leading-tight">{client.phone}</p>
                        )}
                      </div>
                      <div className="text-paper-muted/20 flex-shrink-0 ml-auto">
                        {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </div>
                    </div>

                    {/* Cortes */}
                    <div>
                      <p className="text-paper text-[13px] font-heading leading-tight">{completed}</p>
                      <p className="text-paper-muted/30 text-[10px] font-body mt-0.5">{client.totalBookings} total</p>
                    </div>

                    {/* Gasto */}
                    <div>
                      <p className="text-gold text-[13px] font-heading leading-tight">€{client.totalSpent.toLocaleString('pt-PT')}</p>
                      {avgTicket > 0 && (
                        <p className="text-paper-muted/30 text-[10px] font-body mt-0.5">≈ €{avgTicket}/visita</p>
                      )}
                    </div>

                    {/* Última visita */}
                    <div>
                      <p className="text-paper text-[11px] font-mono leading-tight">{fmtDate(client.lastVisit)}</p>
                      <p className="text-paper-muted/30 text-[10px] font-body mt-0.5">desde {fmtDate(client.memberSince)}</p>
                    </div>

                    {/* Barbeiro fav */}
                    <div>
                      {client.favoriteBarber ? (
                        <>
                          <div className="flex items-center gap-1">
                            <Star size={9} className="text-gold fill-gold flex-shrink-0" />
                            <p className="text-paper text-[11px] font-body truncate leading-tight">{client.favoriteBarber.split(' ')[0]}</p>
                          </div>
                          <p className="text-paper-muted/30 text-[10px] font-body mt-0.5 truncate">{client.favoriteBarber}</p>
                        </>
                      ) : (
                        <p className="text-paper-muted/20 text-[11px] font-body">—</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Perfil expandido ── */}
                {isOpen && (
                  <div className="bg-off-black-2/50 border-t border-white/[0.04]">

                    {/* Painel de perfil + stats + histórico */}
                    <div className="px-4 lg:px-5 py-4 flex flex-col lg:flex-row gap-4">

                      {/* Esquerda: Perfil completo */}
                      <div className="flex-shrink-0 lg:w-56 xl:w-64 flex flex-col gap-3">

                        {/* Card de identidade */}
                        <div className="bg-off-black-3 border border-white/[0.06] rounded-xl p-4 flex flex-col items-center text-center gap-2">
                          <Avatar name={client.name} url={client.avatarUrl} size="lg" />
                          <div>
                            <p className="text-paper font-body font-semibold text-sm leading-tight">{client.name}</p>
                            <p className="text-paper-muted/40 text-[10px] font-body mt-0.5">
                              Membro desde {fmtDate(client.memberSince)}
                            </p>
                          </div>

                          {/* Contactos */}
                          <div className="w-full space-y-1.5 pt-2 border-t border-white/[0.06]">
                            {client.email && (
                              <a href={`mailto:${client.email}`}
                                className="flex items-center gap-2 text-paper-muted/50 hover:text-paper text-[10px] font-body transition-colors min-w-0">
                                <Mail size={10} className="flex-shrink-0 text-gold/50" />
                                <span className="truncate">{client.email}</span>
                              </a>
                            )}
                            {client.phone && (
                              <a href={`tel:${client.phone}`}
                                className="flex items-center gap-2 text-paper-muted/50 hover:text-paper text-[10px] font-body transition-colors">
                                <Phone size={10} className="flex-shrink-0 text-gold/50" />
                                <span>{client.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Stats resumidas */}
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { icon: Scissors,   label: 'Cortes',    value: String(completed),                   sub: `${client.totalBookings} total`        },
                            { icon: TrendingUp, label: 'Gasto',     value: `€${client.totalSpent.toLocaleString('pt-PT')}`, sub: avgTicket > 0 ? `≈ €${avgTicket}/vez` : '' },
                            { icon: Calendar,   label: 'Última',    value: client.lastVisit ? client.lastVisit.slice(5) : '—', sub: fmtDate(client.lastVisit) },
                            { icon: Star,       label: 'Favorito',  value: client.favoriteBarber?.split(' ')[0] ?? '—', sub: '' },
                          ].map(s => (
                            <div key={s.label} className="bg-off-black-3 border border-white/[0.05] rounded-lg px-3 py-2.5">
                              <div className="flex items-center gap-1.5 mb-1">
                                <s.icon size={9} className="text-gold/60" />
                                <span className="text-paper-muted/30 text-[9px] font-mono uppercase tracking-wider">{s.label}</span>
                              </div>
                              <p className="text-paper text-xs font-heading leading-tight">{s.value}</p>
                              {s.sub && <p className="text-paper-muted/30 text-[9px] font-body mt-0.5 truncate">{s.sub}</p>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Direita: Histórico de marcações */}
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <p className="text-paper-muted/30 text-[9px] font-mono uppercase tracking-[0.15em] flex-shrink-0">
                          Histórico de marcações
                        </p>

                        {history.length === 0 ? (
                          <div className="flex items-center justify-center h-20 bg-off-black-3 border border-white/[0.05] rounded-xl">
                            <p className="text-paper-muted/20 text-xs font-body">Sem marcações</p>
                          </div>
                        ) : (
                          <div className="bg-off-black-3 border border-white/[0.05] rounded-xl overflow-hidden">

                            {/* Header colunas */}
                            <div className="hidden sm:grid grid-cols-[64px_64px_1fr_1fr_52px_80px] gap-2 px-4 py-2 border-b border-white/[0.05]">
                              {['Data', 'Hora', 'Serviço', 'Barbeiro', '€', 'Estado'].map(h => (
                                <span key={h} className="text-paper-muted/20 text-[8px] font-mono uppercase tracking-[0.15em]">{h}</span>
                              ))}
                            </div>

                            {/* Rows */}
                            {history.map((bk, i) => (
                              <div key={bk.id}
                                className={`border-b border-white/[0.03] last:border-0 transition-colors hover:bg-white/[0.02] ${
                                  bk.status === 'in_progress' ? 'bg-gold/[0.03]' : ''
                                }`}
                              >
                                {/* Mobile row */}
                                <div className="flex items-center gap-3 px-4 py-2.5 sm:hidden">
                                  <div className="flex flex-col gap-0.5 flex-shrink-0 w-14">
                                    <span className="text-paper-muted/40 text-[9px] font-mono leading-none">{bk.date.slice(5)}</span>
                                    <span className="text-paper-muted/60 text-[10px] font-mono">{bk.time}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-paper-muted/70 text-[11px] font-body truncate">{bk.serviceName}</p>
                                    <p className="text-paper-muted/30 text-[9px] font-body">{bk.barberName.split(' ')[0]}</p>
                                  </div>
                                  <span className="text-paper text-[10px] font-mono flex-shrink-0">€{bk.price}</span>
                                  <span className={`text-[9px] font-body px-1.5 py-0.5 rounded border flex-shrink-0 ${STATUS_CLS[bk.status]}`}>
                                    {STATUS_LABEL[bk.status]}
                                  </span>
                                </div>

                                {/* Desktop row */}
                                <div className="hidden sm:grid grid-cols-[64px_64px_1fr_1fr_52px_80px] gap-2 px-4 py-2.5 items-center">
                                  <span className={`text-[10px] font-mono ${i === 0 ? 'text-gold/70' : 'text-paper-muted/40'}`}>
                                    {bk.date.slice(5)}
                                  </span>
                                  <span className="text-paper-muted/50 text-[10px] font-mono">{bk.time}</span>
                                  <span className="text-paper-muted/70 text-[11px] font-body truncate">{bk.serviceName}</span>
                                  <span className="text-paper-muted/40 text-[10px] font-body truncate">{bk.barberName.split(' ')[0]}</span>
                                  <span className="text-paper text-[10px] font-mono">€{bk.price}</span>
                                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] border ${STATUS_CLS[bk.status]} whitespace-nowrap`}>
                                    {STATUS_LABEL[bk.status]}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-white/[0.06] px-4 lg:px-5 py-2.5 bg-off-black-2/30 flex items-center gap-6 text-[11px] font-body text-paper-muted/40">
          <span>{filtered.length} de {clients.length}</span>
          <span>Total faturado: <span className="text-gold font-mono">€{filtered.reduce((s, c) => s + c.totalSpent, 0).toLocaleString('pt-PT')}</span></span>
          <span className="ml-auto hidden sm:block">
            {filtered.reduce((s, c) => s + c.totalBookings, 0)} marcações
          </span>
        </div>
      </div>
    </div>
  )
}
