import { useState, useEffect } from 'react'
import { Phone, Mail, Star, Clock, X, Plus, Pencil, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import type { AdminBarber, AdminBooking, BarberStatus } from '../types'
import { fetchBarbers, fetchBookings, updateBarberStatus, deleteBarber, todayStr } from '../lib/adminApi'
import { supabase } from '../../lib/supabase'
import BarberFormModal from '../components/BarberFormModal'

const STATUS_CFG: Record<BarberStatus, { label: string; dot: string; pill: string }> = {
  available: { label: 'Livre',    dot: 'bg-green-400',           pill: 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' },
  busy:      { label: 'Ocupado',  dot: 'bg-gold animate-pulse',  pill: 'bg-gold/10 text-gold border-gold/20 hover:bg-gold/20'                      },
  break:     { label: 'Pausa',    dot: 'bg-blue-400',            pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'      },
  off:       { label: 'Folga',    dot: 'bg-paper-muted/40',      pill: 'bg-white/5 text-paper-muted/60 border-white/10 hover:bg-white/10'           },
}

const STATUS_OPTIONS: BarberStatus[] = ['available', 'busy', 'break', 'off']

export default function Barbers() {
  const today = todayStr()

  const [barbers,        setBarbers]        = useState<AdminBarber[]>([])
  const [loading,        setLoading]        = useState(true)
  const [selected,       setSelected]       = useState<string | null>(null)
  const [agendaBks,      setAgendaBks]      = useState<AdminBooking[]>([])
  const [agendaLoading,  setAgendaLoading]  = useState(false)
  const [modalBarber,    setModalBarber]    = useState<AdminBarber | null | undefined>(undefined) // undefined = closed
  const [confirmDelete,  setConfirmDelete]  = useState<string | null>(null)
  const [deleting,       setDeleting]       = useState(false)

  const loadBarbers = () => fetchBarbers().then(setBarbers)

  // Load + Realtime
  useEffect(() => {
    loadBarbers().finally(() => setLoading(false))

    const channel = supabase
      .channel('admin-barbers-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'barbers' }, loadBarbers)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // Agenda do barbeiro selecionado
  useEffect(() => {
    if (!selected) { setAgendaBks([]); return }
    setAgendaLoading(true)
    fetchBookings({ date: today, barberId: selected })
      .then(bks => setAgendaBks(bks.sort((a, b) => a.time.localeCompare(b.time))))
      .finally(() => setAgendaLoading(false))
  }, [selected, today])

  const handleSetStatus = async (id: string, status: BarberStatus) => {
    setBarbers(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    await updateBarberStatus(id, status)
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    const { error } = await deleteBarber(id)
    setDeleting(false)
    if (error) { alert('Erro ao eliminar: ' + error.message); return }
    setConfirmDelete(null)
    if (selected === id) setSelected(null)
    loadBarbers()
  }

  const selBarber = barbers.find(b => b.id === selected)

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-[200px]">
      <span className="text-paper-muted/30 text-xs font-mono animate-pulse">A carregar…</span>
    </div>
  )

  return (
    <>
      <div className="min-h-full lg:h-full flex flex-col gap-4 px-4 lg:px-6 py-4 lg:py-5 lg:overflow-hidden">

        {/* Título + botão criar */}
        <div className="flex-shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading text-paper tracking-wide">Barbeiros</h1>
            <p className="text-paper-muted/50 text-[11px] font-body mt-0.5">
              Gestão de equipa · {barbers.filter(b => b.status === 'available').length} disponíveis agora
            </p>
          </div>
          <button
            onClick={() => setModalBarber(null)}
            className="flex items-center gap-2 px-3 py-2 bg-gold hover:bg-gold-light text-off-black text-xs font-body font-semibold rounded-lg transition-colors"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Novo Barbeiro</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 lg:overflow-hidden">

          {/* Grid de cards */}
          <div className={`overflow-y-auto ${selBarber ? 'lg:w-80 xl:w-96 flex-shrink-0' : 'w-full'}`}>

            {barbers.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <p className="text-paper-muted/30 text-xs font-body">Nenhum barbeiro registado</p>
                <button
                  onClick={() => setModalBarber(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 hover:bg-gold/20 text-gold text-xs font-body rounded-lg transition-colors"
                >
                  <Plus size={13} /> Criar primeiro barbeiro
                </button>
              </div>
            )}

            <div className={`grid gap-3 ${selBarber ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {barbers.map(barber => {
                const cfg        = STATUS_CFG[barber.status]
                const isSelected = selected === barber.id
                const isConfirm  = confirmDelete === barber.id

                return (
                  <div
                    key={barber.id}
                    onClick={() => !isConfirm && setSelected(isSelected ? null : barber.id)}
                    className={`
                      bg-off-black-3 border rounded-xl p-4 cursor-pointer transition-all duration-200 relative group
                      ${isConfirm
                        ? 'border-barber-red/40 ring-1 ring-barber-red/10'
                        : isSelected
                          ? 'border-gold/30 ring-1 ring-gold/10 shadow-lg shadow-gold/5'
                          : 'border-white/[0.07] hover:border-white/[0.14]'
                      }
                    `}
                  >
                    {/* Confirmação de exclusão */}
                    {isConfirm && (
                      <div className="absolute inset-0 bg-off-black-3/95 rounded-xl flex flex-col items-center justify-center gap-3 z-10 p-4">
                        <AlertTriangle size={20} className="text-barber-red" />
                        <p className="text-paper text-xs font-body text-center">
                          Eliminar <span className="text-barber-red font-semibold">{barber.name}</span>?
                          <br />
                          <span className="text-paper-muted/40 text-[10px]">Esta ação não pode ser desfeita.</span>
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={e => { e.stopPropagation(); setConfirmDelete(null) }}
                            className="px-3 py-1.5 text-[11px] font-body text-paper-muted/60 hover:text-paper border border-white/10 rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); handleDelete(barber.id) }}
                            disabled={deleting}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-barber-red hover:bg-barber-red/80 disabled:opacity-50 text-white text-[11px] font-body font-semibold rounded-lg transition-colors"
                          >
                            {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Botões edit/delete — visíveis no hover */}
                    {!isConfirm && (
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          onClick={e => { e.stopPropagation(); setModalBarber(barber) }}
                          className="w-6 h-6 rounded bg-white/5 hover:bg-gold/20 hover:text-gold text-paper-muted flex items-center justify-center transition-colors"
                          title="Editar"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); setConfirmDelete(barber.id); setSelected(null) }}
                          className="w-6 h-6 rounded bg-white/5 hover:bg-barber-red/20 hover:text-barber-red text-paper-muted flex items-center justify-center transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}

                    {/* Cabeçalho */}
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img src={barber.photo} alt={barber.name}
                          className="w-12 h-12 rounded-xl object-cover grayscale" />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-off-black-3 ${cfg.dot}`} />
                      </div>
                      <div className="flex-1 min-w-0 pr-10">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-paper font-body font-semibold text-[13px] leading-tight">{barber.name}</h3>
                          <span className={`text-[10px] font-body px-1.5 py-0.5 rounded border ${cfg.pill}`}>{cfg.label}</span>
                        </div>
                        <p className="text-paper-muted/50 text-[11px] font-body mt-0.5">{barber.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={10} className="text-gold fill-gold" />
                          <span className="text-paper text-[11px] font-mono">{barber.rating}</span>
                          <span className="text-paper-muted/30 text-[11px] font-body ml-1">· {barber.totalCuts.toLocaleString('pt-PT')} cortes</span>
                        </div>
                      </div>
                    </div>

                    {/* Estado atual */}
                    {barber.currentClient && (
                      <div className="mt-3 px-3 py-1.5 bg-gold/[0.06] border border-gold/10 rounded-lg">
                        <p className="text-[11px] font-body">
                          <span className="text-paper-muted/50">Em atendimento: </span>
                          <span className="text-gold">{barber.currentClient}</span>
                        </p>
                      </div>
                    )}
                    {!barber.currentClient && barber.nextAppointment && (
                      <div className="mt-3 px-3 py-1.5 bg-off-black-2 border border-white/[0.05] rounded-lg flex items-center gap-2">
                        <Clock size={11} className="text-paper-muted/30" />
                        <p className="text-[11px] font-body text-paper-muted/50">
                          Próxima: <span className="text-paper">{barber.nextAppointment}</span>
                        </p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.05]">
                      {[
                        { v: barber.todayCuts,         l: 'Hoje'    },
                        { v: barber.weekCuts,           l: 'Semana'  },
                        { v: `€${barber.todayRevenue}`, l: 'Receita' },
                      ].map(s => (
                        <div key={s.l} className="text-center">
                          <p className="text-paper font-heading text-sm">{s.v}</p>
                          <p className="text-paper-muted/30 text-[9px] font-mono uppercase tracking-wider mt-0.5">{s.l}</p>
                        </div>
                      ))}
                    </div>

                    {/* Contactos */}
                    <div className="mt-3 flex flex-wrap gap-3 pt-3 border-t border-white/[0.05]">
                      {barber.phone && (
                        <a href={`tel:${barber.phone}`} onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-paper-muted/40 hover:text-paper text-[10px] font-body transition-colors">
                          <Phone size={10} />{barber.phone}
                        </a>
                      )}
                      {barber.email && (
                        <a href={`mailto:${barber.email}`} onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-paper-muted/40 hover:text-paper text-[10px] font-body transition-colors">
                          <Mail size={10} />{barber.email}
                        </a>
                      )}
                    </div>

                    {/* Toggle status */}
                    {isSelected && !isConfirm && (
                      <div className="mt-3 pt-3 border-t border-white/[0.05]" onClick={e => e.stopPropagation()}>
                        <p className="text-paper-muted/30 text-[9px] font-mono uppercase tracking-wider mb-2">Alterar estado</p>
                        <div className="flex flex-wrap gap-1.5">
                          {STATUS_OPTIONS.map(s => (
                            <button key={s} onClick={() => handleSetStatus(barber.id, s)}
                              className={`px-2.5 py-1 rounded text-[11px] font-body border transition-all ${
                                barber.status === s
                                  ? STATUS_CFG[s].pill + ' ring-1 ring-white/5'
                                  : 'bg-transparent border-white/10 text-paper-muted/40 hover:text-paper-muted hover:border-white/20'
                              }`}>
                              {STATUS_CFG[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Agenda */}
          {selBarber && (
            <div className="flex-1 min-w-0 min-h-[400px] lg:min-h-0 flex flex-col bg-off-black-3 border border-gold/20 rounded-xl overflow-hidden animate-fade-in">
              <div className="flex-shrink-0 px-4 lg:px-5 py-3 border-b border-white/[0.06] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-paper text-[13px] font-body font-semibold truncate">{selBarber.name}</p>
                  <p className="text-paper-muted/40 text-[10px] font-mono">Agenda de hoje · {agendaBks.length} marcações</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setModalBarber(selBarber)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gold/10 hover:bg-gold/20 border border-gold/20 text-gold text-[11px] font-body rounded-lg transition-colors"
                  >
                    <Pencil size={11} /> Editar
                  </button>
                  <div className="text-right hidden sm:block">
                    <p className="text-gold text-[13px] font-heading">€{selBarber.monthRevenue.toLocaleString('pt-PT')}</p>
                    <p className="text-paper-muted/40 text-[9px] font-mono">este mês</p>
                  </div>
                  <button onClick={() => setSelected(null)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-paper-muted hover:text-paper transition-colors">
                    <X size={13} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {agendaLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <span className="text-paper-muted/30 text-xs font-mono animate-pulse">A carregar…</span>
                  </div>
                ) : agendaBks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 gap-2">
                    <Clock size={20} className="text-paper-muted/20" />
                    <p className="text-paper-muted/30 text-xs font-body">Sem marcações para hoje</p>
                  </div>
                ) : agendaBks.map(bk => {
                  const isDone = bk.status === 'completed'
                  const isNow  = bk.status === 'in_progress'
                  return (
                    <div key={bk.id}
                      className={`flex items-center gap-3 px-4 lg:px-5 py-3 border-b border-white/[0.04] last:border-0 ${isNow ? 'bg-gold/[0.04]' : 'hover:bg-white/[0.02]'} transition-colors`}>
                      <span className={`font-mono text-xs w-10 flex-shrink-0 ${isNow ? 'text-gold' : isDone ? 'text-paper-muted/30 line-through' : 'text-paper-muted/60'}`}>
                        {bk.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-body ${isDone ? 'text-paper-muted/40' : 'text-paper'}`}>{bk.clientName}</p>
                        <p className="text-paper-muted/30 text-[10px] font-body">{bk.serviceName} · {bk.duration}min</p>
                      </div>
                      <span className="text-paper text-xs font-mono flex-shrink-0">€{bk.price}</span>
                      <span className={`text-[10px] font-body px-1.5 py-0.5 rounded border flex-shrink-0 ${
                        isDone ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        isNow  ? 'bg-gold/10 text-gold border-gold/20' :
                                 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {isDone ? 'Concluída' : isNow ? 'Em curso' : 'Confirmada'}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="flex-shrink-0 border-t border-white/[0.06] px-4 lg:px-5 py-3 bg-off-black-2/50 grid grid-cols-3 gap-3">
                {[
                  { l: 'Cortes mês',  v: String(selBarber.monthCuts),                        c: 'text-paper' },
                  { l: 'Semana',      v: `${selBarber.weekCuts} · €${selBarber.weekRevenue}`, c: 'text-paper' },
                  { l: 'Avaliação',   v: `★ ${selBarber.rating}`,                            c: 'text-gold'  },
                ].map(s => (
                  <div key={s.l}>
                    <p className="text-paper-muted/30 text-[9px] font-mono uppercase tracking-wider">{s.l}</p>
                    <p className={`text-xs font-body mt-0.5 ${s.c}`}>{s.v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal criar/editar — undefined = fechado, null = criar, AdminBarber = editar */}
      {modalBarber !== undefined && (
        <BarberFormModal
          barber={modalBarber}
          onClose={() => setModalBarber(undefined)}
          onSaved={loadBarbers}
        />
      )}
    </>
  )
}
