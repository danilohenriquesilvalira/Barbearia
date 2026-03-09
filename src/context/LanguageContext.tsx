import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, resolvePath, type Locale, type Translations } from '../i18n/translations'

interface LanguageContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (path: string) => string
  tr: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('pt-PT')
  const tr = translations[locale]
  const t = (path: string) => resolvePath(tr, path)

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tr }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
