import { useState, useEffect, useRef } from 'react'
import type { Service } from './types'

// Providers
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider }     from './context/AuthContext'
import { useAuth }          from './context/AuthContext'

// Componentes
import Navbar        from './components/Navbar'
import HeroSection   from './components/HeroSection'
import ServicesSection from './components/ServicesSection'
import BarbersSection  from './components/BarbersSection'
import BookingModal  from './components/BookingModal'
import Footer        from './components/Footer'
import AuthModal     from './components/AuthModal'
import UserDashboard from './components/UserDashboard'
import AdminApp        from './admin/AdminApp'
import BarberApp       from './barber/BarberApp'
import StaffLoginPage  from './components/StaffLoginPage'

function AppInner() {
  const { user, needsProfile } = useAuth()

  const isStaffRoute = window.location.pathname.endsWith('/staff')
  const isAdmin  = user?.role === 'admin'
  const isBarber = user?.role === 'barber'
  const [adminOpen,     setAdminOpen]     = useState(false)
  const [barberOpen,    setBarberOpen]    = useState(false)
  const [bookingOpen,   setBookingOpen]   = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [dashboardOpen, setDashboardOpen] = useState(false)

  // Serviço pendente — guardado antes do login para abrir o booking modal depois
  const pendingServiceRef = useRef<Service | null>(null)

  // Quando barbeiro faz login → abrir BarberApp automaticamente
  useEffect(() => {
    if (isBarber && !needsProfile) {
      setBarberOpen(true)
      setAuthModalOpen(false)
      // Se estava em /staff, volta para a raiz para limpar o URL
      if (window.location.pathname.endsWith('/staff')) {
        window.history.replaceState(null, '', '/Barbearia/')
      }
    }
  }, [isBarber, needsProfile])

  // Abre AuthModal quando precisa completar perfil (após OAuth)
  useEffect(() => {
    if (needsProfile) setAuthModalOpen(true)
  }, [needsProfile])

  // Após login, se havia um serviço pendente, abre o BookingModal (só para clientes)
  useEffect(() => {
    if (user && !needsProfile && pendingServiceRef.current && user.role === 'client') {
      setBookingOpen(true)
    }
  }, [user, needsProfile])

  if (isStaffRoute && !user) return <StaffLoginPage />

  // Clique em "Reservar Corte" (sem serviço específico)
  const handleBookClick = () => {
    pendingServiceRef.current = null
    if (user) { setBookingOpen(true) }
    else { setAuthModalOpen(true) }
  }

  // Clique em "Marcar" num serviço específico
  const handleBookService = (service: Service) => {
    pendingServiceRef.current = service
    if (user) { setBookingOpen(true) }
    else { setAuthModalOpen(true) }
  }

  const handleAuthSuccess = () => {
    setAuthModalOpen(false)
    if (!needsProfile && user?.role === 'client') setBookingOpen(true)
  }

  return (
    <div className="min-h-screen bg-off-black text-paper font-body">
      {/* Admin overlay */}
      {adminOpen && (
        <AdminApp
          onExit={() => setAdminOpen(false)}
          adminName={user?.name ?? 'Admin'}
        />
      )}

      {/* Barber overlay */}
      {barberOpen && (
        <BarberApp onExit={() => setBarberOpen(false)} />
      )}

      <Navbar
        onBookClick={handleBookClick}
        onLoginClick={() => setAuthModalOpen(true)}
        onDashboardClick={() => setDashboardOpen(true)}
        onAdminClick={isAdmin ? () => setAdminOpen(true) : undefined}
        onBarberClick={isBarber ? () => setBarberOpen(true) : undefined}
      />

      <main>
        <HeroSection onBookClick={handleBookClick} />
        <ServicesSection onBookService={handleBookService} />
        <BarbersSection />
      </main>

      <Footer />

      {/* Modais */}
      {bookingOpen && (
        <BookingModal
          onClose={() => { setBookingOpen(false); pendingServiceRef.current = null }}
          initialService={pendingServiceRef.current}
        />
      )}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
      {dashboardOpen && (
        <UserDashboard onClose={() => setDashboardOpen(false)} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </LanguageProvider>
  )
}
