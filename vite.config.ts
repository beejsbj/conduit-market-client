import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    deno() as Plugin[],
    react(),
    visualizer({
      open: true,
      filename: './.diagnostics/bundle-visualization.html'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@root': resolve(__dirname, '.'),
    },
  },
});
