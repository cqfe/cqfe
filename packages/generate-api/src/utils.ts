import { existsSync, rmSync, writeFileSync } from 'fs'

// split by string and convert to camelCase
export function toCamelCase(str: string) {
  return str
    .replace(/{/g, '')
    .replace(/}/g, '')
    .replace(/[-_/]([a-z|A-Z|0-9])/g, (match, p1) => p1.toUpperCase())
}

// init output file in disk
export function initOutPutFile(outPut: string, servicePath: string) {
  const isExits = existsSync(outPut)
  if (isExits) rmSync(outPut, { recursive: true })
  writeFileSync(outPut, `${servicePath}\n`)
}

export function formatVarName(str: string) {
  // 去除字符串两端的空白字符
  let validStr = str.trim()
  // 将非字母、数字、下划线、美元符号的字符替换为下划线
  validStr = validStr.replace(/[^\w$]/g, '')
  // 如果是以数字开头，在前面添加下划线
  if (/^\d/.test(validStr)) {
    validStr = '_' + validStr
  }
  return validStr
}
/**
 * 生成 URL，处理路径参数
 */
export function generateUrl(url: string, hasPathParams: boolean): string {
  if (hasPathParams && url.includes('{')) {
    return `\`${url.replace(/{([^}]+)}/g, (_, key) => '${path.' + formatVarName(key) + '}')}\``
  }
  return `'${url}'`
}
/**
 * 解析请求参数，生成函数参数列表
 */
export function parseParameters(parameters: any[] = [], requestBody?: any) {
  const params: string[] = []
  const pathParams: string[] = []
  const queryParams: string[] = []
  let hasBody = false
  let hasFormData = false

  parameters.forEach((param) => {
    switch (param.in) {
      case 'path':
        pathParams.push(param.name)
        break
      case 'query':
        queryParams.push(param.name)
        break
      case 'body':
      case 'formData':
        hasBody = true
        break
    }
  })

  if (requestBody) {
    hasBody = true
  }
  if (requestBody?.content?.['multipart/form-data']) {
    hasFormData = true
  }

  if (pathParams.length > 0) {
    params.push('path')
  }
  if (queryParams.length > 0) {
    params.push('query')
  }
  if (hasBody) {
    params.push('body')
  }
  params.push('options = {}')

  return {
    params: params.join(', '),
    hasPathParams: pathParams.length > 0,
    hasQueryParams: queryParams.length > 0,
    hasBody,
    hasFormData,
    pathParams,
    queryParams,
  }
}

/**
 * 检测 OpenAPI 规范版本
 */
export function detectSpecVersion(spec: any): 'openapi3' | 'swagger2' {
  if (spec.openapi && spec.openapi.startsWith('3')) {
    return 'openapi3'
  }
  if (spec.swagger && spec.swagger.startsWith('2')) {
    return 'swagger2'
  }
  // 默认按 OpenAPI 3 处理
  return 'openapi3'
}

/**
 * 生成 JSDoc 注释
 */
export function generateJSDoc(
  description: string | undefined,
  summary: string | undefined,
  parameters: any[] = [],
  requestBody?: any,
  moduleName?: string,
): string {
  const desc = description || summary || ''
  let doc = `\n/**\n * ${desc}`
  if (moduleName) {
    doc += `\n * @see module:${moduleName}`
  }
  // 提取类型字符串的帮助函数
  const getTypeString = (schema: any): string => {
    if (!schema) return 'any'
    const type = schema.type
    if (type === 'array') {
      const itemType = getTypeString(schema.items)
      return `${itemType}[]`
    }
    if (type === 'object') {
      return 'object'
    }
    if (type) return type
    // OpenAPI 可能只有 $ref，已被 dereference 展开后仍可能缺少 type
    if (schema.enum) return 'enum'
    return 'any'
  }

  // 归类 path/query/formData 参数
  const pathParams = parameters.filter((p) => p.in === 'path')
  const queryParams = parameters.filter((p) => p.in === 'query')
  const formDataParams = parameters.filter((p) => p.in === 'formData')

  if (pathParams.length) {
    doc += '\n * @param {Object} path - 路径参数'
    pathParams.forEach((param) => {
      const paramDesc = param.description || ''
      const paramType = getTypeString(param.schema ?? param)
      doc += `\n * @param {${paramType}} path.${param.name} - ${paramDesc}`
    })
  }

  if (queryParams.length) {
    doc += '\n * @param {Object} query - 查询参数'
    queryParams.forEach((param) => {
      const paramDesc = param.description || ''
      const paramType = getTypeString(param.schema ?? param)
      doc += `\n * @param {${paramType}} query.${param.name} - ${paramDesc}`
    })
  }

  // 处理 requestBody（OpenAPI 3）或 formData/body（Swagger 2）
  let hasBodyDetails = false
  const bodyProps: Array<{ name: string; type: string; desc: string; required?: boolean }> = []

  // OpenAPI 3: 从 content 中提取 schema
  if (requestBody && requestBody.content) {
    const content =
      requestBody.content['application/json'] ||
      requestBody.content['application/x-www-form-urlencoded'] ||
      Object.values(requestBody.content)[0]
    const schema = content?.schema
    if (schema) {
      const required: string[] = Array.isArray(schema.required) ? schema.required : []
      if (schema.type === 'object' && schema.properties) {
        Object.keys(schema.properties).forEach((key) => {
          const prop = schema.properties[key]
          bodyProps.push({
            name: key,
            type: getTypeString(prop),
            desc: prop?.description || '',
            required: required.includes(key),
          })
        })
      } else {
        // 非 object，直接描述 body 类型
        bodyProps.push({ name: '', type: getTypeString(schema), desc: schema.description || '' })
      }
      hasBodyDetails = bodyProps.length > 0
    }
  }

  // Swagger 2: formData 作为 body 字段；in: 'body' 作为整体 body
  if (formDataParams.length) {
    formDataParams.forEach((param) => {
      bodyProps.push({
        name: param.name,
        type: getTypeString(param.schema ?? param),
        desc: param.description || '',
        required: !!param.required,
      })
    })
    hasBodyDetails = bodyProps.length > 0
  }
  const bodyParam = parameters.find((p) => p.in === 'body')
  if (bodyParam && bodyParam.schema) {
    const schema = bodyParam.schema
    const required: string[] = Array.isArray(schema.required) ? schema.required : []
    if (schema.type === 'object' && schema.properties) {
      Object.keys(schema.properties).forEach((key) => {
        const prop = schema.properties[key]
        bodyProps.push({
          name: key,
          type: getTypeString(prop),
          desc: prop?.description || '',
          required: required.includes(key),
        })
      })
    } else {
      bodyProps.push({ name: '', type: getTypeString(schema), desc: schema.description || '' })
    }
    hasBodyDetails = bodyProps.length > 0
  }

  if (requestBody || formDataParams.length || bodyParam) {
    doc += '\n * @param {Object} body - 请求体'
  }
  if (hasBodyDetails) {
    bodyProps.forEach((prop) => {
      const label = prop.name ? `body.${prop.name}` : 'body'
      const extra = prop.required ? '（必填）' : ''
      doc += `\n * @param {${prop.type}} ${label} - ${prop.desc}${extra}`
    })
  }

  doc += '\n */'
  return doc
}

/**
 * 处理 Swagger 2.x 的 requestBody（转换为 parameters）
 */
export function normalizeSwagger2Operation(operation: any): any {
  if (operation.parameters) {
    // Swagger 2.x 中 body 参数在 parameters 中
    return operation
  }
  return operation
}
