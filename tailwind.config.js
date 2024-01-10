module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      // that is animation class
      animation: {
        fade: 'fadeOut 1s ease-in-out',
      },
      keyframes: theme => ({
        fadeOut: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }),
      colors: {
        primary: '#E8423F',
        secondary: '#000',
        sidebarSubtitle: '#CCCEDD',
        cidPrimaryGreen: '#3ECE80',
        cidPrimaryWhite: '#ffffff',
        cidPrimaryPurple: '##807FD9',
        cidPrimaryLightBlue: '##08D0D6',
        cidSecundaryGrey: '#E7EAE4',
        cidSecundaryOliveGreen: '#DDE6C3',
        cidSecundayBlue: '#0061F4',
        cidSecundaryBlack: '#353535',
        cidSecundaryLightPurple: '#ABC3F1',
        cidTertiaryLightPurple: '#FF1A43',
        accentSection: '#F9FAFC',
        lightBloom: '#F6F8FB',
        redlight: '#FFF5F5',
        hovercidTertiaryLightPurple: 'rgba(235, 90, 67, 0.9)',
        hovercidPrimaryGreen: 'rgba(62, 206, 128, 0.9)',
        titleGray: '#8F98A9',
        cidSoftBlue: '#DAE9FF',
        cidSoftGreen: '#d8f5e6',
      },
      fontFamily: {
        cidFont: ['Roboto'],
      },
      spacing: {
        27: '27px',
        29: '29px',
      },
    },
    borderRadius: {
      'none': '0',
      'sm': '0.125rem',
      DEFAULT: '0.25rem',
      DEFAULT: '4px',
      'md': '0.375rem',
      'lg': '0.5rem',
      'full': '9999px',
      'large': '12px',
      'login': '150px',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
