import { useState } from 'react'
import { X, Check, Loader2, Calendar, Clock, Scissors, User } from 'lucide-react'
import type { BookingState } from '../types'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

interface BookingModalProps {
  booking:  BookingState
  onClose:  () => void
}

interface FormData {
  name:  string
  phone: string
  email: string
  notes: string
}

type SubmitStatus = 'idle' | 'loading' | 'success'

export default function BookingModal({ booking, onClose }: BookingModalProps) {
  const { t, tr } = useLanguage()
  const { user, addBooking } = useAuth()

  const [form, setForm]     = useState<FormData>({
    name:  user?.name  ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    notes: '',
  })
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => {
      if (user && booking.selectedService && booking.selectedBarber && booking.selectedDate && booking.selectedTime) {
        const svcName = tr.services.items[booking.selectedService.id as keyof typeof tr.services.items]?.name ?? booking.selectedService.name
        addBooking({
          serviceId:   booking.selectedService.id,
          serviceName: svcName,
          barberName:  booking.selectedBarber.name,
          date:        booking.selectedDate.toISOString().slice(0, 10),
          time:        booking.selectedTime,
          price:       booking.selectedService.price,
        })
      }
      setStatus('success')
    }, 1600)
  }

  const serviceName = booking.selectedService
    ? (tr.services.items[booking.selectedService.id as keyof typeof tr.services.items]?.name ?? booking.selectedService.name)
    : null

  const dateStr = booking.selectedDate?.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={status !== 'loading' ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl animate-slide-up">

        {/* Barra gold no topo */}
        <div className="h-0.5 bg-gold w-full" />

        <div className="bg-[#111111] border border-gold/20 border-t-0 max-h-[90vh] overflow-y-auto">

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-paper/8">
            <div>
              <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-0.5">
                {t('modal.summaryLabel')}
              </p>
              <h2 className="font-display text-xl sm:text-2xl text-paper font-semibold">
                {t('modal.title')}
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={status === 'loading'}
              className="w-9 h-9 flex items-center justify-center border border-paper/10 text-paper/40 hover:border-gold/40 hover:text-gold transition-colors disabled:opacity-30"
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Success state ── */}
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
              <div className="w-16 h-16 border-2 border-gold flex items-center justify-center mb-2">
                <Check size={28} className="text-gold" strokeWidth={2} />
              </div>
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-gold/60">
                {t('modal.successTitle')}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl text-paper font-semibold">
                {t('modal.successMsg')}
              </h3>
              <div className="mt-2 flex items-center gap-3 font-mono text-sm text-paper/50">
                <span>{dateStr}</span>
                <span className="w-1 h-1 rounded-full bg-gold/40" />
                <span>{booking.selectedTime}</span>
                <span className="w-1 h-1 rounded-full bg-gold/40" />
                <span className="text-gold">{booking.selectedService?.price}€</span>
              </div>
              <button
                onClick={onClose}
                className="mt-6 px-8 py-3 border border-gold text-gold font-mono text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-off-black transition-all duration-200"
              >
                {t('modal.close')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr]">

              {/* ── Painel esquerdo: resumo ── */}
              <div className="bg-[#0D0D0D] border-b sm:border-b-0 sm:border-r border-paper/8 p-5 sm:p-6 flex flex-col gap-5">
                <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-gold/50">
                  Resumo
                </p>

                {/* Serviço */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Scissors size={13} className="text-gold/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-paper/30 mb-0.5">
                      {t('modal.service')}
                    </p>
                    <p className="font-display text-sm text-paper font-semibold leading-snug">
                      {serviceName}
                    </p>
                  </div>
                </div>

                {/* Barbeiro */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User size={13} className="text-gold/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-paper/30 mb-0.5">
                      {t('modal.barber')}
                    </p>
                    <p className="font-display text-sm text-paper font-semibold">
                      {booking.selectedBarber?.name}
                    </p>
                  </div>
                </div>

                {/* Data */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar size={13} className="text-gold/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-paper/30 mb-0.5">
                      {t('modal.dateTime')}
                    </p>
                    <p className="font-display text-sm text-paper font-semibold capitalize">
                      {dateStr}
                    </p>
                  </div>
                </div>

                {/* Hora */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={13} className="text-gold/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-paper/30 mb-0.5">
                      {t('scheduling.summary.time')}
                    </p>
                    <p className="font-mono text-base text-gold font-bold">
                      {booking.selectedTime}
                    </p>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-auto pt-4 border-t border-paper/8">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-paper/30">
                      {t('modal.total')}
                    </span>
                    <span className="font-heading text-3xl text-gold leading-none">
                      {booking.selectedService?.price}<span className="text-lg ml-0.5">€</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Painel direito: formulário ── */}
              <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-4">
                <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-gold/50 mb-1">
                  Os seus dados
                </p>

                {/* Nome */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.25em] uppercase text-paper/30 mb-1.5">
                    {t('modal.name')} *
                  </label>
                  <input
                    type="text" name="name" required value={form.name} onChange={handleChange}
                    placeholder={t('modal.namePlaceholder')}
                    className="w-full bg-transparent border border-paper/12 focus:border-gold text-paper font-body text-sm px-3 py-2.5 outline-none transition-colors placeholder:text-paper/15"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.25em] uppercase text-paper/30 mb-1.5">
                    {t('modal.phone')} *
                  </label>
                  <input
                    type="tel" name="phone" required value={form.phone} onChange={handleChange}
                    placeholder={t('modal.phonePlaceholder')}
                    className="w-full bg-transparent border border-paper/12 focus:border-gold text-paper font-mono text-sm px-3 py-2.5 outline-none transition-colors placeholder:text-paper/15"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.25em] uppercase text-paper/30 mb-1.5">
                    {t('modal.email')}
                  </label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder={t('modal.emailPlaceholder')}
                    className="w-full bg-transparent border border-paper/12 focus:border-gold text-paper font-body text-sm px-3 py-2.5 outline-none transition-colors placeholder:text-paper/15"
                  />
                </div>

                {/* Notas */}
                <div>
                  <label className="block font-mono text-[9px] tracking-[0.25em] uppercase text-paper/30 mb-1.5">
                    {t('modal.notes')}
                  </label>
                  <textarea
                    name="notes" value={form.notes} onChange={handleChange} rows={2}
                    placeholder={t('modal.notesPlaceholder')}
                    className="w-full bg-transparent border border-paper/12 focus:border-gold text-paper font-body text-sm px-3 py-2.5 outline-none transition-colors resize-none placeholder:text-paper/15"
                  />
                </div>

                {/* Botão submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`
                    mt-auto w-full py-3.5 font-mono text-xs tracking-[0.25em] uppercase
                    border transition-all duration-200 flex items-center justify-center gap-2
                    ${status === 'loading'
                      ? 'border-gold bg-gold text-off-black cursor-wait'
                      : 'border-gold bg-gold text-off-black hover:bg-transparent hover:text-gold'
                    }
                  `}
                >
                  {status === 'loading'
                    ? <><Loader2 size={14} className="animate-spin" /> {t('modal.submitting')}</>
                    : <><Check size={14} strokeWidth={2.5} /> {t('modal.submit')}</>
                  }
                </button>
              </form>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
