/* eslint-disable import/no-extraneous-dependencies */

const { ThemeBuilder, Theme } = require('tailwindcss-theming');

const palette = {
  white: '#fff',
  black: '#000',

  blueGray: {
    50: '#eceff1',
    100: '#cfd8dc',
    200: '#b0bec5',
    300: '#90a4ae',
    400: '#78909c',
    500: '#607d8b',
    600: '#546e7a',
    700: '#455a64',
    800: '#37474f',
    900: '#263238',
  },
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  green: {
    50: '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  indigo: {
    50: '#e8eaf6',
    100: '#c5cae9',
    200: '#9fa8da',
    300: '#7986cb',
    400: '#5c6bc0',
    500: '#3f51b5',
    600: '#3949ab',
    700: '#303f9f',
    800: '#283593',
    900: '#1a237e',
  },
};

const light = new Theme()
  .colors({
    transparent: 'transparent',
    black: palette.black,
    dark: palette.blueGray['700'],
    'dark-lighter': palette.blueGray['500'],
    darker: palette.blueGray['900'],

    white: palette.white,
    'white-light': palette.gray['50'],
    'white-dark': palette.blueGray['50'],

    primary: palette.blueGray['700'],
    'primary-dark': palette.blueGray['800'],
    'primary-light': palette.blueGray['600'],
    success: palette.green['600'],

    accent: palette.indigo['600'],
    'accent-dark': palette.indigo['800'],

    'on-primary': palette.white,
    'on-primary-light': palette.blueGray['50'],
    'on-background': palette.gray['900'],
    'on-background-light': palette.gray['600'],

    'border-light': palette.blueGray['50'],
    border: palette.blueGray['100'],
    'border-dark': palette.blueGray['300'],
  });

module.exports = new ThemeBuilder()
  .asClass()
  .default(light);
