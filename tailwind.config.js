/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      colors: {
        brand: {
          dark:      '#0B0B0A',
          concrete:  '#232323',
          offwhite:  '#F4F0E8',
          limestone: '#D8C7A3',
          gold:      '#B8955B',
          forest:    '#1E3328',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
