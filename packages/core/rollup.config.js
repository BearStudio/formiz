import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import pkg from './package.json';

const config = ({ output, format }) => ({
  input: 'src/index.js',
  output: {
    name: 'formiz-core',
    file: output,
    format,
    globals: {
      'prop-types': 'PropTypes',
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  external: [
    'prop-types',
    'react',
    'react-dom',
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    visualizer({
      filename: `../../.stats/formiz-core.${format}.html`,
      title: `@formiz/core [${format}]`,
    }),
    terser(),
  ],
});

export default [
  config({ output: pkg.module, format: 'esm' }),
  config({ output: pkg.main, format: 'cjs' }),
];
