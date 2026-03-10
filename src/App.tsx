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
import AdminApp      from './admin/AdminApp'

// Emails Google com acesso admin
// Quando o Supabase estiver activo, isto é substituído pela coluna `role` na tabela profiles
const ADMIN_EMAILS: string[] = [
  'danilosilvalira10@gmail.com',
]

function AppInner() {
  const { user, needsProfile } = useAuth()
  const [adminOpen, setAdminOpen] = useState(false)

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email ?? '')

  const [bookingOpen,   setBookingOpen]   = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [dashboardOpen, setDashboardOpen] = useState(false)

  // Serviço pendente — guardado antes do login para abrir o booking modal depois
  const pendingServiceRef = useRef<Service | null>(null)

  // Abre AuthModal quando precisa completar perfil (após OAuth)
  useEffect(() => {
    if (needsProfile) setAuthModalOpen(true)
  }, [needsProfile])

  // Após login, se havia um serviço pendente, abre o BookingModal
  useEffect(() => {
    if (user && !needsProfile && pendingServiceRef.current) {
      setBookingOpen(true)
    }
  }, [user, needsProfile])

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
    if (!needsProfile) setBookingOpen(true)
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

      <Navbar
        onBookClick={handleBookClick}
        onLoginClick={() => setAuthModalOpen(true)}
        onDashboardClick={() => setDashboardOpen(true)}
        onAdminClick={isAdmin ? () => setAdminOpen(true) : undefined}
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
