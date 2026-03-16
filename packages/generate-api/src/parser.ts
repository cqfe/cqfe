import type { SpecVersion, ExtractedParams, Schema } from './types'

export function extractParams(operation: any): ExtractedParams {
  const result: ExtractedParams = {
    path: [],
    query: [],
    body: undefined,
  }

  if (operation.parameters) {
    operation.parameters.forEach((param: any) => {
      if (param.in === 'path') {
        result.path.push({
          name: param.name,
          type: mapParamType(param.schema?.type || param.type),
          description: param.description,
          required: param.required || false,
        })
      } else if (param.in === 'query') {
        result.query.push({
          name: param.name,
          type: mapParamType(param.schema?.type || param.type),
          description: param.description,
          required: param.required || false,
        })
      } else if (param.in === 'body') {
        result.body = param.schema
      }
    })
  }

  if (operation.requestBody) {
    const jsonContent = operation.requestBody.content?.['application/json']
    if (jsonContent?.schema) {
      result.body = jsonContent.schema
    }
  }

  return result
}

function mapParamType(type?: string): string {
  if (type === 'integer') return 'number'
  return type || 'any'
}

export function extractResponseSchema(responses: any): Schema | undefined {
  if (!responses) return undefined

  const successResponse = responses['200'] || responses['201'] || responses['204']
  if (!successResponse) return undefined

  if (successResponse.content) {
    const jsonContent = successResponse.content['application/json']
    return jsonContent?.schema || undefined
  }

  if (successResponse.schema) {
    return successResponse.schema
  }

  return undefined
}

export function extractTypeDefinitions(spec: any, version: SpecVersion): Record<string, Schema> {
  const definitions: Record<string, Schema> = {}

  if (version.type === 'swagger2' && spec.definitions) {
    Object.entries(spec.definitions).forEach(([key, value]: [string, any]) => {
      definitions[key] = value
    })
  }

  if (version.type === 'openapi3' && spec.components?.schemas) {
    Object.entries(spec.components.schemas).forEach(([key, value]: [string, any]) => {
      definitions[key] = value
    })
  }

  return definitions
}
