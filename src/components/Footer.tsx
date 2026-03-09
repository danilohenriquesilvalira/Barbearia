import { MapPin, Phone } from 'lucide-react'
import BarberPole from './BarberPole'
import { useLanguage } from '../context/LanguageContext'

// ─── Social icons ─────────────────────────────────────────────────────────────
function IconInstagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function IconFacebook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function IconTikTok({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.85a8.18 8.18 0 0 0 4.79 1.53V6.93a4.85 4.85 0 0 1-1.02-.24z"/>
    </svg>
  )
}

function IconWhatsApp({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a9.83 9.83 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  )
}

// ─── Section header com linha gold — padrão do projeto ────────────────────────
function FooterHeading({ label }: { label: string }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-gold mb-3">{label}</p>
      <div className="flex items-center gap-2">
        <div className="h-px w-6 bg-gold/60" />
        <span className="w-1 h-1 bg-gold/50 rotate-45 flex-shrink-0" />
        <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const { t } = useLanguage()

  const hours = [
    { day: t('footer.weekdays'),  h: t('footer.weekdayHours'),  open: true  },
    { day: t('footer.saturday'),  h: t('footer.saturdayHours'), open: true  },
    { day: t('footer.sunday'),    h: t('footer.closed'),        open: false },
  ]

  const socials = [
    { href: '#', label: 'Instagram', Icon: IconInstagram },
    { href: '#', label: 'Facebook',  Icon: IconFacebook  },
    { href: '#', label: 'TikTok',    Icon: IconTikTok    },
    { href: '#', label: 'WhatsApp',  Icon: IconWhatsApp  },
  ]

  return (
    <footer id="contacto" className="relative bg-[#080808] overflow-hidden">

      {/* Transição suave do topo */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <BarberPole height="4px" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-18 pb-0">

        {/* ── Grid principal ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-14 pb-12 sm:pb-16">

          {/* ── Marca ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-mono text-[9px] tracking-[0.5em] uppercase text-gold/40 mb-4">
              Barbearia Clássica — Lisboa
            </p>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="font-graffiti text-4xl text-gold leading-none">Connect</span>
              <span className="h-5 w-px bg-gold/30" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-paper-muted leading-none">Barber</span>
            </div>
            {/* Separador */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-gold/30" />
              <span className="w-1 h-1 bg-gold/40 rotate-45 flex-shrink-0" />
              <div className="h-px flex-1 bg-gold/10" />
            </div>

            {/* Redes sociais */}
            <div className="flex items-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center text-paper/30 hover:text-gold transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Horários ── */}
          <div>
            <FooterHeading label={t('footer.hoursTitle')} />
            <div className="space-y-0">
              {hours.map(({ day, h, open }, i) => (
                <div key={day}>
                  <div className="flex justify-between items-center py-2.5 gap-4">
                    <span className="font-body text-xs text-paper-muted">{day}</span>
                    <span className={`font-mono text-[10px] whitespace-nowrap ${open ? 'text-gold/80' : 'text-paper/20'}`}>
                      {h}
                    </span>
                  </div>
                  {i < hours.length - 1 && (
                    <div className="h-px bg-paper/5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Contacto ── */}
          <div>
            <FooterHeading label={t('footer.contactTitle')} />
            <div className="space-y-4">

              <a
                href="tel:+351211234567"
                className="flex items-center gap-3 text-paper-muted hover:text-gold transition-colors"
              >
                <Phone size={13} className="text-gold/60 flex-shrink-0" />
                <span className="font-body text-sm">+351 21 123 45 67</span>
              </a>

              <div className="flex items-start gap-3 text-paper-muted">
                <MapPin size={13} className="text-gold/60 flex-shrink-0 mt-0.5" />
                <span className="font-body text-sm leading-relaxed">
                  Rua Augusta, 142<br />
                  <span className="text-paper/40 text-xs">1100-053 Lisboa</span>
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-paper/5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[9px] text-paper/20 tracking-widest">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-2">
            <div className="h-px w-6 bg-gold/20" />
            <span className="w-1 h-1 bg-gold/30 rotate-45" />
            <div className="h-px w-6 bg-gold/20" />
          </div>
          <p className="font-mono text-[9px] text-paper/15 tracking-widest uppercase">
            Lisboa · Portugal
          </p>
        </div>

      </div>
    </footer>
  )
}
