import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { LOCALE_NAMES, type Locale } from '../i18n/translations'
import { FlagPT, FlagES, FlagGB } from './Flag'

const LOCALES: Locale[] = ['pt-PT', 'es', 'en-GB']

const FLAG_MAP: Record<Locale, React.FC<{ size?: number }>> = {
  'pt-PT': FlagPT,
  'es':    FlagES,
  'en-GB': FlagGB,
}

const SHORT_LABEL: Record<Locale, string> = {
  'pt-PT': 'PT',
  'es':    'ES',
  'en-GB': 'EN',
}

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const CurrentFlag = FLAG_MAP[locale]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 border border-paper/10 hover:border-gold/40 transition-colors group"
        aria-label="Idioma / Language"
      >
        <CurrentFlag size={20} />
        <span className="font-mono text-xs text-paper-muted group-hover:text-gold transition-colors">
          {SHORT_LABEL[locale]}
        </span>
        <ChevronDown
          size={11}
          className={`text-paper-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 bg-off-black-2 border border-paper/10 shadow-2xl z-50 animate-slide-up overflow-hidden">
          {LOCALES.map((l) => {
            const FlagComp = FLAG_MAP[l]
            const active = locale === l
            return (
              <button
                key={l}
                onClick={() => { setLocale(l); setOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  font-body text-sm transition-all duration-150
                  border-l-2
                  ${active
                    ? 'text-gold bg-off-black-3 border-gold'
                    : 'text-paper-muted hover:text-paper hover:bg-off-black-3 border-transparent'
                  }
                `}
              >
                <FlagComp size={22} />
                <div className="flex flex-col items-start">
                  <span className="font-mono text-xs leading-none">{SHORT_LABEL[l]}</span>
                  <span className="font-body text-[10px] text-paper-muted leading-none mt-0.5">
                    {LOCALE_NAMES[l]}
                  </span>
                </div>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
