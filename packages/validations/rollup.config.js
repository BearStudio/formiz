import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import pkg from './package.json';

const config = ({ output, format }) => ({
  input: 'src/index.js',
  output: {
    name: 'formiz-validations',
    file: output,
    format,
    sourcemap: true,
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
    visualizer({
      filename: `../../.stats/formiz-validations.${format}.html`,
      title: `@formiz/validations [${format}]`,
    }),
    terser(),
  ],
});

export default [
  config({ output: pkg.module, format: 'esm' }),
  config({ output: pkg.main, format: 'cjs' }),
];
