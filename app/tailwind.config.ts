import type { Config } from 'tailwindcss'
const { fontFamily } = require('tailwindcss/defaultTheme')

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
    },
    extend: {
        fontFamily: {
            sans: ['var(--font-sans)', ...fontFamily.sans],  // Inter is a Google font
        },
    },
  },
  plugins: [],
}
export default config
