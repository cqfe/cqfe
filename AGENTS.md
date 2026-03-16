# AGENTS.md - Agent Coding Guidelines

This document provides guidelines for agentic coding agents working in this repository.

## Project Overview

This is a **monorepo** using Lerna with npm workspaces containing multiple packages:

- `@cqfe/utils` - Toolkit for frontend developers
- `@cqfe/vue-hooks` - Vue 3 hooks
- `@cqfe/generate-api` - OpenAPI toolkits
- `@cqfe/eslint-config` - ESLint configuration
- `@cqfe/prettier-config` - Prettier configuration
- `@cqfe/vue-components` - Vue components
- `@cqfe/docs` - Documentation site
- `@cqfe/deploy-scp` - Deployment utilities

## Build, Lint, and Test Commands

### Root Commands

```bash
# Build all packages
npm run build

# Run all tests
npm run test

# Lint all files (with auto-fix)
npm run lint

# Release/publish packages
npm run release

# Develop docs site
npm run dev:docs
```

### Single Package Commands

```bash
# From package directory, e.g., packages/utils/

# Build a specific package
npm run build

# Run tests (Jest)
npm run test

# Run a single test file
npm run test -- path/to/test.test.ts

# Run tests in watch mode
npm run test -- --watch

# Run tests matching a pattern
npm run test -- --testNamePattern="pattern"

# Lint a specific package (generate-api only)
npm run lint
```

## Code Style Guidelines

### General Rules

- **Quotes**: Single quotes only (`'string'`) with `avoidEscape: true`
- **Semicolons**: Never use semicolons
- **Indentation**: 2 spaces (not tabs)
- **Max line length**: 120 characters (warning)
- **Trailing commas**: Always required

### TypeScript Guidelines

- Use TypeScript for all new code
- `any` type is allowed (rule is off)
- Explicit module boundary types are NOT required
- Unused variables: prefix with `_` to ignore (e.g., `_unusedVar`)
- Use `Record<string, unknown>` for generic objects
- Use `Awaited<T>` for Promise return types

### Import Conventions

```typescript
// Order: external → internal → relative
import { ref, computed } from 'vue'
import { pick, omit } from '@cqfe/utils'
import { MyComponent } from './components/MyComponent'
import { helper } from '../utils/helper'
```

### Naming Conventions

- **Files**: kebab-case (`my-component.ts`, `useCounter.ts`)
- **Components**: PascalCase (`MyComponent.vue`)
- **Functions/variables**: camelCase (`myFunction`, `myVariable`)
- **Constants**: UPPER_SNAKE_CASE
- **Vue hooks**: camelCase starting with `use` (`useCounter`, `useAuth`)
- **Interfaces**: PascalCase, no `I` prefix (`UserInfo`, not `IUserInfo`)

### Vue-Specific Guidelines

- Use Vue 3 Composition API with `<script setup>`
- Props should use `defineProps` with type annotations
- Emit using `defineEmits`
- Use hyphen-case for prop names in templates
- Vue component filenames: PascalCase (`MyComponent.vue`)

### React-Specific Guidelines

- Use functional components with hooks
- Follow React 18+ patterns
- Use `useClient` directive for client components where needed

### Error Handling

- Use `tryIt` utility for functions that may throw (returns tuple `[result, error]`)
- Handle async errors with try/catch or `.catch()`
- Always provide meaningful error messages

### Vue Template Style

```vue
<script setup lang="ts">
defineProps<{
  title: string
  count?: number
}>()

const emit = defineEmits<{
  (e: 'update', value: string): void
}>()
</script>

<template>
  <div class="my-component">
    {{ title }}
  </div>
</template>

<style scoped>
.my-component {
  /* 2 spaces indentation in CSS too */
}
</style>
```

### File Headers

Use JSDoc comments for exported functions:

```typescript
/**
 * Description of what the function does
 * @author <Name>
 *
 * @param paramName - Parameter description
 * @returns What the function returns
 */
export function myFunction(paramName: string) {
  // ...
}
```

### Pre-commit Hooks

This project uses:

- **Husky** for git hooks
- **lint-staged** to run ESLint + Prettier on staged files
- **commitlint** for commit message validation

### Testing Guidelines

- Test files: `__tests__/*.test.ts` or `*.test.ts`
- Use Jest's `describe` and `it`/`test` blocks
- Follow AAA pattern: Arrange, Act, Assert
- Use `test.todo()` for pending tests

### ESLint Configuration

The project uses `@cqfe/eslint-config` which includes:

- ESLint flat config format
- TypeScript support
- Vue 3 support
- React + React Hooks support
- Prettier integration (disables conflicting rules)

Run linting:

```bash
npm run lint
```

## Additional Notes

- All packages are published to npm as public packages
- Use Conventional Commits for commit messages (`feat:`, `fix:`, `docs:`, etc.)
- The project uses TypeScript 5.3.3
- Node.js ESM modules (type: "module" in package.json)
