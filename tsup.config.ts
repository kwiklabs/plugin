import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  splitting: false,
  treeshake: true,
  globalName: 'KwikEmbed',
  outExtension({ format }) {
    if (format === 'iife') return { js: '.min.js' };
    if (format === 'esm') return { js: '.mjs' };
    return { js: '.js' };
  },
  esbuildOptions(options) {
    options.banner = {
      js: '/*! Kwik Embed v0.1.0 | MIT License | https://kwik.gg/embed */',
    };
  },
});
