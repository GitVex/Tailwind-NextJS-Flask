/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {    
        'darknavy': {  DEFAULT: '#15161E',  
        '50': '#E7E8EE',  
        '100': '#D5D6E2',  
        '200': '#ABAEC4',  
        '300': '#72779C',  
        '400': '#585C7E',  
        '500': '#434660',  
        '600': '#2C2E3F',  
        '700': '#1B1D27',  
        '800': '#15161E',  
        '900': '#0B0B0F'},
        'navy-sierra': {  DEFAULT: '#4F3F88',  
        '50': '#FDFAFB',  
        '100': '#F7EEF2',  
        '200': '#ECD5E3',  
        '300': '#E0BDD9',  
        '400': '#D5A4D3',  
        '500': '#C38CCA',  
        '600': '#A973BF',  
        '700': '#8C5BB3',  
        '800': '#6B4AA1',  
        '900': '#4F3F88'},
      },
      fontFamily: {
        'primary': ['articulat-cf', 'sans-serif'],
        'mono': ['roboto-mono', 'monospace']
      },
    },
  },
  plugins: [],
}