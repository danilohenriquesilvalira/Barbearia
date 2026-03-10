import { useState } from 'react'
import { Bell, Menu, X, ChevronRight } from 'lucide-react'
import Sidebar, { type AdminPage } from './components/Sidebar'
import Dashboard    from './pages/Dashboard'
import Barbers      from './pages/Barbers'
import Clients      from './pages/Clients'
import Appointments from './pages/Appointments'

interface AdminAppProps {
  onExit: () => void
  adminName: string
}

const BREADCRUMBS: Record<AdminPage, string[]> = {
  dashboard:    ['Admin'],
  barbers:      ['Admin', 'Barbeiros'],
  clients:      ['Admin', 'Clientes'],
  appointments: ['Admin', 'Marcações'],
}

export default function AdminApp({ onExit, adminName }: AdminAppProps) {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const PageComponent = {
    dashboard:    Dashboard,
    barbers:      Barbers,
    clients:      Clients,
    appointments: Appointments,
  }[activePage]

  const crumbs = BREADCRUMBS[activePage]

  return (
    /* Trava absoluta — zero scroll no body */
    <div className="fixed inset-0 z-50 bg-off-black flex overflow-hidden scrollbar-none">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 h-full flex-shrink-0
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          active={activePage}
          onNavigate={page => { setActivePage(page); setSidebarOpen(false) }}
          onExit={onExit}
          adminName={adminName}
        />
      </div>

      {/* ── Main (Header + Conteúdo) ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden min-w-0">

        {/* Topbar — altura fixa */}
        <header className="flex-shrink-0 h-14 bg-off-black-2/80 backdrop-blur-md border-b border-white/[0.06] flex items-center gap-3 px-4 lg:px-6">

          {/* Menu mobile */}
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center text-paper-muted hover:text-paper transition-colors"
            onClick={() => setSidebarOpen(s => !s)}
          >
            {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-xs font-body">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={11} className="text-paper-muted/40" />}
                <span className={i === crumbs.length - 1 ? 'text-paper' : 'text-paper-muted'}>
                  {c}
                </span>
              </span>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Realtime */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400/80 text-[11px] font-body">Ao vivo</span>
          </div>

          {/* Data */}
          <span className="hidden md:block text-paper-muted/60 text-[11px] font-mono">
            {new Date().toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>

          {/* Separador */}
          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Notificações */}
          <button className="relative w-8 h-8 flex items-center justify-center text-paper-muted hover:text-paper transition-colors">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full ring-2 ring-off-black-2" />
          </button>
        </header>

        {/* ── Conteúdo: mobile scrolls naturalmente, desktop cada página gere o próprio scroll ── */}
        <main className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
          <div className="min-h-full lg:h-full">
            <PageComponent />
          </div>
        </main>

      </div>
    </div>
  )
}
