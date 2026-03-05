/**
 * Jest configuration for generate-api
 */

import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ES2020',
          module: 'CommonJS',
          moduleResolution: 'node',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          isolatedModules: true,
        },
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(lodash-es|change-case|openapi-typescript)/)'],
  moduleNameMapper: {
    nanoid: '<rootDir>/../../node_modules/nanoid/index.cjs',
    'parse-json': '<rootDir>/../../node_modules/parse-json/index.js',
    'supports-color': '<rootDir>/../../node_modules/supports-color/index.js',
    'change-case': '<rootDir>/../../node_modules/change-case/dist/index.js',
    'openapi-typescript': '<rootDir>/../../node_modules/openapi-typescript/dist/index.cjs',
    'lodash-es': '<rootDir>/../../node_modules/lodash/lodash.js',
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/test/**/*.spec.ts'],
}

export default config
