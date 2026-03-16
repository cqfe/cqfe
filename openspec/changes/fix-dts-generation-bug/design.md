## Context

The `@cqfe/generate-api` package generates TypeScript type definitions (.d.ts files) from Swagger/OpenAPI specifications. The current implementation in `src/generators.ts` and `src/naming.ts` has several issues:

1. **Namespace naming**: Uses `toPascalCase()` which only capitalizes the first letter, leaving hyphens unchanged (e.g., "apis-v2" → "Apis-v2")
2. **Template formatting**: The EJS template (`templates/dts.ejs`) doesn't enforce proper indentation for nested content
3. **Inline types**: Response types are generated inline instead of referencing type definitions from the spec
4. **Output path handling**: When `output` is a specific file path, the code doesn't extract directory and filename correctly - it always uses `fileName` option for both directory and filename

Current implementation:

- `toPascalCase()` in `naming.ts`: `str.charAt(0).toUpperCase() + str.slice(1)` - only uppercases first char
- `generateDTS()` in `generators.ts`: Concatenates strings without consistent formatting

## Goals / Non-Goals

**Goals:**

- Generate valid TypeScript namespace names (no hyphens)
- Produce properly formatted `.d.ts` files with consistent indentation
- Use referenced types from definitions instead of inlining
- Maintain backward compatibility where possible (namespace name change is breaking but necessary)

**Non-Goals:**

- Changing the spec format or input parameters
- Modifying `.js` or `.ts` file generation (those work correctly)
- Refactoring the entire generator architecture

## Decisions

### 1. Namespace Name Transformation

**Decision**: Update `toPascalCase()` to properly convert kebab-case to PascalCase

**Rationale**:

- TypeScript identifiers cannot contain hyphens
- PascalCase is the standard convention for TypeScript namespaces
- This is a breaking change, but the current behavior produces invalid TypeScript

**Implementation**:

```typescript
export function toPascalCase(str: string): string {
  if (!str) return ''
  let result = str.charAt(0).toUpperCase() + str.slice(1)
  // Convert - and _ separators
  result = result.replace(/[-_]([a-z|A-Z|0-9])/g, (_, p1) => p1.toUpperCase())
  // Remove separators entirely
  result = result.replace(/[-_]/g, '')
  return result
}
```

**Alternative considered**: Use a separate function for namespace naming

- **Rejected**: `toPascalCase()` is already used for PascalCase conversion, should be consistent

### 2. DTS Template Formatting

**Decision**: Update the EJS template to include proper spacing and newline handling

**Rationale**:

- Current template concatenates everything without consistent spacing
- Need blank lines between interface declarations for readability
- Proper indentation is required for nested namespace content

**Implementation**:

```ejs
export namespace <%= namespace %> {
  export interface Obj {
    [key: string]: any
  }

  <%- interfaces %>

  <%- functionDeclarations %>
}
```

### 3. Type Reference vs Inlining

**Decision**: Keep the current approach but improve it

**Rationale**:

- The current implementation already collects type references via `collectTypeReferences()`
- Types are already generated in `generateTypeDefinitions()`
- Just need to ensure response types reference the collected types properly
- Inlining is acceptable for simple types (e.g., `{id: number}`) as it improves readability

**Current state**: The code already has `generateTypeDefinitions()` which generates interfaces for all referenced types from definitions. This is correct.

## Risks / Trade-offs

[Risk] → **Breaking change**: Namespace names will change for existing users

- **Mitigation**: Document clearly in CHANGELOG.md
- **Trade-off**: Better to have valid TypeScript than maintain broken behavior

[Risk] → **Regeneration required**: All `.d.ts` files need to be regenerated

- **Mitigation**: This is a one-time action for users
- **Trade-off**: Acceptable maintenance burden for correctness

[Risk] → **Template complexity**: EJS templates can be hard to debug

- **Mitigation**: Keep templates simple, move complexity to TypeScript functions
- **Trade-off**: Simpler templates are easier to maintain

[Risk] → **Circular references**: Type definitions might reference each other

- **Mitigation**: The `visitedSchemas` Set in `collectTypeReferences()` already handles this
- **Trade-off**: Acceptable, already implemented correctly
