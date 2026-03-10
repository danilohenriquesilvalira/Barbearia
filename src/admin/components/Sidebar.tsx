import {
  LayoutDashboard, Users, Scissors, CalendarDays,
  LogOut, ChevronRight, Zap, Wifi,
} from 'lucide-react'

export type AdminPage = 'dashboard' | 'barbers' | 'clients' | 'appointments'

const NAV_ITEMS: { id: AdminPage; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'dashboard',    label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'barbers',      label: 'Barbeiros',  icon: Scissors        },
  { id: 'clients',      label: 'Clientes',   icon: Users           },
  { id: 'appointments', label: 'Marcações',  icon: CalendarDays, badge: '15' },
]

interface SidebarProps {
  active: AdminPage
  onNavigate: (page: AdminPage) => void
  onExit: () => void
  adminName: string
}

export default function Sidebar({ active, onNavigate, onExit, adminName }: SidebarProps) {
  return (
    <aside className="relative w-64 h-full bg-[#0A0A0A] border-r border-white/[0.06] flex flex-col overflow-hidden select-none">

      {/* Barber pole strip — borda esquerda decorativa */}
      <div
        className="absolute left-0 top-0 w-[3px] h-full animate-stripe"
        style={{
          backgroundImage: `repeating-linear-gradient(
            180deg,
            #C1121F 0px, #C1121F 8px,
            #F8F9FA 8px, #F8F9FA 16px,
            #023E8A 16px, #023E8A 24px,
            #F8F9FA 24px, #F8F9FA 32px
          )`,
          backgroundSize: '3px 32px',
        }}
      />

      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div className="pl-8 pr-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          {/* Ícone em quadrado dourado */}
          <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold/20">
            <Scissors size={16} className="text-off-black" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-paper text-[15px] leading-none tracking-wide">
              Connect <span className="text-gold">Barber</span>
            </p>
            <p className="text-paper-muted/50 text-[10px] font-mono tracking-[0.2em] uppercase mt-1">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* ── Navegação ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto pl-6 pr-3 py-5 space-y-0.5">
        <p className="text-paper-muted/30 text-[9px] font-mono tracking-[0.2em] uppercase px-3 mb-3">
          Menu
        </p>

        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-[13px]
                font-body transition-all duration-150 group relative
                ${isActive
                  ? 'bg-gold/10 text-gold border-l-[2px] border-gold'
                  : 'text-paper-muted hover:text-paper hover:bg-white/[0.04] border-l-[2px] border-transparent'
                }
              `}
            >
              <Icon
                size={15}
                className={`flex-shrink-0 transition-colors ${isActive ? 'text-gold' : 'text-paper-muted/60 group-hover:text-paper-muted'}`}
              />
              <span className="flex-1 text-left font-body">{item.label}</span>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-gold/20 text-gold' : 'bg-white/[0.07] text-paper-muted'
                }`}>
                  {item.badge}
                </span>
              )}

              {isActive && (
                <ChevronRight size={11} className="text-gold/60 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Realtime status ───────────────────────────────────────────────── */}
      <div className="pl-8 pr-5 pb-4">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-green-500/[0.06] border border-green-500/[0.12]">
          <div className="relative flex-shrink-0">
            <Wifi size={13} className="text-green-400" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-green-400 text-[11px] font-body leading-none">Realtime ativo</p>
            <p className="text-green-400/40 text-[9px] font-mono mt-0.5 truncate">Supabase conectado</p>
          </div>
        </div>
      </div>

      {/* ── Divisor ───────────────────────────────────────────────────────── */}
      <div className="h-px bg-white/[0.06] mx-5" />

      {/* ── Utilizador + Sair ─────────────────────────────────────────────── */}
      <div className="pl-8 pr-5 py-4 space-y-1">
        {/* Avatar + nome */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold/40 to-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <Zap size={11} className="text-gold" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-paper text-[12px] font-body leading-none truncate">{adminName}</p>
            <p className="text-paper-muted/40 text-[9px] font-mono mt-0.5">Administrador</p>
          </div>
        </div>

        {/* Voltar */}
        <button
          onClick={onExit}
          className="
            w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-body
            text-paper-muted/50 hover:text-red-400 hover:bg-red-500/[0.06]
            transition-all duration-150 group
          "
        >
          <LogOut size={13} className="flex-shrink-0 group-hover:text-red-400 transition-colors" />
          <span>Voltar ao Site</span>
        </button>
      </div>
    </aside>
  )
}
