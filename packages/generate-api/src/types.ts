export interface GenerateAPIOptions {
  fileName: string
  url: string
  output: string
  generateJs?: boolean
  generateTs?: boolean
  service?: string
}

export interface Parameter {
  name: string
  type: string
  description?: string
  required: boolean
}

export interface Schema {
  type?: string
  $ref?: string
  properties?: Record<string, Schema>
  required?: string[]
  items?: Schema
  description?: string
}

export interface APIFunctionInfo {
  name: string
  originalMethod: string
  method: string
  path: string
  description?: string
  hasPathParams: boolean
  hasQueryParams: boolean
  hasBody: boolean
  pathParams: Parameter[]
  queryParams: Parameter[]
  bodySchema?: Schema
  responseSchema?: Schema
  responseType?: string
}

export interface SpecVersion {
  type: 'swagger2' | 'openapi3'
}

export interface ExtractedParams {
  path: Parameter[]
  query: Parameter[]
  body?: Schema
}
