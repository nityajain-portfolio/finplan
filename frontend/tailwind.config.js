/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#00B4A6',
          dark:    '#009489',
        },
        gold: {
          DEFAULT: '#E8A23A',
        },
        navy: {
          DEFAULT: '#0F1B2D',
        },
        slate2: {
          DEFAULT: '#1E2D40',
        },
      },
    },
  },
  plugins: [],
};
