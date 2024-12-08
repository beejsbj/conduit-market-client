import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import preact from "@preact/preset-vite";
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    deno(),
    preact({
      prefreshEnabled: true,
      reactAliasesEnabled: true
    }),
    visualizer({
      open: true,
      filename: './.diagnostics/bundle-visualization.html'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@root': resolve(__dirname, '.')
    }
  }
});
