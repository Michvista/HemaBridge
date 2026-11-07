/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
          crimson: '#990011',
          ruby: '#b2102f',
          dark: '#140609',
        },
        healthcare: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
          surface: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          textMuted: '#64748b',
          textDark: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
