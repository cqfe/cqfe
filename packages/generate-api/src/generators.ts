import * as fs from 'fs'
import * as path from 'path'
import * as ejs from 'ejs'
import { fileURLToPath } from 'url'

import type { APIFunctionInfo, Schema } from './types'
import { generateJSDoc, generateUrlTemplate, sanitizeTypeName } from './naming'
import { generateTsType, generateInterfaceFields } from './typescript'

const getTemplatesDir = (): string => {
  if (typeof __dirname !== 'undefined') {
    if (__dirname === '.' || __dirname === process.cwd()) {
      return path.resolve(process.cwd(), 'src/templates')
    }
    return path.resolve(__dirname, './templates')
  }

  try {
    const getMetaUrl = new Function('return import.meta.url') as () => string
    const currentFileUrl = getMetaUrl()
    if (currentFileUrl) {
      const currentFilePath = fileURLToPath(currentFileUrl)
      return path.resolve(path.dirname(currentFilePath), './templates')
    }
  } catch {
    // ignore
  }

  return path.resolve(process.cwd(), 'src/templates')
}

function renderTemplate(templateName: string, data: Record<string, any>): string {
  const templatesDir = getTemplatesDir()
  const templatePath = path.resolve(templatesDir, templateName)
  const templateContent = fs.readFileSync(templatePath, 'utf8')
  return ejs.render(templateContent, data, { root: templatesDir })
}

export function generateJS(apiFunctions: APIFunctionInfo[], namespace: string, service: string): string {
  let code = `${service}\n`

  apiFunctions.forEach((api) => {
    const params = buildParams(api, namespace, false)
    const jsdoc = generateJSDoc(api.description)
    const url = generateUrlTemplate(api.path, api.hasPathParams)

    const templateData = {
      api: {
        ...api,
        params,
        url,
      },
      jsdoc,
    }

    code += renderTemplate('js-api.ejs', templateData) + '\n'
  })

  return code
}

export function generateTS(
  apiFunctions: APIFunctionInfo[],
  namespace: string,
  service: string,
  definitions: Record<string, Schema>,
  fileBaseName: string,
): string {
  let code = `${service}  \nimport type { ${namespace} } from './${fileBaseName}.d'\n`

  apiFunctions.forEach((api) => {
    const params = buildParams(api, namespace, true)
    const jsdoc = generateJSDoc(api.description)
    const url = generateUrlTemplate(api.path, api.hasPathParams)
    const responseType = generateResponseType(api, namespace, definitions)

    const templateData = {
      api: {
        ...api,
        params,
        url,
        responseType,
      },
      jsdoc,
    }

    code += renderTemplate('ts-api.ejs', templateData) + '\n'
  })

  return code
}

export function generateDTS(
  apiFunctions: APIFunctionInfo[],
  namespace: string,
  definitions: Record<string, Schema>,
): string {
  let interfaces = ''
  let functionDeclarations = ''

  const usedTypes = new Set<string>()

  apiFunctions.forEach((api) => {
    const apiNameLower = api.name.charAt(0).toLowerCase() + api.name.slice(1)

    if (api.hasPathParams) {
      interfaces += generateParameterInterface(`${api.name}Path`, api.pathParams) + '\n'
    }
    if (api.hasQueryParams) {
      interfaces += generateParameterInterface(`${api.name}Query`, api.queryParams) + '\n'
    }
    if (api.hasBody && api.bodySchema) {
      interfaces += generateInterfaceFromSchema(`${api.name}Body`, api.bodySchema) + '\n'
    }

    if (api.responseSchema) {
      const responseType = generateTsType(api.responseSchema, 0, definitions)
      functionDeclarations += `  export function ${api.name}(${buildTypeParams(api, namespace, apiNameLower)}): Promise<${responseType}>\n`
    } else {
      functionDeclarations += `  export function ${api.name}(${buildTypeParams(api, namespace, apiNameLower)}): Promise<any>\n`
    }

    collectTypeReferences(api.responseSchema, definitions, usedTypes)
  })

  const typeDefinitions = generateTypeDefinitions(usedTypes, definitions)

  return renderTemplate('dts.ejs', {
    namespace,
    interfaces: interfaces + typeDefinitions,
    functionDeclarations,
  })
}

