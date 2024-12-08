import path from 'path';

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    // Ensure resolve exists
    if (!config.resolve) {
      config.resolve = {};
    }

    // Ensure alias exists
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }

    // Add the alias, going up to the project root and then into src
    config.resolve.alias['@'] = path.resolve(__dirname, '../..', 'src');

    // Debug log to verify path
    console.log('Alias path resolved to:', path.resolve(__dirname, '../..', 'src'));

    return config;
  },
};

export default config;
