import eslintConfig from '@cqfe/eslint-config'

export default [
  ...eslintConfig,
  {
    ignores: [
      '**/es/**/*',
      '**/lib/**/*',
      '**/bin/**/*',
      '**/*.d.ts',
      '**/test/output/**/*',
      '**/coverage/**/*',
      'packages/**/test/*.js',
      'packages/docs/.vitepress/**/*',
      'packages/docs/componentsCode/**/*',
      'packages/docs/public/**/*',
      'packages/vue-hooks/jessibuca-pro.js',
    ],
  },
]
