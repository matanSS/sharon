/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        hebrew: ['Heebo', 'Arial', 'sans-serif'],
      },
      colors: {
        cream: {
          50:  '#FFFBF5',
          100: '#FFF5E6',
          200: '#FFE8C8',
        },
        coral: {
          400: '#FF7F7F',
          500: '#FF6B6B',
          600: '#E85555',
        },
      },
      animation: {
        'bounce-sm': 'bounce 0.4s ease-in-out',
        'pop': 'pop 0.2s ease-out',
      },
      keyframes: {
        pop: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
