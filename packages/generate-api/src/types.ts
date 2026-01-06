/**
 * API 路径信息
 */
export interface APIPathInfo {
  name: string
  url: string
  method: string
  description?: string
  summary?: string
  params: string
  data?: string
  jsdoc?: string
  hasPathParams: boolean
  hasQueryParams: boolean
  hasBody: boolean
  hasFormData: boolean
}

/**
 * API 客户端代码生成器的配置选项
 */
export interface GenerateAPIOptions {
  /** OpenAPI/Swagger 规范文件路径 (YAML 或 JSON) */
  openapiSpecPath: string
  /** 生成的 TypeScript 类型文件路径 */
  typesOutputPath: string
  /** TypeScript 版本的 API 客户端代码输出路径 */
  tsApiOutputPath?: string
  /** ESM 版本的 API 客户端代码输出路径 */
  esmApiOutputPath?: string
  /** JSDoc 文档文件输出路径 */
  jsdocOutputPath?: string
  /** 是否在生成前清空输出目录 (默认: false) */
  cleanOutputDir?: boolean
  /** service 导入路径 (默认: 'import service from "@/utils/services"') */
  servicePath?: string
  /** 是否生成请求文档注释 (默认: true) */
  generateRequestDoc?: boolean
}

export interface GenerateCodeOptions {
  typesOutputPath?: string
  apiOutputPath: string
  servicePath: string
}
