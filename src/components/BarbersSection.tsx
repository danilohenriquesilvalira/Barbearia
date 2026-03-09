import { Star, Scissors, CheckCircle, XCircle } from 'lucide-react'
import type { Barber } from '../types'
import { BARBERS } from '../data/mockData'
import { useLanguage } from '../context/LanguageContext'
import { asset } from '../lib/asset'

function BarberCard({
  barber,
  onSelect,
  isSelected,
}: {
  barber:     Barber
  onSelect:   (b: Barber) => void
  isSelected: boolean
}) {
  const { t } = useLanguage()

  return (
    <button
      onClick={() => barber.available && onSelect(barber)}
      disabled={!barber.available}
      className={`
        group relative w-full text-left transition-all duration-300
        ${!barber.available ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Foto quadrada */}
      <div
        className={`
          relative overflow-hidden border-2 transition-all duration-300 mb-0
          ${isSelected
            ? 'border-gold shadow-gold-lg'
            : barber.available
              ? 'border-paper/20 group-hover:border-gold/70'
              : 'border-paper/10'
          }
        `}
        style={{ paddingBottom: '100%' }}
      >
        <img
          src={barber.photo}
          alt={barber.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
          style={{
            filter: !barber.available
              ? 'grayscale(100%)'
              : isSelected
                ? 'grayscale(0%)'
                : 'grayscale(100%) contrast(1.1)',
          }}
          onMouseEnter={e => {
            if (barber.available && !isSelected) {
              (e.target as HTMLImageElement).style.filter = 'grayscale(0%) contrast(1)'
            }
          }}
          onMouseLeave={e => {
            if (barber.available && !isSelected) {
              (e.target as HTMLImageElement).style.filter = 'grayscale(100%) contrast(1.1)'
            }
          }}
        />

        {/* Overlay sutil no hover */}
        <div className="absolute inset-0 bg-off-black/0 group-hover:bg-off-black/10 transition-all duration-300 pointer-events-none" />

        {/* Badge disponibilidade — canto superior */}
        <div className={`
          absolute top-2 right-2 flex items-center gap-1 px-2 py-1
          font-mono text-[9px] tracking-widest uppercase backdrop-blur-sm
          ${barber.available
            ? 'bg-off-black/80 text-gold border border-gold/40'
            : 'bg-off-black/80 text-paper-muted border border-paper/10'
          }
        `}>
          {barber.available
            ? <><CheckCircle size={9} className="text-gold" /> {t('barbers.available')}</>
            : <><XCircle size={9} /> {t('barbers.occupied')}</>
          }
        </div>

        {/* Selecionado */}
        {isSelected && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-gold text-off-black font-mono text-[9px] tracking-widest uppercase font-bold">
            <CheckCircle size={9} /> {t('barbers.chosen')}
          </div>
        )}
      </div>

      {/* Info com fundo escuro — legível sobre o bg da secção */}
      <div className="bg-[#0A0A0A]/90 backdrop-blur-sm px-2 pb-2 pt-0">

      {/* Separador gold — padrão do projeto */}
      <div className="flex items-center gap-2 mb-3 pt-2">
        <div className="h-px flex-1 bg-gold/30" />
        <span className="w-1 h-1 bg-gold/50 rotate-45 flex-shrink-0" />
        <div className="h-px flex-1 bg-gold/30" />
      </div>

      {/* Info do barbeiro */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-paper/5">
          <h3 className="font-display text-sm sm:text-base text-paper font-semibold leading-tight">
            {barber.name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            <Star size={10} className="text-gold fill-gold" />
            <span className="font-mono text-[11px] text-gold">{barber.rating}</span>
          </div>
        </div>

        <p className="font-mono text-[10px] text-gold/80 tracking-widest uppercase">{barber.role}</p>

        <div className="flex flex-wrap gap-1">
          {barber.specialties.map((sp) => (
            <span key={sp} className="px-1.5 py-0.5 border border-gold/20 text-paper-muted font-body text-[10px] leading-tight">
              {sp}
            </span>
          ))}
        </div>

        <p className="font-mono text-[10px] text-paper-muted pt-0.5">
          <Scissors size={9} className="inline mr-1 text-gold/50" />
          {barber.totalCuts.toLocaleString('pt-PT')} {t('barbers.cuts')}
        </p>
      </div>
      </div>{/* fim wrapper escuro */}
    </button>
  )
}

interface BarbersSectionProps {
  onBarberSelect:    (barber: Barber) => void
  selectedBarberId?: string | null
}

export default function BarbersSection({ onBarberSelect, selectedBarberId }: BarbersSectionProps) {
  const { t } = useLanguage()

  return (
    <section id="barbeiros" className="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      {/* Fundo dessaturado — evita conflito de cor com o dourado */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url('${asset('/fundo_page_1.jpg')}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        filter: 'grayscale(1)',
      }} />
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-off-black/82 via-off-black/68 to-off-black/85" />
      {/* Transição suave do topo — dissolve o preto da secção anterior */}
      <div className="absolute top-0 left-0 right-0 h-40 sm:h-56 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="relative z-20 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="font-mono text-[11px] tracking-[0.6em] uppercase text-gold/60 mb-5">
            {t('barbers.sectionTag')}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-paper mb-8">
            {t('barbers.title')}
          </h2>
          <div className="flex items-center justify-center gap-4 max-w-xl mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/50 to-gold" />
            <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-gold uppercase whitespace-nowrap px-2">
              {t('barbers.subtitle')}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/50 to-gold" />
          </div>
        </div>

        {/* Grid — 2 cols mobile, 4 desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {BARBERS.map((barber) => (
            <BarberCard
              key={barber.id}
              barber={barber}
              onSelect={onBarberSelect}
              isSelected={selectedBarberId === barber.id}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
