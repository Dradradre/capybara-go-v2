/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'epic-s': '#f53b57',
        'epic': '#ffa502',
        'rare': '#3742fa',
        'uncommon': '#2ed573',
        'common': '#747d8c',
      },
      keyframes: {
        'modal-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        }
      },
      animation: {
        'modal-up': 'modal-up 0.2s ease-out'
      }
    },
  },
  plugins: [],
} 