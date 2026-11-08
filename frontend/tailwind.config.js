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
        success: 'rgb(114 168 107 / <alpha-value>)',
        danger: 'rgb(217 107 107 / <alpha-value>)',
        warning: 'rgb(216 198 106 / <alpha-value>)',
        info: 'rgb(34 176 181 / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
