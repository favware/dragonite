import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  entry: ['src/**'],
  dts: false,
  unbundle: true,
  minify: false,
  skipNodeModulesBundle: true,
  sourcemap: true,
  target: 'es2024',
  tsconfig: 'src/tsconfig.json',
  treeshake: true,
  format: 'esm'
});
