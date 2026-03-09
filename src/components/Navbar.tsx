import { useState, useEffect } from 'react'
import { Menu, X, User, LogIn } from 'lucide-react'
import BarberPole from './BarberPole'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  onBookClick:      () => void
  onLoginClick:     () => void
  onDashboardClick: () => void
}

export default function Navbar({ onBookClick, onLoginClick, onDashboardClick }: NavbarProps) {
  const [menuOpen, setMenuOpen]   = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const { t } = useLanguage()
  const { user } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Fecha o menu ao redimensionar para desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

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
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center h-16 md:h-[68px]">

          {/* ── Logo — esquerda ── */}
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <span className="font-graffiti text-2xl sm:text-3xl text-gold leading-none">Connect</span>
            <span className="h-4 w-px bg-gold/30" />
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-paper-muted leading-none">
              Barber
            </span>
          </a>

          {/* ── Links desktop — centro real ── */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-display text-[15px] text-paper-muted hover:text-gold transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── Direita desktop: Lang + Auth + CTA ── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher />

            <div className="w-px h-4 bg-paper/10" />

            {user ? (
              <button
                onClick={onDashboardClick}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/40 text-gold hover:bg-gold/10 transition-colors font-body text-xs"
              >
                <User size={13} />
                <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-paper/10 text-paper-muted hover:border-gold/40 hover:text-gold transition-colors font-body text-xs"
              >
                <LogIn size={13} />
                {t('nav.login')}
              </button>
            )}

            <button
              onClick={onBookClick}
              className="px-5 py-2 border-2 border-gold text-gold font-body font-semibold text-xs tracking-[0.15em] uppercase hover:bg-gold hover:text-off-black transition-all duration-300"
            >
              {t('nav.book')}
            </button>
          </div>

          {/* ── Mobile direita: Lang + Hamburger ── */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 border border-paper/10 text-paper-muted hover:border-gold/50 hover:text-gold transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Menu mobile — drawer */}
        {menuOpen && (
          <>
            {/* Backdrop toque para fechar */}
            <div
              className="fixed inset-0 top-[72px] bg-off-black/50 z-[-1]"
              onClick={closeMenu}
            />
            <div className="md:hidden border-t border-paper/5 bg-off-black animate-slide-up">
              <div className="px-4 py-2 flex flex-col">
                {/* Nav links */}
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="py-3.5 px-2 font-display text-xl text-paper-muted hover:text-gold transition-colors border-b border-paper/5 last:border-0"
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
