## 1. Fix Namespace Naming

- [x] 1.1 Update `toPascalCase()` function in `src/naming.ts` to properly handle hyphens
- [x] 1.2 Add logic to remove hyphen separators after uppercasing
- [x] 1.3 Test that `toPascalCase("apis-v2")` returns `"ApisV2"`

## 2. Fix DTS Template Formatting

- [x] 2.1 Update `templates/dts.ejs` to add proper spacing between content sections
- [x] 2.2 Add newline between interface declarations and function declarations
- [x] 2.3 Ensure proper indentation for all nested content within namespace

## 3. Update DTS Generation Logic

- [x] 3.1 Review `generateDTS()` function in `src/generators.ts`
- [x] 3.2 Ensure interface declarations are properly formatted with 2-space indentation
- [x] 3.3 Verify function declarations use correct type references

## 4. Update Interface Generation

- [x] 4.1 Review `generateInterfaceFields()` function in `src/typescript.ts`
- [x] 4.2 Ensure field descriptions are properly formatted
- [x] 4.3 Verify optional markers (`?`) are correctly applied

## 5. Update Parameter Interface Generation

- [x] 5.1 Review `generateParameterInterface()` function in `src/generators.ts`
- [x] 5.2 Ensure parameter descriptions are included in comments
- [x] 5.3 Verify parameter types are correct

## 6. Fix Output Path Handling

- [x] 6.1 Update `index.ts` to parse `output` configuration option correctly
- [x] 6.2 When `output` is a directory, use `fileName` option for file name
- [x] 6.3 When `output` is a file path, extract directory and file name from it
- [x] 6.4 Update namespace name generation to use extracted file name
- [x] 6.5 Test with both directory and file path output configurations

## 7. Test with Existing Specs

- [x] 7.1. Run tests with `test/mocks/v2.json` (Swagger 2.x)
- [x] 7.2. Run tests with `test/mocks/v3.json` (OpenAPI 3.x)
- [x] 7.3. Verify generated `.d.ts` files compile without TypeScript errors
- [x] 7.4. Check that namespace names are valid TypeScript identifiers

## 8. Verify Output Files

- [x] 8.1. Generate `.d.ts` file and verify proper formatting
- [x] 8.2. Check that all interfaces are nested under namespace
- [x] 8.3. Verify function declarations reference correct types
- [x] 8.4. Ensure no duplicate interface declarations

## 9. Update Tests

- [x] 9.1. Add test case for namespace name with hyphens
- [x] 9.2. Add test case for namespace name with underscores
- [x] 9.3. Add test case for complex nested types
- [x] 9.4. Verify all existing tests still pass

## 10. Documentation

- [x] 10.1. Update CHANGELOG.md with breaking change notice
- [x] 10.2. Document namespace name change from kebab-case to PascalCase
- [x] 10.3. Add migration notes for existing users

## 11. Fix Array Type Definitions

- [x] 11.1 Fix array with object items - generate interface for item type instead of inline type
- [x] 11.2 Ensure array item interfaces are properly named and reused
- [x] 11.3 Handle nested arrays correctly

## 12. Fix Response Type Reuse

- [x] 12.1 Response types should reference existing schema interfaces instead of inlining
- [x] 12.2 When response is a single schema reference, use the interface name directly
- [x] 12.3 When response is an array of schema references, use `InterfaceName[]`
- [x] 12.4 Generate response wrapper interfaces when needed for complex response structures
