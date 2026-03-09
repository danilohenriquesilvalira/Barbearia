// Bandeiras SVG — funcionam em todos os sistemas (incluindo Windows)
// que não renderiza emojis de bandeira

interface FlagProps {
  size?: number
  className?: string
}

export function FlagPT({ size = 24, className = '' }: FlagProps) {
  return (
    <svg
      width={size}
      height={size * 0.667}
      viewBox="0 0 900 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', borderRadius: 2, flexShrink: 0 }}
    >
      {/* Verde */}
      <rect width="360" height="600" fill="#006600" />
      {/* Vermelho */}
      <rect x="360" width="540" height="600" fill="#FF0000" />
      {/* Esfera armilar — anel exterior */}
      <circle cx="360" cy="300" r="105" fill="none" stroke="#FFD700" strokeWidth="18" />
      {/* Escudo branco */}
      <ellipse cx="360" cy="300" rx="62" ry="72" fill="#FFFFFF" />
      {/* Bordadura vermelha */}
      <ellipse cx="360" cy="300" rx="62" ry="72" fill="none" stroke="#FF0000" strokeWidth="12" />
      {/* 5 Quinas (quadrados azuis com pontos brancos) */}
      {[
        [360, 254], [360, 346],
        [316, 300], [404, 300],
        [360, 300],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <rect x={cx! - 13} y={cy! - 13} width="26" height="26" fill="#003399" />
          {[[0,0],[-7,-7],[-7,7],[7,-7],[7,7]].map(([dx, dy], j) => (
            <circle key={j} cx={cx! + dx!} cy={cy! + dy!} r="3.5" fill="#FFFFFF" />
          ))}
        </g>
      ))}
    </svg>
  )
}

export function FlagES({ size = 24, className = '' }: FlagProps) {
  const h = size * 0.667
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 750 500"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', borderRadius: 2, flexShrink: 0 }}
    >
      {/* Vermelho topo */}
      <rect width="750" height="125" fill="#AA151B" />
      {/* Amarelo centro */}
      <rect y="125" width="750" height="250" fill="#F1BF00" />
      {/* Vermelho fundo */}
      <rect y="375" width="750" height="125" fill="#AA151B" />
      {/* Escudo simplificado */}
      <rect x="260" y="170" width="60" height="80" rx="4" fill="#AA151B" stroke="#8B0000" strokeWidth="3" />
      <rect x="330" y="170" width="60" height="80" rx="4" fill="#AA151B" stroke="#8B0000" strokeWidth="3" />
      {/* Coroa */}
      <rect x="270" y="155" width="110" height="18" rx="3" fill="#C8A000" />
      <circle cx="325" cy="150" r="8" fill="#C8A000" />
    </svg>
  )
}

export function FlagGB({ size = 24, className = '' }: FlagProps) {
  const h = size * 0.5
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 60 30"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', borderRadius: 2, flexShrink: 0 }}
    >
      {/* Fundo azul */}
      <rect width="60" height="30" fill="#012169" />
      {/* Cruz de St. André (branca) */}
      <line x1="0" y1="0"  x2="60" y2="30" stroke="#fff" strokeWidth="6" />
      <line x1="60" y1="0" x2="0"  y2="30" stroke="#fff" strokeWidth="6" />
      {/* Cruz de St. Patrício (vermelha) — diagonais */}
      <line x1="0" y1="0"  x2="60" y2="30" stroke="#C8102E" strokeWidth="2" />
      <line x1="60" y1="0" x2="0"  y2="30" stroke="#C8102E" strokeWidth="2" />
      {/* Cruz de St. Jorge (branca + vermelha) — horizontal e vertical */}
      <rect x="25" y="0"  width="10" height="30" fill="#fff" />
      <rect x="0"  y="10" width="60" height="10" fill="#fff" />
      <rect x="27" y="0"  width="6"  height="30" fill="#C8102E" />
      <rect x="0"  y="12" width="60" height="6"  fill="#C8102E" />
    </svg>
  )
}

export type FlagComponent = typeof FlagPT
