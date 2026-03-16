## ADDED Requirements

### Requirement: Generate valid TypeScript namespace names

The system SHALL generate valid TypeScript namespace names from file names.

#### Scenario: PascalCase conversion

- **WHEN** generating a namespace name from a file name containing hyphens
- **THEN** the system SHALL convert the file name to PascalCase by uppercasing the first letter of each segment and removing hyphens

#### Scenario: Valid identifier generation

- **WHEN** file name is "apis-v2"
- **THEN** namespace name SHALL be "ApisV2" (not "Apis-v2")

#### Scenario: Invalid characters removal

- **WHEN** file name contains characters not allowed in TypeScript identifiers
- **THEN** the system SHALL remove those characters from the namespace name

### Requirement: Generate properly formatted d.ts files

The system SHALL generate `.d.ts` files with proper TypeScript formatting and indentation.

#### Scenario: Namespace declaration format

- **WHEN** generating a `.d.ts` file
- **THEN** the file SHALL contain a properly formatted namespace declaration with interface definitions inside

#### Scenario: Interface indentation

- **WHEN** generating interface declarations within the namespace
- **THEN** each interface SHALL be indented with 2 spaces to indicate it's nested within the namespace

#### Scenario: Interface declaration placement

- **WHEN** generating a `.d.ts` file
- **THEN** all interface declarations SHALL be placed inside the namespace

#### Scenario: Spacing between declarations

- **WHEN** generating multiple interface or function declarations
- **THEN** the system SHALL include proper spacing between declarations for readability

### Requirement: Generate type definitions from schema

The system SHALL generate TypeScript interface definitions from OpenAPI/Swagger schema definitions.

#### Scenario: Reference type generation

- **WHEN** a schema contains a `$ref` to a type definition
- **THEN** the system SHALL generate an interface for that type definition

#### Scenario: Nested type handling

- **WHEN** generating types from a schema with nested properties
- **THEN** the system SHALL handle up to 4 levels of nesting correctly

#### Scenario: Type reference collection

- **WHEN** generating response types that reference other types
- **THEN** the system SHALL collect all referenced types and generate interfaces for them

### Requirement: Generate function declarations with proper types

The system SHALL generate TypeScript function declarations with correct parameter and return types.

#### Scenario: Function declaration placement

- **WHEN** generating a `.d.ts` file
- **THEN** function declarations SHALL be placed at the top level, outside the namespace

#### Scenario: Parameter types

- **WHEN** generating a function declaration with path, query, or body parameters
- **THEN** the parameter types SHALL reference the corresponding interfaces within the namespace

#### Scenario: Return types

- **WHEN** generating a function declaration with a response schema
- **THEN** the return type SHALL be a Promise with the correct response type

#### Scenario: Optional parameters

- **WHEN** generating a function declaration
- **THEN** the `options` parameter SHALL be optional and typed as `Namespace.Obj`

### Requirement: Handle output path configuration

The system SHALL correctly parse `output` configuration option to determine file generation location.

#### Scenario: Output is a directory path

- **WHEN** `output` option is a directory path (e.g., `./output`)
- **THEN** system SHALL use `fileName` option as a file name
- **AND** files SHALL be generated in the specified directory

#### Scenario: Output is a specific file path

- **WHEN** `output` option is a specific file path (e.g., `./output/apis.ts`)
- **THEN** system SHALL extract the directory from the output path
- **AND** system SHALL use the file name from the output path as a file name
- **AND** `fileName` option SHALL be ignored for file name generation

### Requirement: Fix array type definitions

The system SHALL correctly handle array type definitions in generated TypeScript interfaces.

#### Scenario: Array with object items

- **WHEN** a property has `type: "array"` with items being an object schema
- **THEN** the system SHALL generate an interface for the item type
- **AND** use that interface as the array element type (e.g., `ItemType[]`)

#### Scenario: Array with primitive items

- **WHEN** a property has `type: "array"` with items being a primitive type (string, number, etc.)
- **THEN** the system SHALL use the primitive type directly (e.g., `string[]`, `number[]`)

### Requirement: Reuse schema definitions for response types

The system SHALL reuse existing schema definitions for response data types instead of inlining them.

#### Scenario: Response references a schema

- **WHEN** a response schema contains a `$ref` to a type definition
- **THEN** the system SHALL use the referenced type name in the return type
- **AND** NOT inline the type definition

#### Scenario: Response is an array of schema

- **WHEN** a response schema is an array with items referencing a type definition
- **THEN** the system SHALL generate the return type as `ReferencedType[]`
- **AND** ensure the referenced type interface is generated in the namespace

#### Scenario: Nested response types

- **WHEN** a response contains nested objects that reference type definitions
- **THEN** the system SHALL properly reference those types at all nesting levels
- **AND** handle up to 4 levels of nesting correctly

### Scenario: Description not included illegal characters

- **WHEN** path or field has description with illegal characters, like <,\n and more
- **THEN** remove the illegal characters

### Requirement: Array type definitions must use interfaces

The system SHALL generate proper TypeScript interfaces for array item types instead of inline object types.

#### Scenario: Array of objects generates interface

- **WHEN** a schema has `type: "array"` with items of `type: "object"` with properties
- **THEN** the system SHALL generate an interface for the array item type with a meaningful name
- **AND** use that interface name for the array type (e.g., `ItemType[]` instead of `{...}[]`)
- **AND** the interface SHALL be defined in the namespace alongside other interfaces

#### Scenario: Nested arrays

- **WHEN** a schema contains nested arrays (array of arrays)
- **THEN** the system SHALL properly handle each level
- **AND** generate appropriate interfaces for object types at each level

### Requirement: Response types must reuse schema definitions

The system SHALL use existing type definitions for response data instead of generating inline types.

#### Scenario: Response references a single schema

- **WHEN** a response schema has a single `$ref` to a type definition
- **THEN** the function return type SHALL use that interface name directly
- **AND** the format SHALL be `Promise<InterfaceName>`
- **AND** the interface SHALL NOT be inlined in the return type

#### Scenario: Response is an array of schema references

- **WHEN** a response schema has `type: "array"` with items referencing a type definition
- **THEN** the function return type SHALL be `Promise<InterfaceName[]>`
- **AND** the interface SHALL be referenced by name, not inlined

#### Scenario: Response contains nested schema references

- **WHEN** a response has nested objects that reference type definitions at any level
- **THEN** all type definitions SHALL be referenced by their interface names
- **AND** the system SHALL handle up to 4 levels of nesting correctly
