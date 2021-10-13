module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        product: '0px 9px 20px 0px rgb(22 26 57 / 36%)',
        pane: '0px 14px 16px 0px rgb(31 43 92 / 11%)',
        'primary-button': '-1.04px 4.891px 20px 0px rgb(69 49 183 / 50%)',
        pageLink: '0px 15px 30px 0px rgb(119 123 146 / 10%)',
      },
      backgroundColor: {
        'primary-background': `-webkit-linear-gradient(90deg, #3da9f5 0%, #683df5 100%)`,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
