/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Warm, encouraging study palette
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
        cream: '#fbf8f3',
      },
      boxShadow: {
        clay: '0 10px 30px -12px rgba(77, 57, 209, 0.35), inset 0 1px 0 0 rgba(255,255,255,0.6)',
        'clay-sm': '0 6px 18px -10px rgba(77, 57, 209, 0.30)',
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
        'shake': {
          '0%,100%': { transform: 'translateX(0)' },
          '20%,60%': { transform: 'translateX(-5px)' },
          '40%,80%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.28s ease-out',
        'shake': 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}
