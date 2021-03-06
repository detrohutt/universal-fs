import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default [
  {
    input: 'dist/cjs/index.js',
    experimentalDynamicImport: true,
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    plugins: [resolve({ extensions: ['.js'] }), commonjs()]
  },
  {
    input: 'dist/esm/index.js',
    experimentalDynamicImport: true,
    output: {
      file: 'dist/index.mjs',
      format: 'es'
    },
    plugins: [resolve({ extensions: ['.mjs', '.js'] })]
  }
];
