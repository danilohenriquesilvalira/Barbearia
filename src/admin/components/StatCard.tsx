import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  trend?: number
  trendLabel?: string
  accent?: 'gold' | 'green' | 'red' | 'blue'
}

const accentMap = {
  gold:  { iconBg: 'bg-gold/10',        iconText: 'text-gold',      border: 'border-gold/[0.15]',       valueCls: 'text-paper'       },
  green: { iconBg: 'bg-green-500/10',   iconText: 'text-green-400', border: 'border-green-500/[0.15]',  valueCls: 'text-green-400'   },
  red:   { iconBg: 'bg-red-500/10',     iconText: 'text-red-400',   border: 'border-red-500/[0.15]',    valueCls: 'text-red-400'     },
  blue:  { iconBg: 'bg-blue-500/10',    iconText: 'text-blue-400',  border: 'border-blue-500/[0.15]',   valueCls: 'text-blue-300'    },
}

export default function StatCard({
  label, value, sub, icon: Icon,
  trend, trendLabel, accent = 'gold',
}: StatCardProps) {
  const c = accentMap[accent]
  const isUp   = trend !== undefined && trend > 0
  const isDown = trend !== undefined && trend < 0

  return (
    <div className={`
      relative overflow-hidden
      bg-off-black-3 border ${c.border} rounded-xl
      px-4 py-4 flex flex-col justify-between gap-3
      hover:border-gold/25 transition-colors duration-200
      group
    `}>
      {/* Glow sutil no canto */}
      <div className={`absolute -top-4 -right-4 w-16 h-16 ${c.iconBg} rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Linha superior: label + ícone */}
      <div className="flex items-center justify-between">
        <span className="text-paper-muted/70 text-[11px] font-body uppercase tracking-[0.12em]">
          {label}
        </span>
        <div className={`${c.iconBg} ${c.iconText} w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon size={14} strokeWidth={1.8} />
        </div>
      </div>

      {/* Valor principal */}
      <div>
        <p className={`text-[28px] font-heading leading-none ${c.valueCls}`}>{value}</p>
        {sub && (
          <p className="text-paper-muted/50 text-[11px] font-body mt-1 truncate">{sub}</p>
        )}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-[11px] font-body ${
          isUp ? 'text-green-400' : isDown ? 'text-red-400' : 'text-paper-muted/50'
        }`}>
          {isUp   && <TrendingUp  size={12} />}
          {isDown && <TrendingDown size={12} />}
          <span>
            {trend !== 0 && `${trend > 0 ? '+' : ''}${trend}%`}
            {trendLabel && <span className="text-paper-muted/40 ml-1">{trendLabel}</span>}
          </span>
        </div>
      )}
    </div>
  )
}
