/** @type { import('@storybook/react').Preview } */

import '@/index.css';

import { withThemeByClassName } from '@storybook/addon-themes';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    attributeName: 'data-mode',
  }),
];

export default preview;
