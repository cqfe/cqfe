import cqfeEslintConfig from '@cqfe/eslint-config';

export default [
  ...cqfeEslintConfig,
  {
    ignores: [
      'es',
      'lib',
      'bin',
      '*.d.ts',
      'coverage',
      'packages/**/test/*.js',
      'packages/docs/componentsCode',
      'packages/docs/public',
      'packages/vue-hooks/jessibuca-pro.js',
    ],
  },
];