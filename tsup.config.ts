import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: false,
  entry: ['src/**/*.ts', 'src/**/*.js', '!src/**/*.d.ts'],
  minify: false,
  skipNodeModulesBundle: true,
  target: 'esnext',
  bundle: false,
  shims: false,
  keepNames: true,
  splitting: false
});
