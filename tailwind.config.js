/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Body: friendly + highly readable. Display: rounded, characterful headings.
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Semantic tokens — backed by CSS vars that flip in light/dark.
        // Written as `rgb(var(--x) / <alpha-value>)` so opacity utilities work.
        app: 'rgb(var(--app) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--ink-soft) / <alpha-value>)',
        'ink-faint': 'rgb(var(--ink-faint) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        // Brand (violet) + the warm "musical" amber accent.
        brand: {
          50: '#f1f3ff',
          100: '#e4e8ff',
          200: '#ccd4ff',
          300: '#abb6ff',
          400: '#868dff',
          500: '#6b66f7',
          600: '#5a47ec',
          700: '#4d39d1',
          800: '#4030a8',
          900: '#372e85',
        },
      },
      boxShadow: {
        clay: 'var(--shadow-clay)',
        'clay-sm': 'var(--shadow-clay-sm)',
        soft: '0 8px 24px -14px rgba(31, 41, 55, 0.25)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%,60%': { transform: 'translateX(-5px)' },
          '40%,80%': { transform: 'translateX(5px)' },
        },
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.28s ease-out',
        shake: 'shake 0.4s ease-in-out',
        'rise-in': 'rise-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
