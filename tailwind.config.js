/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      'sm':  '640px',
      'md':  '768px',
      'lg':  '1024px',
      'xl':  '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        'off-black':    '#121212',
        'off-black-2':  '#1A1A1A',
        'off-black-3':  '#222222',
        'gold':         '#C9A84C',
        'gold-light':   '#E2C472',
        'gold-dark':    '#A8883A',
        'copper':       '#B87333',
        'paper':        '#F5F5F7',
        'paper-muted':  '#A0A0A5',
        'barber-red':   '#C1121F',
        'barber-blue':  '#023E8A',
      },
      fontFamily: {
        'display':  ['"Cinzel"', '"Playfair Display"', 'serif'],
        'heading':  ['"Oswald"', '"Abril Fatface"', 'sans-serif'],
        'hero':     ['"Staatliches"', '"Anton"', 'Impact', 'sans-serif'],
        'graffiti': ['"Sedgwick Ave"', '"Permanent Marker"', 'cursive'],
        'elegant':  ['"Montserrat"', '"Cormorant Garamond"', 'sans-serif'],
        'body':     ['"Lato"', 'system-ui', 'sans-serif'],
        'mono':     ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      animation: {
        'pulse-gold':  'pulseGold 2s ease-in-out infinite',
        'slide-up':    'slideUp 0.3s ease-out',
        'fade-in':     'fadeIn 0.4s ease-out',
        'stripe':      'stripe 1.2s linear infinite',
      },
      keyframes: {
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(201,168,76,0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        stripe: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 40px' },  /* deve ser múltiplo exato do ciclo (40px) */
        },
      },
    },
  },
  plugins: [],
}
