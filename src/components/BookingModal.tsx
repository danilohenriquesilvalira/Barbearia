import { useState, useMemo } from 'react'
import { X, Check, Loader2, ChevronLeft, ChevronRight, Scissors, User, Calendar, Clock } from 'lucide-react'
import type { Service, Barber } from '../types'
import { SERVICES, BARBERS, generateTimeSlots, generateMonthAvailability } from '../data/mockData'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import BarberPole from './BarberPole'

type WizardStep = 'service' | 'barber' | 'datetime' | 'confirm'
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

interface BookingModalProps {
  onClose:        () => void
  initialService?: Service | null
}

export default function BookingModal({ onClose, initialService }: BookingModalProps) {
  const { t, tr } = useLanguage()
  const { user, addBooking } = useAuth()

  const [step,    setStep]    = useState<WizardStep>(initialService ? 'barber' : 'service')
  const [service, setService] = useState<Service | null>(initialService ?? null)
  const [barber,  setBarber]  = useState<Barber | null>(null)
  const [date,    setDate]    = useState<Date | null>(null)
  const [time,    setTime]    = useState<string | null>(null)
  const [notes,   setNotes]   = useState('')
  const [status,  setStatus]  = useState<SubmitStatus>('idle')

  // Calendário
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d }, [])
  const [calYear,  setCalYear]  = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  const monthAvailability = useMemo(() => generateMonthAvailability(), [])

  const daysInMonth  = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay()

  const timeSlots = useMemo(
    () => (date && barber ? generateTimeSlots(date, barber.id) : []),
    [date, barber],
  )

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  const isDayDisabled = (day: number) => {
    const d = new Date(calYear, calMonth, day)
    d.setHours(0,0,0,0)
    if (d < today) return true
    if (d.getDay() === 0) return true // domingo fechado
    return false
  }

  const isSelectedDay = (day: number) =>
    date?.getFullYear() === calYear && date?.getMonth() === calMonth && date?.getDate() === day

  const selectDay = (day: number) => {
    if (isDayDisabled(day)) return
    const d = new Date(calYear, calMonth, day)
    setDate(d)
    setTime(null)
  }

  // Submeter marcação
  const handleConfirm = async () => {
    if (!user || !service || !barber || !date || !time) return
    setStatus('loading')
    try {
      const svcName = tr.services.items[service.id as keyof typeof tr.services.items]?.name ?? service.name
      await addBooking({
        serviceId:   service.id,
        serviceName: svcName,
        barberName:  barber.name,
        date:        date.toISOString().slice(0, 10),
        time,
        price:       service.price,
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const stepTitle: Record<WizardStep, string> = {
    service:  t('booking.stepService'),
    barber:   t('booking.stepBarber'),
    datetime: t('booking.stepDate'),
    confirm:  t('booking.stepConfirm'),
  }

  const steps: WizardStep[] = ['service', 'barber', 'datetime', 'confirm']
  const stepIdx = steps.indexOf(step)

  const dateStr = date?.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={status !== 'loading' && status !== 'success' ? onClose : undefined} />

      <div className="relative w-full max-w-lg animate-slide-up flex flex-col max-h-[92vh]">
        <BarberPole height="4px" />

        <div className="bg-off-black-2 border border-paper/10 border-t-0 flex flex-col overflow-hidden">

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-paper/8 flex-shrink-0">
            <div className="flex items-center gap-3">
              {stepIdx > 0 && status === 'idle' && (
                <button
                  onClick={() => setStep(steps[stepIdx - 1])}
                  className="p-1.5 text-paper-muted hover:text-gold transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              <div>
                <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-gold/60">
                  {t('booking.title')} · {stepIdx + 1}/{steps.length}
                </p>
                <h2 className="font-display text-lg text-paper font-semibold leading-tight">
                  {stepTitle[step]}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={status === 'loading'}
              className="p-2 border border-paper/10 hover:border-gold/40 hover:text-gold text-paper-muted transition-colors disabled:opacity-30"
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Progresso ── */}
          <div className="flex h-0.5 flex-shrink-0">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`flex-1 transition-colors duration-300 ${i <= stepIdx ? 'bg-gold' : 'bg-paper/8'}`}
              />
            ))}
          </div>

          {/* ── Conteúdo ── */}
          <div className="flex-1 overflow-y-auto">

            {/* SUCCESS */}
            {status === 'success' && (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-4">
                <div className="w-16 h-16 border-2 border-gold flex items-center justify-center">
                  <Check size={28} className="text-gold" strokeWidth={2} />
                </div>
                <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-gold/60">{t('booking.successTitle')}</p>
                <h3 className="font-display text-2xl text-paper font-semibold">{t('booking.successMsg')}</h3>
                <div className="flex items-center gap-3 font-mono text-sm text-paper/50 mt-1">
                  <span>{dateStr}</span>
                  <span className="w-1 h-1 rounded-full bg-gold/40" />
                  <span>{time}</span>
                  <span className="w-1 h-1 rounded-full bg-gold/40" />
                  <span className="text-gold">{service?.price}€</span>
                </div>
                <button onClick={onClose} className="mt-4 px-8 py-3 border border-gold text-gold font-mono text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-off-black transition-all">
                  {t('booking.close')}
                </button>
              </div>
            )}

            {/* ERROR */}
            {status === 'error' && (
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-4">
                <div className="w-16 h-16 border-2 border-barber-red/50 flex items-center justify-center">
                  <span className="text-barber-red text-2xl font-bold">!</span>
                </div>
                <h3 className="font-display text-xl text-paper font-semibold">{t('booking.errorTitle')}</h3>
                <p className="font-body text-sm text-paper-muted">{t('booking.errorMsg')}</p>
                <button onClick={() => setStatus('idle')} className="mt-2 px-8 py-3 border border-gold text-gold font-mono text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-off-black transition-all">
                  {t('booking.retry')}
                </button>
              </div>
            )}

            {status === 'idle' && (
              <>
                {/* ── STEP 1: SERVIÇO ── */}
                {step === 'service' && (
                  <div className="p-5 grid grid-cols-1 gap-2">
                    {SERVICES.map(svc => {
                      const name = tr.services.items[svc.id as keyof typeof tr.services.items]?.name ?? svc.name
                      const desc = tr.services.items[svc.id as keyof typeof tr.services.items]?.description ?? svc.description
                      return (
                        <button
                          key={svc.id}
                          onClick={() => { setService(svc); setStep('barber') }}
                          className="text-left border border-paper/10 hover:border-gold/50 bg-off-black hover:bg-off-black-3 p-4 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-display text-paper font-semibold text-sm group-hover:text-gold transition-colors">{name}</p>
                              <p className="font-body text-xs text-paper-muted mt-0.5 leading-relaxed">{desc}</p>
                            </div>
                            <div className="flex flex-col items-end flex-shrink-0 gap-1">
                              <span className="font-heading text-xl text-gold">{svc.price}€</span>
                              <span className="font-mono text-[10px] text-paper/30">{svc.duration} {t('booking.duration')}</span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* ── STEP 2: BARBEIRO ── */}
                {step === 'barber' && (
                  <div className="p-5 grid grid-cols-1 gap-2">
                    {BARBERS.map(b => (
                      <button
                        key={b.id}
                        onClick={() => { if (b.available) { setBarber(b); setStep('datetime') } }}
                        disabled={!b.available}
                        className={`text-left border p-4 transition-all flex items-center gap-4
                          ${b.available
                            ? 'border-paper/10 hover:border-gold/50 bg-off-black hover:bg-off-black-3 cursor-pointer group'
                            : 'border-paper/5 bg-off-black opacity-40 cursor-not-allowed'
                          }`}
                      >
                        <div className="w-12 h-12 border border-gold/20 overflow-hidden flex-shrink-0 bg-off-black-3">
                          <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-paper font-semibold text-sm group-hover:text-gold transition-colors">{b.name}</p>
                          <p className="font-mono text-[10px] text-paper/40 tracking-wider">{b.role}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {b.specialties.slice(0, 2).map(s => (
                              <span key={s} className="font-mono text-[9px] text-paper/30 border border-paper/10 px-1.5 py-0.5">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {b.available
                            ? <span className="font-mono text-[9px] text-gold/70 border border-gold/30 px-2 py-1 tracking-widest uppercase">{tr.barbers.available}</span>
                            : <span className="font-mono text-[9px] text-paper/30 border border-paper/10 px-2 py-1 tracking-widest uppercase">{tr.barbers.occupied}</span>
                          }
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* ── STEP 3: DATA & HORA ── */}
                {step === 'datetime' && (
                  <div className="p-5 space-y-5">
                    {/* Calendário */}
                    <div>
                      {/* Cabeçalho do mês */}
                      <div className="flex items-center justify-between mb-4">
                        <button onClick={prevMonth} className="p-1.5 text-paper-muted hover:text-gold transition-colors">
                          <ChevronLeft size={16} />
                        </button>
                        <p className="font-display text-base text-paper font-semibold capitalize">
                          {tr.scheduling.months[calMonth]} {calYear}
                        </p>
                        <button onClick={nextMonth} className="p-1.5 text-paper-muted hover:text-gold transition-colors">
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      {/* Dias da semana */}
                      <div className="grid grid-cols-7 mb-1">
                        {tr.scheduling.weekdays.map(d => (
                          <div key={d} className="text-center font-mono text-[9px] tracking-wider text-paper/25 py-1">{d}</div>
                        ))}
                      </div>

                      {/* Grid de dias */}
                      <div className="grid grid-cols-7 gap-0.5">
                        {Array.from({ length: firstDayOfWeek }, (_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: daysInMonth }, (_, i) => {
                          const day = i + 1
                          const disabled = isDayDisabled(day)
                          const selected = isSelectedDay(day)
                          return (
                            <button
                              key={day}
                              onClick={() => selectDay(day)}
                              disabled={disabled}
                              className={`aspect-square flex items-center justify-center font-mono text-xs transition-all
                                ${selected
                                  ? 'bg-gold text-off-black font-bold'
                                  : disabled
                                    ? 'text-paper/15 cursor-not-allowed'
                                    : 'text-paper/70 hover:bg-gold/20 hover:text-gold cursor-pointer'
                                }`}
                            >
                              {day}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Horários */}
                    {date && (
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-3">
                          {dateStr}
                        </p>
                        {timeSlots.length === 0 ? (
                          <p className="text-center font-body text-sm text-paper-muted py-4">{t('booking.noSlots')}</p>
                        ) : (
                          <div className="grid grid-cols-4 gap-1.5">
                            {timeSlots.map(slot => (
                              <button
                                key={slot.time}
                                onClick={() => slot.available && setTime(slot.time)}
                                disabled={!slot.available}
                                className={`py-2 font-mono text-xs transition-all
                                  ${time === slot.time
                                    ? 'bg-gold text-off-black font-bold'
                                    : slot.available
                                      ? 'border border-paper/15 text-paper/70 hover:border-gold/50 hover:text-gold'
                                      : 'text-paper/15 cursor-not-allowed line-through'
                                  }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {!date && (
                      <p className="text-center font-body text-sm text-paper/30 py-4">{t('booking.selectDay')}</p>
                    )}
                  </div>
                )}

                {/* ── STEP 4: CONFIRMAR ── */}
                {step === 'confirm' && (
                  <div className="p-5 space-y-4">
                    {/* Resumo */}
                    <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-gold/50">{t('booking.summary')}</p>
                    <div className="border border-gold/20 bg-off-black divide-y divide-paper/5">
                      {[
                        { icon: Scissors, label: t('modal.service'),  value: tr.services.items[service?.id as keyof typeof tr.services.items]?.name ?? service?.name },
                        { icon: User,     label: t('modal.barber'),   value: barber?.name },
                        { icon: Calendar, label: t('modal.dateTime'), value: dateStr },
                        { icon: Clock,    label: tr.scheduling.summary.time, value: time },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3 px-4 py-3">
                          <Icon size={13} className="text-gold/50 flex-shrink-0" />
                          <span className="font-mono text-[9px] uppercase tracking-wider text-paper/30 w-16 flex-shrink-0">{label}</span>
                          <span className="font-display text-sm text-paper">{value}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-paper/30">{t('booking.total')}</span>
                        <span className="font-heading text-2xl text-gold">{service?.price}€</span>
                      </div>
                    </div>

                    {/* Notas */}
                    <div>
                      <label className="block font-mono text-[10px] tracking-[0.3em] uppercase text-paper/40 mb-2">
                        {t('booking.notes')}
                      </label>
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={2}
                        placeholder={t('booking.notesHint')}
                        className="w-full bg-off-black border border-paper/10 focus:border-gold/50 text-paper font-body text-sm px-3 py-2.5 outline-none transition-colors resize-none placeholder:text-paper/15"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Footer / Botão de ação ── */}
          {status === 'idle' && (
            <div className="flex-shrink-0 px-5 py-4 border-t border-paper/8">
              {step === 'datetime' && date && time && (
                <button
                  onClick={() => setStep('confirm')}
                  className="w-full py-3.5 bg-gold text-off-black font-mono text-xs tracking-[0.2em] uppercase font-bold hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
                >
                  {t('booking.next')} →
                </button>
              )}
              {step === 'confirm' && (
                <button
                  onClick={handleConfirm}
                  disabled={status === 'loading'}
                  className="w-full py-3.5 bg-gold text-off-black font-mono text-xs tracking-[0.2em] uppercase font-bold hover:bg-gold-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === 'loading'
                    ? <><Loader2 size={14} className="animate-spin" /> {t('booking.confirming')}</>
                    : <><Check size={14} strokeWidth={2.5} /> {t('booking.confirm')}</>
                  }
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
