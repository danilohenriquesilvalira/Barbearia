import { useLanguage } from '../context/LanguageContext'

/* ── SVG Icons minimalistas (ULTRA-FINOS) ────────────────────────────────── */
function IconMapPin({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    </svg>
  )
}

function IconPhone({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconClock({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="11" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */

interface HeroSectionProps {
  onBookClick: () => void
}

export default function HeroSection({ onBookClick }: HeroSectionProps) {
  const { t } = useLanguage()

  const scrollToContact = () => {
    const el = document.getElementById('contacto') || document.querySelector('footer')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-black">
      {/* ── Background image + dark overlay ── */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/Imagem_Hero.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Overlay dramático escuro com Noise e Mistério */}
        <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
        <div className="absolute inset-0 noise-bg opacity-30 mix-blend-overlay pointer-events-none" />
        
        {/* Degradê Profundo de Transição (Mescla a foto no fundo sólido dos Serviços "#050505") */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />
      </div>

      {/* ── Content Principal ── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 sm:px-8 text-center pt-32 sm:pt-40 pb-16 sm:pb-20">
        {/* ── Título (Graffiti/Brush) - Mais solto, embaralhado, pichação ── */}
        <h1 className="font-graffiti leading-[0.9] tracking-normal mb-6 flex flex-col items-center drop-shadow-2xl">
          <span className="block text-paper text-[70px] sm:text-[110px] md:text-[140px] lg:text-[170px] -mb-2 sm:-mb-6 rotate-[-2deg]">
            CONNECT
          </span>
          <span className="block text-[65px] sm:text-[100px] md:text-[120px] lg:text-[150px] text-gold rotate-[1deg] ml-4">
            BARBER
          </span>
        </h1>



        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <button
            onClick={onBookClick}
            className="
              px-12 py-4 bg-gold text-off-black
              font-hero text-lg tracking-[0.15em] uppercase
              hover:bg-gold-light hover:scale-[1.02] transition-all duration-300
              min-w-[240px]
            "
          >
            {t('hero.cta')}
          </button>
          <button
            onClick={scrollToContact}
            className="
              px-12 py-4 border border-paper/20 text-paper/80
              font-hero text-lg tracking-[0.15em] uppercase
              hover:border-gold hover:text-gold transition-all duration-300
              min-w-[240px]
            "
          >
            {t('nav.contact')}
          </button>
        </div>
      </div>

      {/* ── INFO BAR ── */}
      <div className="relative w-full z-30 px-4 sm:px-8 mt-auto pb-8 sm:pb-10 sm:-mb-6">
        <div className="max-w-5xl mx-auto relative backdrop-blur-md bg-black/50 border-l-2 border-r-2 border-gold/50 shadow-2xl overflow-hidden">

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

          {/* Sempre 3 colunas — compacto mobile, elaborado desktop */}
          <div className="grid grid-cols-3">

            {[
              { icon: <IconMapPin size={16} className="text-gold sm:hidden" />, iconLg: <IconMapPin size={22} className="text-gold hidden sm:block" />, label: 'Morada',   value: t('hero.address') },
              { icon: <IconPhone  size={16} className="text-gold sm:hidden" />, iconLg: <IconPhone  size={22} className="text-gold hidden sm:block" />, label: 'Telefone', value: '+351 21 123 45 67' },
              { icon: <IconClock  size={16} className="text-gold sm:hidden" />, iconLg: <IconClock  size={22} className="text-gold hidden sm:block" />, label: 'Horário',   value: t('hero.hours') },
            ].map(({ icon, iconLg, label, value }, i, arr) => (
              <div key={label} className="group relative flex flex-col items-center justify-center text-center py-4 sm:py-7 px-2 sm:px-6 hover:bg-gold/[0.04] transition-colors duration-300">

                {/* Ícone */}
                <div className="w-8 h-8 sm:w-11 sm:h-11 border border-gold/30 bg-gold/5 flex items-center justify-center mb-2 sm:mb-4 group-hover:border-gold/60 group-hover:bg-gold/10 transition-all duration-300">
                  {icon}{iconLg}
                </div>

                {/* Label — oculta no mobile */}
                <p className="hidden sm:block font-mono text-[9px] tracking-[0.45em] uppercase text-gold/70 mb-2">{label}</p>
                <div className="hidden sm:block h-px w-6 bg-gold/30 mx-auto mb-2.5" />

                {/* Valor */}
                <p className="font-body text-[10px] sm:text-sm text-paper/90 font-light leading-tight sm:leading-relaxed">{value}</p>

                {/* Divisor vertical entre células */}
                {i < arr.length - 1 && (
                  <div className="absolute right-0 top-3 bottom-3 flex flex-col items-center justify-center gap-1 pointer-events-none">
                    <div className="w-px flex-1 bg-white/5" />
                    <span className="w-1 h-1 bg-gold/25 rotate-45 flex-shrink-0" />
                    <div className="w-px flex-1 bg-white/5" />
                  </div>
                )}
              </div>
            ))}

          </div>
        </div>
      </div>

    </section>
  )
}
