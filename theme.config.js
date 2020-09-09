/* eslint-disable import/no-extraneous-dependencies */
const { ThemeBuilder, Theme } = require('tailwindcss-theming');
const c = require('tinycolor2');

const light = new Theme()
  .name('light')
  .colors({
    transparent: 'transparent',
    black: '#000',
    white: '#fff',

    primary: '#455a64',
    'primary-dark': '#1c313a',
    'primary-light': '#718792',

    accent: '#589d9a',

    background: '#eceff1',
    surface: '#fff',
    error: '#e53935',
    success: '#43a047',
    info: '#1e88e5',

    'on-primary': '#fff',
    'on-background': '#212121',
    'on-surface': '#212121',
    'on-error': '#fff',

    border: '#cfd8dc',
  })
  .opacityVariant('80', 0.80)
  .opacityVariant('75', 0.75)
  .opacityVariant('60', 0.60)
  .colorVariant('dark', c('#cfd8dc').darken().toHexString(), 'border')
  .colorVariant('dark', c('#ffffff').darken().toHexString(), 'surface');

const dark = new Theme()
  .name('dark')
  .colors({
    accent: '#5fb3b1',
    background: '#263238',
    surface: c('#263238').lighten(3).toHexString(),

    'on-background': '#fff',
    'on-surface': '#fff',
    border: c('#455a64').darken(3).toHexString(),
  })
  .colorVariant('dark', c('#455a64').lighten(20).toString('hex6'), 'border')
  .colorVariant('dark', c('#263238').lighten(5).toHexString(), 'surface');

module.exports = new ThemeBuilder()
  .asClass()
  .default(light)
  .dark(dark);
