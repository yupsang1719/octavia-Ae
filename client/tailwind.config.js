import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green:        'rgb(var(--c-green) / <alpha-value>)',
          'green-mid':  'rgb(var(--c-green-mid) / <alpha-value>)',
          'green-lt':   'rgb(var(--c-green-lt) / <alpha-value>)',
          'green-bg':   'rgb(var(--c-green-bg) / <alpha-value>)',
          gold:         'rgb(var(--c-gold) / <alpha-value>)',
          'gold-dk':    'rgb(var(--c-gold-dk) / <alpha-value>)',
          'gold-lt':    'rgb(var(--c-gold-lt) / <alpha-value>)',
          cream:        'rgb(var(--c-cream) / <alpha-value>)',
          dark:         'rgb(var(--c-dark) / <alpha-value>)',
          muted:        'rgb(var(--c-muted) / <alpha-value>)',
          subtle:       'rgb(var(--c-subtle) / <alpha-value>)',
          border:       'rgb(var(--c-border) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif:   ['Bodoni Moda', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bodoni Moda', 'Georgia', 'serif'],
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
  plugins: [forms],
}
