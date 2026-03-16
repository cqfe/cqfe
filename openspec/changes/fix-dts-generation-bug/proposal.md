## Why

The current `.d.ts` file generation has formatting and naming issues that make generated type definitions invalid or difficult to use. Specifically:

1. Namespace names contain hyphens (e.g., `Apis-v2`) which are not valid TypeScript identifiers
2. The `.d.ts` file lacks proper indentation and spacing, making it hard to read
3. Interface declarations are not properly formatted within the namespace
4. Response types are (inline instead of using referenced types from definitions
5. **NEW**: Output path handling is incorrect - when `output` is a specific file path, files are not generated in the expected location

## What Changes

- **BREAKING**: Namespace naming will change from kebab-case to PascalCase (e.g., `apis-v2` → `ApisV2`)
- Fix namespace name generation to use proper PascalCase transformation
- Improve `.d.ts` file formatting with proper indentation and spacing
- Ensure all interface declarations are properly nested within namespace
- Fix response type generation to properly reference definitions instead of inlining types
- **NEW**: Fix output path handling - when `output` is a specific file path, extract directory and use filename for generating files

## Capabilities

### New Capabilities

### Modified Capabilities

- `generate-api`: The `.d.ts` generation logic will be fixed to produce valid TypeScript namespace declarations with proper formatting

## Impact

- **Affected code**: `packages/generate-api/src/generators.ts`, `packages/generate-api/src/naming.ts`
- **Test files**: Generated `.d.ts` files in test output directory
- **User impact**: Existing users using the generated `.d.ts` files may need to update their imports if they were using the old namespace naming (e.g., `Apis-v2` → `ApisV2`)
