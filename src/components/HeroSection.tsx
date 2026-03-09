import { useLanguage } from '../context/LanguageContext'
import { asset } from '../lib/asset'

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
            backgroundImage: `url('${asset('/Imagem_Hero.svg')}')`,
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
      <div className="relative z-10 flex flex-col items-center flex-1 px-6 sm:px-8 text-center pt-32 sm:pt-40 pb-14 sm:pb-16">
        {/* ── Título — centrado no espaço disponível ── */}
        <div className="flex-1 flex items-center justify-center">
        <h1 className="font-graffiti leading-[0.9] tracking-normal flex flex-col items-center drop-shadow-2xl">
          <span className="block text-paper text-[70px] sm:text-[110px] md:text-[140px] lg:text-[170px] -mb-2 sm:-mb-6 rotate-[-2deg]">
            CONNECT
          </span>
          <span className="block text-[65px] sm:text-[100px] md:text-[120px] lg:text-[150px] text-gold rotate-[1deg] ml-4">
            BARBER
          </span>
        </h1>
        </div>

        {/* Botões — ancorados ao fundo */}
        <div className="flex flex-row items-center gap-4 sm:gap-5 mt-auto pb-2">
          <button
            onClick={onBookClick}
            className="
              px-8 sm:px-12 py-3.5 sm:py-4 bg-gold text-off-black
              font-hero text-base sm:text-lg tracking-[0.15em] uppercase
              hover:bg-gold-light hover:scale-[1.02] transition-all duration-300
              min-w-[140px] sm:min-w-[240px]
            "
          >
            {t('hero.cta')}
          </button>
          <button
            onClick={scrollToContact}
            className="
              px-8 sm:px-12 py-3.5 sm:py-4 border border-paper/20 text-paper/80
              font-hero text-base sm:text-lg tracking-[0.15em] uppercase
              hover:border-gold hover:text-gold transition-all duration-300
              min-w-[140px] sm:min-w-[240px]
            "
          >
            {t('nav.contact')}
          </button>
        </div>
      </div>


    </section>
  )
}
