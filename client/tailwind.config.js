import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green:        '#2D5A1E',
          'green-mid':  '#5B8A7D',
          'green-lt':   '#6AAF30',
          'green-bg':   '#E8F5EF',
          gold:         '#C8A96E',
          'gold-dk':    '#D4AF37',
          'gold-lt':    '#EDD9A3',
          cream:        '#FAFAF7',
          dark:         '#1A1A1A',
          muted:        '#666666',
          subtle:       '#999999',
          border:       '#E8EDE4',
        },
      },
      fontFamily: {
        serif:   ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      spacing: {
        'section-desktop': '96px',
        'section-mobile':  '64px',
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        'luxury':  '0 8px 40px -8px rgba(26,26,26,0.12)',
        'card':    '0 2px 16px -4px rgba(26,26,26,0.08)',
        'gold':    '0 4px 20px -4px rgba(200,169,110,0.25)',
      },
    },
  },
  plugins: [forms, typography],
}
