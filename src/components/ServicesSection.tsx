import { Check } from 'lucide-react'
import type { Service } from '../types'
import { SERVICES } from '../data/mockData'
import { useLanguage } from '../context/LanguageContext'
import { asset } from '../lib/asset'

/* ═══════════════════════════════════════════════════════════════════════════
   High-quality mood shots for each service
   ═══════════════════════════════════════════════════════════════════════════ */
const SERVICE_IMAGES: Record<string, string> = {
  's1': asset('/corte_classico.jpg'),
  's2': asset('/Imagem_Corte.svg'),
  's3': asset('/Imagem_Barba.svg'),
  's4': asset('/Corte_Premiun.png'),
  's5': asset('/tratamento_couro_cabeludo.jpg'),
  's6': asset('/pacote_noivo.jpeg'),
}

/* ── Pequenos SVGs Ouro ───────────────────────────────────────── */
function IconClockSmall({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconTagSmall({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Service Card — Imagens na Esquerda com Mistério & Etiqueta de Metal
   ═══════════════════════════════════════════════════════════════════════════ */
function ServiceCard({
  service,
  onSelect,
  isSelected,
}: {
  service: Service
  onSelect: (s: Service) => void
  isSelected: boolean
}) {
  const { t, tr } = useLanguage()
  // Usa fallback se o ID não corresponder perfeitamente
  const imageUrl = SERVICE_IMAGES[service.id] || SERVICE_IMAGES['s1']
  const itemTr = tr.services.items[service.id as keyof typeof tr.services.items]
  const name = itemTr?.name ?? service.name
  const desc = itemTr?.description ?? ''

  return (
    <button
      onClick={() => onSelect(service)}
      className="group relative w-full text-left overflow-hidden flex flex-col sm:flex-row min-h-[220px] transition-transform duration-500 ease-out focus:outline-none"
    >
      {/* ── Borda externa industrial & Fundo escuro ── */}
      <div className={`
        absolute inset-0 border-2 transition-colors duration-500 rounded-sm
        ${isSelected ? 'border-[#C5A059]' : 'border-[#1E1E1E] group-hover:border-[#C5A059]/40'}
      `} />

      <div className="absolute inset-0 bg-[#0A0A0A] pointer-events-none" />

      {/* ── Acento gold no topo ── */}
      <div className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-500 pointer-events-none
        bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent
        ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}
      `} />

      {/* ── Imagem de Fundo (Esquerda) com Mistério ── */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-full sm:w-[50%] bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03] opacity-60 sm:opacity-90 grayscale-[20%] contrast-125"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />

      {/* ── Overlay Escuro Gradient (O mistério) ── */}
      {/* No mobile, gradient de cima pra baixo. No desktop, da esquerda pra direita */}
      <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#0A0A0A]/20 via-[#0A0A0A]/90 to-[#0A0A0A] sm:via-[#0A0A0A]/95 sm:to-[#0A0A0A] pointer-events-none" />

      {/* ── Textura de metal / couro no topo (noise overlay) ── */}
      <div className="absolute inset-0 noise-bg opacity-[0.25] pointer-events-none" />

      {/* ── Borda Interna Sutil (Industrial) ── */}
      <div className={`absolute inset-1.5 sm:inset-2.5 border pointer-events-none rounded-[1px] transition-colors duration-500
        ${isSelected ? 'border-[#C5A059]/12' : 'border-white/[0.03] group-hover:border-[#C5A059]/8'}
      `} />

      {/* ── Container Invisível para Espaçamento (Imagem) ── */}
      <div className="hidden sm:block w-[35%] shrink-0 pointer-events-none" />

      {/* ── Conteúdo (Direita) ── */}
      <div className="relative z-10 w-full sm:w-[65%] flex flex-col justify-center p-6 sm:p-8 mt-24 sm:mt-0">
        
        {/* Ícone de Duração Ouro */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <IconClockSmall />
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#C5A059] uppercase">
            {service.duration} min
          </span>
        </div>

        {/* Título */}
        <h3 className={`
          font-hero text-3xl sm:text-4xl leading-[0.9] uppercase tracking-wide mb-3
          transition-colors duration-300
          ${isSelected ? 'text-[#C5A059]' : 'text-paper group-hover:text-[#C5A059]'}
        `}>
          {name}
        </h3>

        {/* Separador gold */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`h-px w-8 transition-colors duration-300 ${isSelected ? 'bg-[#C5A059]/60' : 'bg-[#C5A059]/25 group-hover:bg-[#C5A059]/45'}`} />
          <span className={`w-1 h-1 rotate-45 flex-shrink-0 transition-colors duration-300 ${isSelected ? 'bg-[#C5A059]/70' : 'bg-[#C5A059]/25 group-hover:bg-[#C5A059]/50'}`} />
          <div className={`h-px flex-1 transition-colors duration-300 ${isSelected ? 'bg-[#C5A059]/20' : 'bg-white/5 group-hover:bg-[#C5A059]/15'}`} />
        </div>

        {/* Descrição */}
        <p className="font-body text-[13px] sm:text-sm text-paper-muted/75 font-light leading-relaxed mb-6 sm:mb-8 pr-2">
          {desc}
        </p>

        {/* ── Row: Preço (Metal Tag) + Botão ── */}
        <div className="flex items-end justify-between mt-auto">
          
          {/* Tag de Metal (Industrial) para o Preço */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#C5A059]/50 mb-0.5">
              <IconTagSmall size={10} />
              <span className="font-mono text-[8px] tracking-[0.25em] pb-px">VALOR</span>
            </div>
            <div className="bg-[#141414] border-t border-l border-white/10 border-b border-r border-black px-3.5 py-1.5 shadow-[inset_1px_1px_4px_rgba(0,0,0,0.5)]">
              <span className={`
                font-mono text-2xl sm:text-[28px] font-bold tracking-tight
                ${isSelected ? 'text-[#C5A059]' : 'text-paper'}
                transition-colors duration-300
              `}>
                {service.price}
                <span className="text-[13px] ml-0.5 text-[#C5A059]/70">€</span>
              </span>
            </div>
          </div>

          {/* Botão Selecionar */}
          <div className={`
            flex items-center gap-2 px-5 py-2.5 outline outline-1 outline-offset-2 transition-all duration-300
            ${isSelected
              ? 'bg-[#C5A059] text-off-black outline-[#C5A059]'
              : 'bg-transparent text-[#C5A059] outline-[#C5A059]/30 group-hover:outline-[#C5A059] group-hover:bg-[#C5A059]/10'
            }
          `}>
            {isSelected && <Check size={14} strokeWidth={2.5} />}
            <span className="font-hero text-sm sm:text-base tracking-[0.15em] uppercase mt-0.5">
              {isSelected ? t('services.selected') : t('services.select')}
            </span>
            {!isSelected && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="14 7 19 12 14 17" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   Services Section (Container)
   ═══════════════════════════════════════════════════════════════════════════ */
interface ServicesSectionProps {
  onServiceSelect: (service: Service) => void
  selectedServiceId?: string | null
}

export default function ServicesSection({ onServiceSelect, selectedServiceId }: ServicesSectionProps) {
  const { t } = useLanguage()

  return (
    <section id="servicos" className="relative py-20 sm:py-28 px-4 sm:px-6 bg-[#050505]">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="font-mono text-[11px] tracking-[0.6em] uppercase text-[#C5A059]/60 mb-5">
            {t('services.sectionTag')}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-paper mb-5">
            {t('services.title')}
          </h2>
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto mt-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/50 to-gold" />
            <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-gold uppercase whitespace-nowrap">
              Todos os preços incluem IVA
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/50 to-gold" />
          </div>
        </div>

        {/* ── Grid — Imponente, 1 coluna no mobile, 2 no Desktop grande ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={onServiceSelect}
              isSelected={selectedServiceId === service.id}
            />
          ))}
        </div>


      </div>
    </section>
  )
}
