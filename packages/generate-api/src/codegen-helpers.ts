/**
 * 代码生成辅助函数
 */

import * as fs from 'fs'
import * as path from 'path'
import * as ejs from 'ejs'

import type { APIPathInfo } from './types'
import { resolveName } from './resolve'
import { parseParameters, normalizeSwagger2Operation } from './utils'

/**
 * 从 JSON Schema 类型字符串获取 TypeScript 类型
 */
export function getTsTypeFromSchemaType(type?: string): string {
  switch (type) {
    case 'string':
      return 'string'
    case 'number':
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'array':
      return 'any[]'
    case 'object':
      return 'Record<string, any>'
    default:
      return 'any'
  }
}

/**
 * 从 JSON Schema 获取 TypeScript 类型
 */
export function getTsTypeFromSchema(schema: any): string {
  if (!schema) return 'any'

  if (schema.$ref) {
    return schema.$ref.split('/').pop() || 'any'
  }

  if (schema.type === 'array') {
    const itemType = schema.items?.$ref
      ? schema.items.$ref.split('/').pop()
      : getTsTypeFromSchemaType(schema.items?.type)
    return `${itemType}[]`
  }

  if (schema.type === 'object') {
    return 'Record<string, any>'
  }

  return getTsTypeFromSchemaType(schema.type)
}

/**
 * 从 operation 中提取 Body 类型定义
 */
export function extractBodyType(operation: any): any {
  // OpenAPI 3.0: 从 requestBody 中提取
  if (operation?.requestBody) {
    return (
      operation.requestBody.content?.['application/json']?.schema ||
      operation.requestBody.content?.['multipart/form-data']?.schema
    )
  }

  // Swagger 2.0: 从 parameters 中提取 in: body 参数
  if (operation?.parameters) {
    const bodyParam = operation.parameters.find((p: any) => p.in === 'body')
    if (bodyParam && bodyParam.schema) {
      return bodyParam.schema
    }
  }

  return null
}

/**
 * 从 operation 中提取 Query 参数
 */
export function extractQueryParams(operation: any): any[] {
  if (!operation?.parameters) return []
  return operation.parameters.filter((p: any) => p.in === 'query')
}

/**
 * 从 operation 中提取 Path 参数
 */
export function extractPathParams(operation: any): any[] {
  if (!operation?.parameters) return []
  return operation.parameters.filter((p: any) => p.in === 'path')
}

/**
 * 生成 API 函数信息
 */
export function createApiFunctionInfo(
  pathUrl: string,
  method: string,
  operation: any,
  specVersion: string,
  existingNames: Set<string>,
): APIPathInfo {
  // 处理 Swagger 2.x
  if (specVersion === 'swagger2') {
    operation = normalizeSwagger2Operation(operation)
  }

  const { summary, description, parameters = [], requestBody } = operation

  // 解析参数
  const paramInfo = parseParameters(parameters, requestBody)

  // 生成函数名
  const functionName = resolveName(method.toLowerCase(), pathUrl, existingNames)

  // 生成参数列表
  const params = paramInfo.params

  // 确定 data 参数
  let dataParam: string | undefined
  if (paramInfo.hasBody) {
    dataParam = 'body'
  }

  return {
    name: functionName,
    url: pathUrl,
    method: method.toUpperCase(),
    description: description || summary,
    summary,
    params,
    data: dataParam,
    hasPathParams: paramInfo.hasPathParams,
    hasQueryParams: paramInfo.hasQueryParams,
    hasBody: paramInfo.hasBody,
    hasFormData: paramInfo.hasFormData,
  }
}

/**
 * 渲染 EJS 模板
 */
export function renderTemplate(templatePath: string, templateData: Record<string, any>): string {
  const templateContent = fs.readFileSync(templatePath, 'utf8')
  return ejs.render(templateContent, templateData, {
    root: path.dirname(templatePath),
  })
}

/**
 * 获取模板目录路径（兼容 ESM 和 CommonJS）
 */
// export function getTemplatesDir(): string {
//   // CommonJS 环境
//   if (typeof __dirname !== 'undefined') {
//     return path.resolve(__dirname, './templates')
//   }

//   // ESM 环境 - 使用 Function 构造器避免 Jest 解析错误
//   try {
//     const getMetaUrl = new Function('return import.meta.url') as () => string
//     const metaUrl = getMetaUrl()
//     const moduleRequire = createRequire(metaUrl)
//     return path.dirname(moduleRequire.resolve('./templates/dts-with-doc.ejs'))
//   } catch {
//     return process.cwd()
//   }
// }
