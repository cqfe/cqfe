import type { Schema } from './types'
import { sanitizeTypeName } from './naming'

const MAX_DEPTH = 4

export function generateTsType(schema: Schema, depth: number, definitions: Record<string, Schema>): string {
  if (depth >= MAX_DEPTH) return 'any'

  if (schema.$ref) {
    const typeName = extractRefName(schema.$ref)
    return sanitizeTypeName(typeName)
  }

  if (schema.type === 'array' && schema.items) {
    // Check if items is a $ref, use that reference directly
    if (schema.items.$ref) {
      const typeName = extractRefName(schema.items.$ref)
      return `${sanitizeTypeName(typeName)}[]`
    }

    // For primitive arrays or inline objects
    const itemType = generateTsType(schema.items, depth + 1, definitions)
    return `${itemType}[]`
  }

  if (schema.type === 'object') {
    if (schema.properties) {
      const fields = Object.entries(schema.properties)
        .map(([key, val]) => {
          const isOptional = !schema.required?.includes(key)
          const type = generateTsType(val, depth + 1, definitions)
          return `    ${key}${isOptional ? '?' : ''}: ${type}`
        })
        .join('\n')
      return `{\n${fields}\n  }`
    }
    return 'Record<string, any>'
  }

  const typeMap: Record<string, string> = {
    string: 'string',
    integer: 'number',
    number: 'number',
    boolean: 'boolean',
    file: 'File',
  }
  return (schema.type && typeMap[schema.type]) || 'any'
}

function extractRefName(ref: string): string {
  return ref.split('/').pop() || 'any'
}

export function generateInterfaceFields(schema: Schema, definitions: Record<string, Schema>): string {
  if (!schema || !schema.properties) return ''

  const required = schema.required || []
  const properties = schema.properties || {}
  let fields = ''

  Object.entries(properties).forEach(([key, value]: [string, any]) => {
    const isOptional = !required.includes(key)
    const optionalMark = isOptional ? '?' : ''
    const tsType = generateTsType(value, 0, definitions)
    const description = value.description ? ` /** ${value.description} */` : ''
    fields += `    ${key}${optionalMark}: ${tsType}${description}\n`
  })

  return fields
}

export function generateInterface(name: string, schema: Schema, definitions: Record<string, Schema>): string {
  const fields = generateInterfaceFields(schema, definitions)
  return `export interface ${name} {\n${fields}  }\n`
}
