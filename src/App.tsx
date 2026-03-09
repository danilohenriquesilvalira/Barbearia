import { useState, useEffect, useRef } from 'react'
import type { BookingState, Service, Barber } from './types'

// Providers
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider }     from './context/AuthContext'
import { useLanguage }      from './context/LanguageContext'

// Componentes
import Navbar            from './components/Navbar'
import HeroSection       from './components/HeroSection'
import ServicesSection   from './components/ServicesSection'
import BarbersSection    from './components/BarbersSection'
import SchedulingSection from './components/SchedulingSection'
import BookingModal      from './components/BookingModal'
import Footer            from './components/Footer'
import AuthModal         from './components/AuthModal'
import UserDashboard     from './components/UserDashboard'

const INITIAL_BOOKING: BookingState = {
  selectedService: null,
  selectedBarber:  null,
  selectedDate:    null,
  selectedTime:    null,
  step:            1,
}

// ─── Inner App (precisa estar dentro dos providers para usar hooks) ────────────
function AppInner() {
  const { t, tr } = useLanguage()

  const [booking, setBooking]         = useState<BookingState>(INITIAL_BOOKING)
  const [modalOpen, setModalOpen]     = useState(false)
  const [authModalOpen, setAuthModalOpen]   = useState(false)
  const [dashboardOpen, setDashboardOpen]   = useState(false)
  const autoOpenedRef = useRef(false)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleBookClick = () => scrollTo('servicos')

  const handleDeselectService = () =>
    setBooking(prev => ({ ...prev, selectedService: null, step: 1 }))

  const handleDeselectBarber = () =>
    setBooking(prev => ({ ...prev, selectedBarber: null, step: 2 }))

  const handleDeselectTime = () =>
    setBooking(prev => ({ ...prev, selectedDate: null, selectedTime: null, step: 3 }))

  const handleServiceSelect = (service: Service) => {
    setBooking(prev => ({
      ...prev,
      selectedService: prev.selectedService?.id === service.id ? null : service,
      step: prev.selectedService?.id === service.id ? 1 : 2,
    }))
  }

  const handleBarberSelect = (barber: Barber) => {
    setBooking(prev => ({
      ...prev,
      selectedBarber: prev.selectedBarber?.id === barber.id ? null : barber,
      step: prev.selectedBarber?.id === barber.id ? 2 : 3,
    }))
  }

  const handleTimeSelected = (date: Date, time: string) => {
    setBooking(prev => ({ ...prev, selectedDate: date, selectedTime: time, step: 4 }))
  }

  const isReadyToBook =
    booking.selectedService &&
    booking.selectedBarber &&
    booking.selectedDate &&
    booking.selectedTime

  // Auto-abre o dialog quando os 3 passos estão completos (só uma vez por sessão de seleção)
  useEffect(() => {
    if (isReadyToBook && !autoOpenedRef.current) {
      autoOpenedRef.current = true
      setTimeout(() => setModalOpen(true), 400)
    }
    if (!isReadyToBook) {
      autoOpenedRef.current = false
    }
  }, [isReadyToBook])

  // Nome traduzido do serviço selecionado
  const selectedServiceName = booking.selectedService
    ? (tr.services.items[booking.selectedService.id as keyof typeof tr.services.items]?.name ?? booking.selectedService.name)
    : null

  return (
    <div className="min-h-screen bg-off-black text-paper font-body">
      <Navbar
        onBookClick={handleBookClick}
        onLoginClick={() => setAuthModalOpen(true)}
        onDashboardClick={() => setDashboardOpen(true)}
      />

      <main className={(booking.selectedService || booking.selectedBarber || booking.selectedTime) ? 'pb-14' : ''}>
        <HeroSection onBookClick={handleBookClick} />


        <ServicesSection
          onServiceSelect={handleServiceSelect}
          selectedServiceId={booking.selectedService?.id ?? null}
        />

        <BarbersSection
          onBarberSelect={handleBarberSelect}
          selectedBarberId={booking.selectedBarber?.id ?? null}
        />

        <SchedulingSection
          selectedBarber={booking.selectedBarber}
          selectedService={booking.selectedService}
          onTimeSelected={handleTimeSelected}
        />

      </main>

      <Footer />

      {/* ── Bar fixo no fundo — progresso + confirmar ── */}
      {(booking.selectedService || booking.selectedBarber || booking.selectedTime) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
          <div className="h-px bg-gold/30 w-full" />
          <div className="bg-[#0D0D0D]/96 backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 sm:gap-6">

              {/* Steps */}
              <div className="flex items-center gap-2 sm:gap-5 flex-1 min-w-0 overflow-hidden">
                {([
                  {
                    step: 1,
                    label: selectedServiceName ?? t('scheduling.summary.service'),
                    done: !!booking.selectedService,
                    onDone: handleDeselectService,
                    sectionId: 'servicos',
                  },
                  {
                    step: 2,
                    label: booking.selectedBarber?.name ?? t('scheduling.summary.barber'),
                    done: !!booking.selectedBarber,
                    onDone: handleDeselectBarber,
                    sectionId: 'barbeiros',
                  },
                  {
                    step: 3,
                    label: booking.selectedTime
                      ? `${booking.selectedDate?.toLocaleDateString('pt-PT').slice(0,5)} ${booking.selectedTime}`
                      : t('scheduling.summary.time'),
                    done: !!booking.selectedTime,
                    onDone: handleDeselectTime,
                    sectionId: 'agendar',
                  },
                ] as const).map(({ step, label, done, onDone, sectionId }, idx) => (
                  <div
                    key={step}
                    className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer group"
                    onClick={() => done ? onDone() : scrollTo(sectionId)}
                  >
                    {idx > 0 && <span className="w-3 h-px bg-paper/10 flex-shrink-0 hidden sm:block" />}
                    <span className={`w-5 h-5 border font-mono text-[9px] flex items-center justify-center flex-shrink-0 transition-all duration-300
                      ${done
                        ? 'border-gold bg-gold text-off-black font-bold group-hover:bg-gold-dark group-hover:border-gold-dark'
                        : 'border-paper/15 text-paper/20 group-hover:border-paper/30 group-hover:text-paper/40'
                      }`}>
                      {done ? '✓' : step}
                    </span>
                    <span className={`font-mono text-[9px] sm:text-[10px] tracking-wider uppercase truncate max-w-[55px] sm:max-w-[110px] transition-colors duration-300
                      ${done
                        ? 'text-gold group-hover:text-gold-dark'
                        : 'text-paper/20 group-hover:text-paper/40'
                      }`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Botão confirmar ou indicação do que falta */}
              {isReadyToBook ? (
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex-shrink-0 flex items-center gap-2 px-5 sm:px-7 py-2.5 bg-gold text-off-black font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold hover:bg-gold-light transition-colors"
                >
                  <span>{t('cta.confirm')}</span>
                  <span className="opacity-70">· {booking.selectedService?.price}€</span>
                </button>
              ) : (
                <span className="flex-shrink-0 font-mono text-[9px] text-paper/20 uppercase tracking-wider hidden sm:block">
                  {!booking.selectedService ? t('scheduling.summary.service')
                    : !booking.selectedBarber ? t('scheduling.summary.barber')
                    : t('scheduling.summary.time')} →
                </span>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Modais */}
      {modalOpen && (
        <BookingModal booking={booking} onClose={() => setModalOpen(false)} />
      )}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => setAuthModalOpen(false)}
        />
      )}
      {dashboardOpen && (
        <UserDashboard onClose={() => setDashboardOpen(false)} />
      )}
    </div>
  )
}

// ─── Root com providers ────────────────────────────────────────────────────────
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </LanguageProvider>
  )
}
