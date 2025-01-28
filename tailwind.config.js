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
      }
    },
  },
  plugins: [],
} 