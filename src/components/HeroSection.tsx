import { useLanguage } from '../context/LanguageContext'
import { asset } from '../lib/asset'

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
    <section className="relative flex flex-col overflow-hidden bg-black" style={{ minHeight: '100svh' }}>
      {/* ── Background image + dark overlay ── */}
      <div className="absolute inset-0 z-0">
        {/* <img> com fetchPriority="high" — browser prioriza no LCP */}
        <img
          src={asset('/Imagem_Hero.svg')}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay dramático escuro com Noise e Mistério */}
        <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
        <div className="absolute inset-0 noise-bg opacity-30 mix-blend-overlay pointer-events-none" />

        {/* Degradê Profundo de Transição */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />
      </div>

      {/* ── Texto decorativo ghost — laterais (xl+) ── */}
      <div className="absolute inset-0 z-[5] hidden xl:flex items-center pointer-events-none overflow-hidden">
        <span
          className="absolute left-0 font-hero leading-none select-none whitespace-nowrap"
          style={{
            fontSize: 'clamp(80px, 10vw, 180px)',
            WebkitTextStroke: '1px rgba(245,245,247,0.04)',
            color: 'transparent',
            transform: 'translateX(-18%) rotate(-90deg)',
            transformOrigin: 'left center',
          }}
        >
          TRADITION
        </span>
        <span
          className="absolute right-0 font-hero leading-none select-none whitespace-nowrap"
          style={{
            fontSize: 'clamp(80px, 10vw, 180px)',
            WebkitTextStroke: '1px rgba(201,168,76,0.05)',
            color: 'transparent',
            transform: 'translateX(18%) rotate(90deg)',
            transformOrigin: 'right center',
          }}
        >
          EST. 2024
        </span>
      </div>

      {/* ── Content Principal ── */}
      <div className="relative z-10 flex flex-col items-center flex-1 px-6 sm:px-8 text-center"
           style={{ paddingTop: 'max(96px, 18svh)', paddingBottom: 'max(48px, 12svh)' }}>

        {/* ── Título centrado no espaço disponível ── */}
        <div className="flex-1 flex items-center justify-center w-full">
        <h1 className="font-graffiti leading-[0.9] tracking-normal flex flex-col items-center drop-shadow-2xl">
          <span className="block text-paper text-[45px] sm:text-[52px] md:text-[70px] lg:text-[87px] xl:text-[105px] 2xl:text-[130px] 3xl:text-[155px] -mb-2 sm:-mb-6 rotate-[-2deg]">
            CONNECT
          </span>
          <span className="block text-[42px] sm:text-[48px] md:text-[62px] lg:text-[75px] xl:text-[95px] 2xl:text-[120px] 3xl:text-[145px] text-gold rotate-[1deg] ml-4">
            BARBER
          </span>
        </h1>
        </div>

        {/* Botões — sempre visíveis no fundo */}
        <div className="flex flex-row items-center gap-4 sm:gap-5 mt-auto pt-8">
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
