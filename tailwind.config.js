/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        church: {
          purple: '#4A1D6D',
          gold: '#D4AF37',
          blue: '#1E3A5F',
        }
      }
    },
  },
  plugins: [],
}