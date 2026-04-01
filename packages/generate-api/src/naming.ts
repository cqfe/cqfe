import type { SpecVersion } from './types'

const ILLEGAL_CHARS = /[\.{}\/<>«»\$\s]/g

function segmentToPascalCase(segment: string): string {
  let cleaned = segment.replace(ILLEGAL_CHARS, '')
  if (!cleaned) return ''
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
  cleaned = cleaned.replace(/[_-]([a-zA-Z0-9])/g, (_, p1) => p1.toUpperCase())
  return cleaned
}

export function generateFunctionName(method: string, path: string, existingNames: Set<string>): string {
  const methodLower = method.toLowerCase()
  const segments = path.replace(/^\/|\/$/g, '').split('/')
  const pascalSegments = segments.map(segmentToPascalCase)
  let name = methodLower + pascalSegments.join('')

  while (!/^.+[a-zA-Z0-9]$/.test(name)) {
    name = name.slice(0, -1)
  }

  if (existingNames.has(name)) {
    let index = 2
    let conflictName = `${name}V${index}`
    while (existingNames.has(conflictName)) {
      index++
      conflictName = `${name}V${index}`
    }
    name = conflictName
  }

  existingNames.add(name)
  return name
}

export function toPascalCase(str: string): string {
  if (!str) return ''
  let result = str.charAt(0).toUpperCase() + str.slice(1)
  result = result.replace(/[-_]([a-z|A-Z|0-9])/g, (_, p1) => p1.toUpperCase())
  result = result.replace(/[-_]/g, '')
  return result
}

export function sanitizeTypeName(name: string): string {
  return name.replace(/[«»<>]/g, '').replace(/\s+/g, '')
}

export function sanitizeParamName(name: string): string {
  return name.replace(ILLEGAL_CHARS, '')
}

export function generateUrlTemplate(path: string, hasPathParams: boolean): string {
  if (!hasPathParams) {
    return `'${path}'`
  }

  const template = path.replace(/\{([^}]+)\}/g, (_, paramName) => `\${path.${sanitizeParamName(paramName)}}`)

  return `\`${template}\``
}

export function detectSpecVersion(spec: any): SpecVersion {
  if (spec.openapi && spec.openapi.startsWith('3')) {
    return { type: 'openapi3' }
  }
  if (spec.swagger && spec.swagger.startsWith('2')) {
    return { type: 'swagger2' }
  }
  return { type: 'openapi3' }
}

export function generateJSDoc(description?: string, summary?: string): string {
  const desc = description || summary || ''
  if (!desc) return ''
  return `// ${desc.replace(/\n/g, '')}`
}
