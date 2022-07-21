/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: '#c9e8f2',
        gray: '#8da2a9',
        purple: '#ccd1f2',
        green: '#c9f2d5',
        darkgreen: '#8da995',
        darkred: '#DC6E6D'
      },
      fontFamily: {
        body: ['Rubik']
      }
    },
  },
  plugins: [],
}
