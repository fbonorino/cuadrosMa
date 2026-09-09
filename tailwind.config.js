/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"General Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        canvas: '#FAFAF8',
        carbon: '#1C1C1A',
      },
    },
  },
  plugins: [],
}
