/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          midnight: '#0F172A',
          cobalt: '#4338CA',
          coral: '#FF3366',
          gold: '#F59E0B',
          slate: '#F8FAFC',
        }
      },
      fontFamily: {
        // A premium sans-serif stack for a world-class feel
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Inter', 'sans-serif'], 
      },
      boxShadow: {
        // Custom soft shadows for property cards
        'premium': '0 10px 40px -10px rgba(15,23,42,0.08)',
      }
    },
  },
  plugins: [],
}