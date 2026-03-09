// ─── Ícones SVG temáticos de barbearia ────────────────────────────────────────
// Todos com strokeWidth fino, estilo linha limpa

interface IconProps {
  size?: number
  className?: string
  strokeWidth?: number
}

/** Tesoura clássica — para CORTE */
export function IconScissors({ size = 16, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <circle cx="5.5" cy="7.5" r="2.5"/>
      <circle cx="5.5" cy="16.5" r="2.5"/>
      <line x1="7.8" y1="9.1" x2="19" y2="4"/>
      <line x1="7.8" y1="14.9" x2="19" y2="20"/>
      <line x1="19" y1="4" x2="19" y2="20"/>
    </svg>
  )
}

/** Navalha de barbeiro — para BARBA */
export function IconRazor({ size = 16, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      {/* Cabo */}
      <path d="M3 12 L8 7 L9 8 L4 13 Z" fill="currentColor" stroke="none" opacity="0.7"/>
      {/* Lâmina */}
      <path d="M9 8 L20 6 L21 8 L9 9 Z"/>
      {/* Fio da lâmina */}
      <line x1="9" y1="8.5" x2="20" y2="7"/>
      {/* Guardas */}
      <line x1="18" y1="6.2" x2="19.5" y2="9"/>
      <line x1="20" y1="6" x2="21.5" y2="8.5"/>
    </svg>
  )
}

/** Máquina de cortar + tesoura — para COMBO */
export function IconClipper({ size = 16, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      {/* Corpo da máquina */}
      <rect x="3" y="6" width="14" height="12" rx="3"/>
      {/* Pente/dentes */}
      <line x1="5" y1="18" x2="5" y2="21"/>
      <line x1="8" y1="18" x2="8" y2="21"/>
      <line x1="11" y1="18" x2="11" y2="21"/>
      <line x1="14" y1="18" x2="14" y2="21"/>
      {/* Botão de poder */}
      <circle cx="16.5" cy="9" r="1" fill="currentColor" opacity="0.8"/>
      {/* Tesoura mini */}
      <circle cx="20" cy="7" r="1.2"/>
      <circle cx="20" cy="11" r="1.2"/>
      <line x1="21" y1="8" x2="23" y2="5"/>
      <line x1="21" y1="10" x2="23" y2="13"/>
    </svg>
  )
}

/** Folha / gota — para TRATAMENTO */
export function IconTreatment({ size = 16, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      {/* Folha principal */}
      <path d="M12 21 C7 21 3 17 3 12 C3 7 8 3 12 3 C16 3 21 7 21 12 C21 17 17 21 12 21 Z"/>
      {/* Nervura central */}
      <line x1="12" y1="5" x2="12" y2="19"/>
      {/* Nervuras laterais */}
      <path d="M12 9 Q15 11 18 10"/>
      <path d="M12 13 Q9 15 6 14"/>
    </svg>
  )
}

/** Pente de barbearia — decorativo */
export function IconComb({ size = 16, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <rect x="2" y="8" width="20" height="5" rx="1"/>
      <line x1="5" y1="13" x2="5" y2="18"/>
      <line x1="8" y1="13" x2="8" y2="18"/>
      <line x1="11" y1="13" x2="11" y2="18"/>
      <line x1="14" y1="13" x2="14" y2="18"/>
      <line x1="17" y1="13" x2="17" y2="18"/>
      <line x1="20" y1="13" x2="20" y2="18"/>
    </svg>
  )
}

/** Relógio de bolso vintage — para duração */
export function IconPocketWatch({ size = 14, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      {/* Anel da corrente */}
      <path d="M10.5 5 Q12 3 13.5 5"/>
      {/* Corona */}
      <rect x="10" y="5" width="4" height="2.5" rx="0.5"/>
      {/* Caixa do relógio */}
      <circle cx="12" cy="14" r="7.5"/>
      {/* Mostrador interno */}
      <circle cx="12" cy="14" r="6" opacity="0.2" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
      {/* Marcas de hora */}
      <line x1="12" y1="8.5" x2="12" y2="9.5"/>
      <line x1="12" y1="18.5" x2="12" y2="19.5"/>
      <line x1="6.5" y1="14" x2="7.5" y2="14"/>
      <line x1="16.5" y1="14" x2="17.5" y2="14"/>
      {/* Ponteiros */}
      <path d="M12 14 L12 10.5" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 14 L14.5 15.5" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Centro */}
      <circle cx="12" cy="14" r="0.8" fill="currentColor"/>
    </svg>
  )
}

/** Seta direita — para botão de selecionar */
export function IconArrowRight({ size = 12, className = '', strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <line x1="3" y1="12" x2="19" y2="12"/>
      <polyline points="13 6 19 12 13 18"/>
    </svg>
  )
}

/** Tesoura + Pente — para o header da secção */
export function IconBarberHeader({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      {/* Tesoura */}
      <circle cx="4" cy="6.5" r="2.2"/>
      <circle cx="4" cy="14.5" r="2.2"/>
      <line x1="6" y1="8" x2="15" y2="4"/>
      <line x1="6" y1="13" x2="15" y2="17"/>
      <line x1="15" y1="4" x2="15" y2="17"/>
      {/* Separador */}
      <line x1="17" y1="3" x2="17" y2="21" opacity="0.3"/>
      {/* Pente */}
      <rect x="19" y="7" width="8" height="4" rx="0.5"/>
      <line x1="20.5" y1="11" x2="20.5" y2="14"/>
      <line x1="22.5" y1="11" x2="22.5" y2="14"/>
      <line x1="24.5" y1="11" x2="24.5" y2="14"/>
    </svg>
  )
}
