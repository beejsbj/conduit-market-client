/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./storybook/.storybook/**/*.{ts,tsx,js,jsx}",
    "./storybook/stories/**/*.{ts,tsx,js,jsx}"
  ],
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [],
}
