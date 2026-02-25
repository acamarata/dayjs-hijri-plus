import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  splitting: false,
  sourcemap: true,
  target: 'es2020',
  platform: 'node',
  external: ['dayjs', 'hijri-core'],
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.cjs' };
  },
});
