const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './icons/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lato)']
      },
      colors: {
        'umb-blue-dark': '#162335',
        'umb-blue': '#3544B1',
        'umb-blue-active': '#2A368E',
        'umb-green': '#3FD290',
        'umb-green-active': '#2ab476',
        'umb-pink': '#F3BFBA',
        'umb-brown': '#9B8058',
        'umb-yellow': '#FDC62F',
        'umb-orange': '#FF9413',
        'umb-lilac': '#E3CCE0',
        'umb-gray': '#F9F7F4',
        'umb-gray-active': '#e7dfd3',
        'stb-5': 'rgba(90,20,10,.05)',
        'stb-10': 'rgba(90,20,10,.1)',
        'stb-15': 'rgba(90,20,10,.15)',
        'stb-20': 'rgba(90,20,10,.2)' // 231 223 211
      },
      keyframes: {
        blink: {
          '0%': { opacity: 0.2 },
          '20%': { opacity: 1 },
          '100% ': { opacity: 0.2 }
        }
      },
      animation: {
        blink: 'blink 1.4s both infinite'
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value
            };
          }
        },
        {
          values: theme('transitionDelay')
        }
      );
    })
  ],
  safelist: [{ pattern: /bg-umb-.*/ }]
};