function buildParams(api: APIFunctionInfo, namespace: string, isTypeScript: boolean): string {
  const params: string[] = []

  if (api.hasPathParams) {
    const apiNameLower = api.name.charAt(0).toLowerCase() + api.name.slice(1)
    if (isTypeScript) {
      params.push(`path: ${namespace}.${apiNameLower}Path`)
    } else {
      params.push('path')
    }
  }
  if (api.hasQueryParams) {
    const apiNameLower = api.name.charAt(0).toLowerCase() + api.name.slice(1)
    if (isTypeScript) {
      params.push(`query: ${namespace}.${apiNameLower}Query`)
    } else {
      params.push('query')
    }
  }
  if (api.hasBody) {
    const apiNameLower = api.name.charAt(0).toLowerCase() + api.name.slice(1)
    if (isTypeScript) {
      params.push(`body: ${namespace}.${apiNameLower}Body`)
    } else {
      params.push('body')
    }
  }

  if (isTypeScript) {
    params.push(`options: ${namespace}.Obj = {}`)
  } else {
    params.push('options = {}')
  }

  return params.join(', ')
}

function buildTypeParams(api: APIFunctionInfo, namespace: string, _apiNameLower: string): string {
  const params: string[] = []

  if (api.hasPathParams) {
    params.push(`path: ${namespace}.${api.name}Path`)
  }
  if (api.hasQueryParams) {
    params.push(`query: ${namespace}.${api.name}Query`)
  }
  if (api.hasBody) {
    params.push(`body: ${namespace}.${api.name}Body`)
  }
  params.push(`options?: ${namespace}.Obj`)

  return params.join(', ')
}

function generateResponseType(api: APIFunctionInfo, _namespace: string, definitions: Record<string, Schema>): string {
  if (!api.responseSchema) {
    return 'any'
  }

  const schema = api.responseSchema

  // If it's a $ref, use the referenced type name directly
  if (schema.$ref) {
    const typeName = schema.$ref.split('/').pop() || 'any'
    return sanitizeTypeName(typeName)
  }

  // If it's an array with $ref items, use TypeName[]
  if (schema.type === 'array' && schema.items) {
    if (schema.items.$ref) {
      const typeName = schema.items.$ref.split('/').pop() || 'any'
      return `${sanitizeTypeName(typeName)}[]`
    }
    // For inline array items, use generateTsType
    const itemType = generateTsType(schema.items, 0, definitions)
    return `${itemType}[]`
  }

  // For complex inline types, use generateTsType
  return generateTsType(schema, 0, definitions)
}

function generateParameterInterface(name: string, params: any[]): string {
  if (!params || params.length === 0) return ''

  const fields = params
    .map((p) => {
      const description = p.description ? ` /** ${p.description} */` : ''
      return `    ${p.name}: ${p.type}${description}`
    })
    .join('\n')

  return `export interface ${name} {\n${fields}\n  }`
}

function generateInterfaceFromSchema(name: string, schema: Schema, definitions: Record<string, Schema> = {}): string {
  if (!schema) return ''

  const fields = generateInterfaceFields(schema, definitions)
  return `export interface ${name} {\n${fields}  }`
}

function collectTypeReferences(
  schema: Schema | undefined,
  definitions: Record<string, Schema>,
  usedTypes: Set<string>,
  visitedSchemas: Set<string> = new Set(),
  depth: number = 0,
) {
  if (!schema || depth > 10) return

  if (schema.$ref) {
    const typeName = schema.$ref.split('/').pop()
    if (typeName) {
      usedTypes.add(typeName)
      if (!visitedSchemas.has(schema.$ref)) {
        visitedSchemas.add(schema.$ref)
        const referencedSchema = definitions[typeName]
        if (referencedSchema) {
          collectTypeReferences(referencedSchema, definitions, usedTypes, visitedSchemas, depth + 1)
        }
      }
    }
    return
  }

  if (schema.items) {
    collectTypeReferences(schema.items, definitions, usedTypes, visitedSchemas, depth + 1)
  }

  if (schema.properties) {
    Object.values(schema.properties).forEach((value) => {
      collectTypeReferences(value, definitions, usedTypes, visitedSchemas, depth + 1)
    })
  }
}

function generateTypeDefinitions(usedTypes: Set<string>, definitions: Record<string, Schema>): string {
  let code = ''

  usedTypes.forEach((typeName) => {
    const schema = definitions[typeName]
    if (schema) {
      const fields = generateInterfaceFields(schema, definitions)
      code += `  export interface ${typeName} {\n${fields}  }\n`
    }
  })

  return code
}
