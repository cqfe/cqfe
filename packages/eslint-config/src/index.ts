import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginTypeScript from '@typescript-eslint/eslint-plugin'
import parserTypeScript from '@typescript-eslint/parser'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginVue from 'eslint-plugin-vue'
import parserVue from 'vue-eslint-parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'

// -------------------------- 核心规则定义 --------------------------
// 1. 通用质量规则（无格式类规则，交给Prettier）
const commonQualityRules = {
  quotes: ['error', 'single', { avoidEscape: true }], // 强制单引号
  'no-console': 'off',
  'no-unused-vars': [
    'error',
    {
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      args: 'all',
      destructuredArrayIgnorePattern: '^_',
    },
  ],
  semi: ['error', 'never'],
  'comma-dangle': ['error', 'always'],
  indent: ['error', 2, { SwitchCase: 1 }],
  'max-len': ['warn', { code: 120, tabWidth: 2 }],
}

// 2. TS规则（允许any，仅保留合法规则）
const tsCommonRules = {
  ...pluginTypeScript.configs.recommended.rules,
  '@typescript-eslint/no-explicit-any': 'off', // 允许any类型
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      args: 'all',
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': 'allow-with-description' }],
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-empty-interface': 'warn',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/no-require-imports': 'off',
}

// 3. Vue规则（移除所有废弃规则，仅保留新版支持的）
const vueCustomRules = {
  // Vue 3核心语法校验
  'vue/valid-template-root': 'error',
  'vue/valid-attribute-name': 'error',
  'vue/valid-v-bind': 'error',
  'vue/valid-v-for': 'error',
  'vue/valid-v-if': 'error',
  'vue/no-deprecated-v-bind-sync': 'error',
  'vue/no-deprecated-filter': 'error',
  // Vue最佳实践
  'vue/no-unused-components': 'warn',
  'vue/no-unused-vars': 'warn',
  'vue/attribute-hyphenation': ['error', 'always'],
  // 格式类规则交给Prettier
  'vue/max-properties-per-line': 'off',
}

// -------------------------- 最终扁平配置 --------------------------
export default [
  // 1. 全局基础配置
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.es2025 },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: commonQualityRules,
    settings: {},
  },
  {
    rules: {
      'prettier/prettier': ['error', { semi: false }],
    },
  },

  // 2. 禁用Prettier冲突规则
  eslintConfigPrettier,

  // 4. JS基础规则（禁用格式类规则）
  {
    files: ['**/*.js'],
    languageOptions: {
      parserOptions: { sourceType: 'commonjs' }, // 适配 JS 文件
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      quotes: 'off',
      semi: 'off',
      'comma-dangle': 'off',
      indent: 'off',
      'max-len': 'off',
    },
  },

  // 5. 纯TS文件配置
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
    },
    rules: tsCommonRules,
  },

  // 6. React + TSX/JSX配置
  {
    files: ['**/*.{tsx,jsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      '@typescript-eslint': pluginTypeScript,
    },
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: tsCommonRules,
  },

  // 7. Vue文件配置（新版兼容，无废弃规则）
  {
    files: ['**/*.vue'],
    plugins: { vue: pluginVue },
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: parserTypeScript,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: vueCustomRules,
  },
  {
    // Ignore patterns from the root of the monorepo
    ignores: ['node_modules/**/*', 'dist/**/*', '**/*.test.ts', '**/*.spec.ts'],
  },
]
