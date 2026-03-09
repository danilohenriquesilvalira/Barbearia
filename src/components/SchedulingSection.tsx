import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { generateTimeSlots, generateMonthAvailability } from '../data/mockData'
import type { Barber, Service } from '../types'
import { useLanguage } from '../context/LanguageContext'
import { asset } from '../lib/asset'

interface SchedulingSectionProps {
  selectedBarber:  Barber | null
  selectedService: Service | null
  onTimeSelected:  (date: Date, time: string) => void
}

export default function SchedulingSection({
  selectedBarber,
  selectedService,
  onTimeSelected,
}: SchedulingSectionProps) {
  const { t, tr } = useLanguage()

  const today = new Date(); today.setHours(0,0,0,0)
  const [viewMonth, setViewMonth]       = useState(today.getMonth())
  const [viewYear, setViewYear]         = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const availability = useMemo(() => generateMonthAvailability(), [])

  const calendarDays = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const last  = new Date(viewYear, viewMonth + 1, 0)
    const days: (Date | null)[] = []
    for (let i = 0; i < first.getDay(); i++) days.push(null)
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(viewYear, viewMonth, d))
    return days
  }, [viewMonth, viewYear])

  const getAv = (date: Date) =>
    availability.find(a =>
      a.date.getDate() === date.getDate() &&
      a.date.getMonth() === date.getMonth() &&
      a.date.getFullYear() === date.getFullYear()
    )

  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedBarber) return []
    return generateTimeSlots(selectedDate, selectedBarber.id)
  }, [selectedDate, selectedBarber])

  const handleDate = (date: Date) => {
    const av = getAv(date)
    if (!av?.available || date < today) return
    setSelectedDate(date); setSelectedTime(null)
  }

  const handleTime = (time: string, available: boolean) => {
    if (!available || !selectedDate) return
    setSelectedTime(time)
    onTimeSelected(selectedDate, time)
  }

  const prevMonth = () => viewMonth === 0 ? (setViewMonth(11), setViewYear(y=>y-1)) : setViewMonth(m=>m-1)
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0), setViewYear(y=>y+1)) : setViewMonth(m=>m+1)

  const isToday    = (d: Date) => d.getDate()===today.getDate() && d.getMonth()===today.getMonth() && d.getFullYear()===today.getFullYear()
  const isSelected = (d: Date) => !!selectedDate && d.getDate()===selectedDate.getDate() && d.getMonth()===selectedDate.getMonth()
  const isPast     = (d: Date) => d < today

  const MONTHS   = tr.scheduling.months
  const WEEKDAYS = tr.scheduling.weekdays

  const serviceName = selectedService
    ? (tr.services.items[selectedService.id as keyof typeof tr.services.items]?.name ?? selectedService.name)
    : null

  return (
    <section id="agendar" className="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      {/* Fundo dessaturado — evita conflito de cor com o dourado */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url('${asset('/fundo_page_1.jpg')}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        filter: 'grayscale(1)',
      }} />
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-off-black/82 via-off-black/68 to-off-black/85" />
      <div className="relative z-10 max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="font-mono text-[11px] tracking-[0.6em] uppercase text-gold/60 mb-5">
            {t('scheduling.sectionTag')}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-paper mb-8">
            {t('scheduling.title')}
          </h2>
          <div className="flex items-center justify-center gap-4 max-w-lg mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/50 to-gold" />
            <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-gold uppercase whitespace-nowrap px-3">
              {t('scheduling.subtitle')}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/50 to-gold" />
          </div>
        </div>

        {/* ── Card unificado calendário + slots ── */}
        <div className="border border-gold/25 bg-[#0D0D0D] overflow-hidden shadow-2xl">

          {/* Acento topo */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent w-full" />

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ── Calendário ── */}
            <div className="lg:border-r border-gold/10">

              {/* Navegação mês */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gold/10">
                <button
                  onClick={prevMonth}
                  className="w-8 h-8 flex items-center justify-center border border-gold/20 hover:border-gold/60 hover:text-gold text-paper/40 transition-colors active:scale-95"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="font-mono text-xs sm:text-sm text-paper tracking-[0.15em] uppercase">
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="w-8 h-8 flex items-center justify-center border border-gold/20 hover:border-gold/60 hover:text-gold text-paper/40 transition-colors active:scale-95"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="px-3 pt-3 pb-4">
                {/* Dias da semana */}
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAYS.map((wd) => (
                    <div key={wd} className="text-center font-mono text-[9px] text-gold/40 tracking-wider uppercase py-1.5">
                      {wd}
                    </div>
                  ))}
                </div>

                {/* Grid de dias */}
                <div className="grid grid-cols-7 gap-0.5">
                  {calendarDays.map((date, i) => {
                    if (!date) return <div key={`p-${i}`} />
                    const av     = getAv(date)
                    const past   = isPast(date)
                    const closed = !av?.available
                    const sel    = isSelected(date)
                    const tod    = isToday(date)

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDate(date)}
                        disabled={past || closed}
                        className={`
                          relative flex flex-col items-center justify-center
                          h-9 w-full font-mono text-xs
                          transition-all duration-150 active:scale-95
                          ${past || closed
                            ? 'text-paper/12 cursor-not-allowed'
                            : sel
                              ? 'bg-gold text-off-black font-bold'
                              : tod
                                ? 'border border-gold/50 text-gold hover:bg-gold/10'
                                : 'text-paper/70 hover:text-gold hover:bg-gold/8 cursor-pointer'
                          }
                        `}
                      >
                        {date.getDate()}
                        {!past && av?.available && !sel && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-gold/60" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Legenda */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gold/10 flex-wrap">
                  {[
                    { cls: 'bg-gold/50',  label: t('scheduling.legend.available') },
                    { cls: 'bg-gold',     label: t('scheduling.legend.selected') },
                    { cls: 'bg-paper/10', label: t('scheduling.legend.unavailable') },
                  ].map(({ cls, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cls}`} />
                      <span className="font-mono text-[9px] text-paper/30">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Divisor mobile */}
            <div className="lg:hidden flex items-center gap-3 px-4">
              <div className="h-px flex-1 bg-gold/15" />
              <span className="w-1 h-1 bg-gold/30 rotate-45 flex-shrink-0" />
              <div className="h-px flex-1 bg-gold/15" />
            </div>

            {/* ── Time Slots ── */}
            <div>

              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gold/10">
                <Clock size={11} className="text-gold/60 flex-shrink-0" />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-paper/40">
                  {selectedDate
                    ? `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}`
                    : t('scheduling.selectDate')
                  }
                </span>
              </div>

              <div className="px-4 py-4">
                {!selectedDate ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-2.5">
                    <Calendar size={20} className="text-gold/15" />
                    <p className="font-mono text-[10px] tracking-wider uppercase text-paper/20">
                      {t('scheduling.noDate')}
                    </p>
                  </div>
                ) : !selectedBarber ? (
                  <div className="flex items-start justify-center py-10">
                    <p className="font-mono text-[10px] tracking-wider uppercase text-paper/20 border-l border-gold/30 pl-3">
                      {t('scheduling.needsBarber')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 animate-fade-in">
                    {timeSlots.map((slot) => {
                      const sel = selectedTime === slot.time
                      return (
                        <button
                          key={slot.time}
                          onClick={() => handleTime(slot.time, slot.available)}
                          disabled={!slot.available}
                          className={`
                            py-2.5 font-mono text-[11px] tracking-wider
                            border transition-all duration-150 text-center active:scale-95
                            ${!slot.available
                              ? 'border-gold/5 text-paper/12 cursor-not-allowed line-through'
                              : sel
                                ? 'border-gold bg-gold text-off-black font-bold'
                                : 'border-gold/20 text-paper/60 hover:border-gold/60 hover:text-gold cursor-pointer'
                            }
                          `}
                        >
                          {slot.time}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Resumo compacto */}
                {selectedDate && selectedTime && selectedBarber && (
                  <div className="mt-4 pt-3 border-t border-gold/10 animate-slide-up space-y-2">
                    {selectedService && (
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-paper/25 font-mono text-[9px] uppercase tracking-wider">{t('scheduling.summary.service')}</span>
                        <span className="text-paper/70 font-mono text-[10px] text-right">{serviceName}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-paper/25 font-mono text-[9px] uppercase tracking-wider">{t('scheduling.summary.barber')}</span>
                      <span className="text-paper/70 font-mono text-[10px]">{selectedBarber.name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gold/10 gap-4">
                      <span className="text-paper/25 font-mono text-[9px] uppercase tracking-wider">{t('scheduling.summary.total')}</span>
                      <span className="text-gold font-heading text-xl">{selectedService?.price}€</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
