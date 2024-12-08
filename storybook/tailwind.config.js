// storybook/tailwind.config.js
import parentConfig from '../tailwind.config.js'

/** @type {import('tailwindcss').Config} */
export default {
  ...parentConfig,
  content: [
    '../src/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
}
