/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#FFA500',
          white: '#90EE90',
        },
      },
    },
  },
  plugins: [],
};
