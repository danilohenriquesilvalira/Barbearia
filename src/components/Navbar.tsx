import { useState, useEffect } from 'react'
import { Menu, X, User, LogIn, LayoutDashboard } from 'lucide-react'
import BarberPole from './BarberPole'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  onBookClick:      () => void
  onLoginClick:     () => void
  onDashboardClick: () => void
  onAdminClick?:    () => void
}

export default function Navbar({ onBookClick, onLoginClick, onDashboardClick, onAdminClick }: NavbarProps) {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const { t } = useLanguage()
  const { user } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Colapsa hamburger ao chegar no breakpoint lg (1024px)
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMenuOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Bloqueia scroll do body com menu aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const NAV_LINKS = [
    { label: t('nav.services'), href: '#servicos' },
    { label: t('nav.barbers'),  href: '#barbeiros' },
    { label: t('nav.schedule'), href: '#agendar' },
    { label: t('nav.contact'),  href: '#contacto' },
  ]

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <BarberPole orientation="horizontal" height="4px" />

      <nav className={`transition-all duration-300 ${scrolled ? 'bg-off-black/98 shadow-2xl' : 'bg-off-black/95'} backdrop-blur-md border-b border-paper/5`}>

        {/* ── Barra principal ── */}
        <div className="max-w-7xl 2xl:max-w-[1700px] mx-auto px-4 min-[400px]:px-5 lg:px-8 2xl:px-12 flex items-center h-14 min-[400px]:h-16 lg:h-[68px]">

          {/* ── Logo ── */}
          <a href="#" className="flex items-center gap-2 min-[400px]:gap-2.5 flex-shrink-0">
            <span className="font-graffiti text-lg min-[400px]:text-lg lg:text-xl text-gold leading-none whitespace-nowrap">
              Connect
            </span>
            <span className="hidden min-[400px]:block h-4 w-px bg-gold/30 flex-shrink-0" />
            <span className="hidden min-[400px]:block font-mono text-[8px] tracking-[0.25em] uppercase text-paper-muted leading-none flex-shrink-0">
              Barber
            </span>
          </a>

          {/* ── Links desktop — visíveis apenas em lg+ ── */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-7 xl:gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-display text-[14px] xl:text-[15px] text-paper-muted hover:text-gold transition-colors tracking-wide whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Direita desktop: Lang + Auth + CTA (lg+) ── */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0 ml-auto">
            <LanguageSwitcher />

            <div className="w-px h-4 bg-paper/10" />

            {user ? (
              <div className="flex items-center gap-2">
                {onAdminClick && (
                  <button
                    onClick={onAdminClick}
                    title="Painel Admin"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 border border-barber-red/40 text-barber-red hover:bg-barber-red/10 transition-colors font-body text-xs whitespace-nowrap"
                  >
                    <LayoutDashboard size={13} />
                    <span className="hidden xl:inline">Admin</span>
                  </button>
                )}
                <button
                  onClick={onDashboardClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/40 text-gold hover:bg-gold/10 transition-colors font-body text-xs whitespace-nowrap"
                >
                  <User size={13} />
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-paper/10 text-paper-muted hover:border-gold/40 hover:text-gold transition-colors font-body text-xs whitespace-nowrap"
              >
                <LogIn size={13} />
                {t('nav.login')}
              </button>
            )}

            <button
              onClick={onBookClick}
              className="px-5 py-2 border-2 border-gold text-gold font-body font-semibold text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-off-black transition-all duration-300 whitespace-nowrap"
            >
              {t('nav.book')}
            </button>
          </div>

          {/* ── Mobile/tablet direita: Lang + Hamburger (abaixo de lg) ── */}
          <div className="flex lg:hidden items-center gap-2 ml-auto flex-shrink-0">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 border border-paper/10 text-paper-muted hover:border-gold/50 hover:text-gold transition-colors flex-shrink-0"
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Drawer mobile/tablet ── */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-[calc(56px+4px)] min-[400px]:top-[calc(64px+4px)] bg-off-black/60 z-[-1]"
              onClick={closeMenu}
            />
            <div className="lg:hidden border-t border-paper/5 bg-off-black animate-slide-up max-h-[calc(100svh-68px)] overflow-y-auto">
              <div className="px-4 py-1 flex flex-col max-w-lg mx-auto">

                {/* Nav links */}
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="py-4 px-2 font-display text-lg min-[400px]:text-xl text-paper-muted hover:text-gold transition-colors border-b border-paper/5 last:border-0 active:text-gold"
                  >
                    {link.label}
                  </a>
                ))}

                {/* Auth + CTA */}
                <div className="flex gap-2 py-4">
                  {user ? (
                    <button
                      onClick={() => { closeMenu(); onDashboardClick() }}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-gold/40 text-gold font-body font-semibold text-sm tracking-wide"
                    >
                      <User size={15} />
                      {t('nav.myAccount')}
                    </button>
                  ) : (
                    <button
                      onClick={() => { closeMenu(); onLoginClick() }}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-paper/10 text-paper-muted font-body text-sm hover:border-gold/40 hover:text-gold transition-colors"
                    >
                      <LogIn size={15} />
                      {t('nav.login')}
                    </button>
                  )}
                  <button
                    onClick={() => { closeMenu(); onBookClick() }}
                    className="flex-1 py-3.5 border-2 border-gold bg-gold text-off-black font-body font-bold text-sm tracking-widest uppercase hover:bg-gold-light transition-colors"
                  >
                    {t('nav.book')}
                  </button>
                </div>

              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
