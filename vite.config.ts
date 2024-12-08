import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import preact from "@preact/preset-vite";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), preact({ prefreshEnabled: true, reactAliasesEnabled: true }), visualizer({ open: true, filename: './.diagnostics/bundle-visualization.html' })],
});
