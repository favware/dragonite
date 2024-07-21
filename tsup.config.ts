import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: false,
  entry: ['src/**'],
  format: ['esm'],
  minify: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  target: 'esnext',
  tsconfig: 'src/tsconfig.json',
  bundle: false,
  shims: false,
  keepNames: true,
  splitting: false
});
