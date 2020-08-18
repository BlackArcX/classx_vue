/* eslint-disable global-require,import/no-extraneous-dependencies */

const plugin = require('tailwindcss/plugin');
const { transparentize } = require('polished');

module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.ts',
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      width: {
        11: '2.75rem',
      },
    },
  },
  variants: {
    borderWidth: ['responsive', 'first', 'hover', 'focus'],
    display: ['responsive', 'last'],
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    require('./theme.config'),

    plugin(({ addUtilities }) => {
      const newUtilities = {
        '.shadow-outline-primary': {
          'box-shadow': `0 0 0 3px ${transparentize(0.7, '#455a64')}`,
        },
      };
      addUtilities(newUtilities, ['focus']);
    }),

  ],
};
