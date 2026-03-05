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
 * format variable name
 */

export function formatVarName(str: string, capitalizeFirst: boolean = false) {
  // 去除字符串两端的空白字符
  let validStr = str.trim()
  // 将非字母、数字、下划线、美元符号的字符替换为下划线
  validStr = validStr.replace(/[^\w$]/g, '')
  // 如果是以数字开头，在前面添加下划线
  if (/^\d/.test(validStr)) {
    validStr = '_' + validStr
  }
  // 如果 capitalizeFirst 为 true，大写首字母
  if (capitalizeFirst && validStr.length > 0) {
    validStr = validStr.charAt(0).toUpperCase() + validStr.slice(1)
  }
  return validStr
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
 * @param description - 描述
 * @param summary - 摘要
 * @param parameters - 参数列表
 * @param requestBody - 请求体
 * @param apiNameLower - API 函数名（小写首字母），用于类型引用
 * @param namespaceName - Namespace 名称
 */
export function generateJSDoc(
  description: string | undefined,
  summary: string | undefined,
  parameters: any[] = [],
  requestBody?: any,
  apiNameLower?: string,
  namespaceName: string = 'ApiTypes',
): string {
  const desc = description || summary || ''
  let doc = `\n/**\n * ${desc}`

  // 归类 path/query/formData/body 参数
  const pathParams = parameters.filter((p) => p.in === 'path')
  const queryParams = parameters.filter((p) => p.in === 'query')
  const formDataParams = parameters.filter((p) => p.in === 'formData')
  // Swagger 2.0 的 body 参数
  const bodyParams = parameters.filter((p) => p.in === 'body')

  // 使用类型引用而不是展开字段
  if (pathParams.length && apiNameLower) {
    doc += `\n * @param {${namespaceName}.${apiNameLower}Path} path - 路径参数`
  } else if (pathParams.length) {
    doc += '\n * @param {Object} path - 路径参数'
  }

  if (queryParams.length && apiNameLower) {
    doc += `\n * @param {${namespaceName}.${apiNameLower}Query} query - 查询参数`
  } else if (queryParams.length) {
    doc += '\n * @param {Object} query - 查询参数'
  }

  // 处理 requestBody（OpenAPI 3）或 formData/body（Swagger 2）
  if ((requestBody || formDataParams.length || bodyParams.length) && apiNameLower) {
    doc += `\n * @param {${namespaceName}.${apiNameLower}Body} body - 请求体数据`
  } else if (requestBody || formDataParams.length || bodyParams.length) {
    doc += '\n * @param {Object} body - 请求体数据'
  }

  doc += '\n * @param {Object} [options] - Axios 请求配置选项'
  doc += '\n * @returns {Promise<any>} API 响应数据'
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
