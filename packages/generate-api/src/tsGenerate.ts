// src/codegen/generate-api.ts

import * as fs from 'fs'
import * as path from 'path'
import * as ejs from 'ejs'
import { fileURLToPath } from 'url'
import SwaggerParse from '@readme/openapi-parser'
import { pick } from 'lodash'

import {
  renderTemplate,
  extractBodyType,
  extractQueryParams,
  extractPathParams,
  createApiFunctionInfo,
  getTsTypeFromSchema,
  getTsTypeFromSchemaType,
} from './codegen-helpers'
import { generateJSDoc, detectSpecVersion, formatVarName } from './utils'
import { APIPathInfo, GenerateAPIOptions, GenerateCodeOptions } from './types'

// 获取 ESM 当前文件 URL
const getESMFileUrl = (): string => {
  // 使用 Function 构造器避免 Jest 解析 import.meta 时报错
  const getMetaUrl = new Function('return import.meta.url') as () => string
  try {
    return getMetaUrl()
  } catch {
    return ''
  }
}

// 模板路径 - 延迟初始化，避免在 Jest 环境中执行 import.meta
let templatesDir: string
let tsTemplatePath: string
let esmTemplatePath: string
let dtsWithDocTemplatePath: string

const initTemplatePaths = () => {
  if (templatesDir) return
  // 使用 __dirname（Jest/编译后）或 import.meta.url（ESM）
  try {
    if (typeof __dirname !== 'undefined') {
      // Jest 或编译后的环境
      if (__dirname === '.' || __dirname === process.cwd()) {
        // Jest 环境
        templatesDir = path.resolve(process.cwd(), 'src/templates')
      } else {
        // 编译后的环境（lib/es 目录）
        templatesDir = path.resolve(__dirname, './templates')
      }
    } else {
      // ESM 环境
      const currentFileUrl = getESMFileUrl()
      if (currentFileUrl) {
        const currentFilePath = fileURLToPath(currentFileUrl)
        templatesDir = path.resolve(path.dirname(currentFilePath), './templates')
      } else {
        templatesDir = path.resolve(process.cwd(), 'src/templates')
      }
    }
    tsTemplatePath = path.resolve(templatesDir, './ts-api-file.ejs')
    esmTemplatePath = path.resolve(templatesDir, './esm-api-file.ejs')
    dtsWithDocTemplatePath = path.resolve(templatesDir, './dts-with-doc.ejs')
  } catch (error) {
    console.error('Failed to init template paths:', error)
    templatesDir = path.resolve(process.cwd(), 'src/templates')
  }
}

const existingNames = new Set<string>()

/**
 * 检查并准备输出路径
 */
function checkOutputPath({
  typesOutputPath,
  tsApiOutputPath,
  esmApiOutputPath,
  jsdocOutputPath,
  cleanOutputDir,
}: Record<string, any>) {
  const paths = [typesOutputPath, tsApiOutputPath, esmApiOutputPath, jsdocOutputPath].filter(Boolean) as string[]
  paths.forEach((p) => fs.mkdirSync(path.dirname(p), { recursive: true }))

  if (cleanOutputDir) {
    const dirs = [...new Set(paths.map((p) => path.dirname(p)))]
    dirs.forEach((dir) => {
      console.log(`🧹 正在清空输出目录：${dir}`)
      fs.rmSync(dir, { recursive: true, force: true })
      fs.mkdirSync(dir, { recursive: true })
    })
  }
}

/**
 * 生成 TypeScript 代码
 */
function generateTypescriptCode(
  apiFunctions: APIPathInfo[],
  paths: Record<string, any>,
  { apiOutputPath: tsApiOutputPath, servicePath, typesOutputPath = 'types.d.ts' }: GenerateCodeOptions,
) {
  console.log('📝 正在生成 TypeScript 版本的 API 函数...')
  // 使用文件名生成 namespace 名称
  const namespaceName = formatVarName(path.basename(typesOutputPath, '.d.ts'), true)

  let tsGeneratedCode = `/**\n * API 类型定义和函数声明\n * Auto generate by @cqfe/generate-api, do not modify\n */\n${servicePath}`

  apiFunctions.forEach((api) => {
    const operation = paths[api.url][api.method.toLowerCase()]
    const apiNameLower = api.name.charAt(0).toLowerCase() + api.name.slice(1)
    const jsdoc = generateJSDoc(
      operation?.description ?? api.description,
      operation?.summary ?? api.summary,
      operation?.parameters || [],
      operation?.requestBody,
      apiNameLower,
      namespaceName,
    )

    const templateData = {
      api: {
        name: api.name,
        url: api.url.includes('{')
          ? `\`${api.url.replace(/{([^}]+)}/g, (_, key) => '${path.' + key.replace(/[^a-zA-Z0-9_]/g, '') + '}')}\``
          : `'${api.url}'`,
        method: api.method,
        params: api.params,
        data: api.data,
        hasPathParams: api.hasPathParams,
        hasQueryParams: api.hasQueryParams,
        hasBody: api.hasBody,
        apiNameLower,
        namespaceName,
      },
      jsdoc,
    }

    tsGeneratedCode += renderTemplate(tsTemplatePath, templateData) + '\n'
  })

  fs.writeFileSync(tsApiOutputPath, tsGeneratedCode, 'utf8')
  console.log(`✅ TypeScript 版本生成成功：${tsApiOutputPath}`)
}

/**
 * 生成 ESM 代码
 */
function generateEsmCode(
  apiFunctions: APIPathInfo[],
  paths: Record<string, any>,
  { apiOutputPath: esmApiOutputPath, servicePath, typesOutputPath = 'types.d.ts' }: GenerateCodeOptions,
) {
  console.log('📝 正在生成 ESM 版本的 API 函数...')

  // 使用文件名生成 namespace 名称
  const typeFileName = path.basename(typesOutputPath, '.d.ts')
  const namespaceName = formatVarName(path.basename(typesOutputPath, '.d.ts'), true)

  // 只在文件头部添加一次 @typedef
  let esmGeneratedCode = `/**\n * API 类型定义和函数声明\n * Auto generate by @cqfe/generate-api, do not modify\n */\n/** @typedef {import('./${typeFileName}.d'）} ${namespaceName} */\n${servicePath}\n`

  apiFunctions.forEach((api) => {
    const operation = paths[api.url][api.method.toLowerCase()]
    const apiNameLower = api.name.charAt(0).toLowerCase() + api.name.slice(1)
    const jsdoc = generateJSDoc(
      operation?.description ?? api.description,
      operation?.summary ?? api.summary,
      operation?.parameters || [],
      operation?.requestBody,
      apiNameLower,
      namespaceName,
    )

    const templateData = {
      api: {
        name: api.name,
        url: api.url.includes('{')
          ? `\`${api.url.replace(/{([^}]+)}/g, (_, key) => '${path.' + key.replace(/[^a-zA-Z0-9_]/g, '') + '}')}\``
          : `'${api.url}'`,
        method: api.method,
        params: api.params,
        data: api.data,
      },
      jsdoc,
      hasPathParams: api.hasPathParams,
      hasQueryParams: api.hasQueryParams,
      hasBody: api.hasBody,
    }

    esmGeneratedCode += renderTemplate(esmTemplatePath, templateData)
  })

  fs.writeFileSync(esmApiOutputPath, esmGeneratedCode, 'utf8')
  console.log(`✅ ESM 版本生成成功：${esmApiOutputPath}`)
}

/**
 * 生成 DTS 代码（铺平的类型定义 + 函数声明）
 */
function generateDTsCode(apiFunctions: APIPathInfo[], typesOutputPath: string, paths: Record<string, any>) {
  const templateContent = fs.readFileSync(dtsWithDocTemplatePath, 'utf8')

  // 使用文件名生成 namespace 名称
  const namespaceName = formatVarName(path.basename(typesOutputPath, '.d.ts'), true)

  // 首先写入 namespace 开始部分
  fs.writeFileSync(typesOutputPath, '')

  apiFunctions.forEach((api, index) => {
    const operation = paths[api.url][api.method.toLowerCase()]
    const apiNameLower = api.name.charAt(0).toLowerCase() + api.name.slice(1)

    // 生成 Body 类型字段
    let bodyFields = ''
    if (api.hasBody) {
      const bodyType = extractBodyType(operation)
      if (bodyType) {
        bodyFields = generateInterfaceFields(bodyType)
      }
    }

    // 生成 Query 类型字段
    let queryFields = ''
    if (api.hasQueryParams) {
      const queryParams = extractQueryParams(operation)
      if (queryParams.length > 0) {
        queryFields = generateInterfaceFieldsFromParams(queryParams)
      }
    }

    // 生成 Path 类型字段
    let pathFields = ''
    if (api.hasPathParams) {
      const pathParams = extractPathParams(operation)
      if (pathParams.length > 0) {
        pathFields = generateInterfaceFieldsFromParams(pathParams)
      }
    }

    // 生成函数声明
    const jsdoc = generateJSDoc(
      operation?.description ?? api.description,
      operation?.summary ?? api.summary,
      operation?.parameters || [],
      operation?.requestBody,
      apiNameLower,
      namespaceName,
    )

    const templateData = {
      ...pick(api, ['name', 'method', 'hasPathParams', 'hasQueryParams', 'hasBody', 'hasFormData', 'url']),
      description: api.description || api.summary || '',
      jsdoc: jsdoc
        .replace(/\n \*\s*/g, '\n * ')
        .replace('/**\n * ', '')
        .replace('\n */', ''),
      bodyFields,
      queryFields,
      pathFields,
      namespaceName,
      isFirst: index === 0,
      isLast: index === apiFunctions.length - 1,
    }

    const functionCode = ejs.render(templateContent, templateData, { root: path.dirname(dtsWithDocTemplatePath) })
    fs.appendFileSync(typesOutputPath, functionCode)
  })
}

/**
 * 从 JSON Schema 生成 interface 字段
 */
function generateInterfaceFields(schema: any): string {
  if (!schema || schema.type !== 'object' || !schema.properties) return ''

  const required: string[] = schema.required || []
  const properties = schema.properties || {}
  let fields = ''

  Object.entries(properties).forEach(([key, value]: [string, any]) => {
    const isOptional = !required.includes(key)
    const optionalMark = isOptional ? '?' : ''
    const tsType = getTsTypeFromSchema(value)
    const description = value.description ? ` /** ${value.description} */` : ''
    fields += `    ${key}${optionalMark}: ${tsType}${description}\n`
  })

  return fields
}

/**
 * 从参数列表生成 interface 字段
 */
function generateInterfaceFieldsFromParams(params: any[]): string {
  let fields = ''

  params.forEach((param) => {
    const schema = param.schema || param
    const tsType = getTsTypeFromSchemaType(schema.type)
    const description = param.description ? ` /** ${param.description} */` : ''
    fields += `    ${param.name}: ${tsType}${description}\n`
  })

  return fields
}

/**
 * 根据 OpenAPI/Swagger 规范生成 TypeScript API 客户端
 */
export async function generateAPIClient(options: GenerateAPIOptions): Promise<void> {
  // 初始化模板路径
  initTemplatePaths()

  console.log('🚀 开始生成 API 客户端...')

  const output = (options.output || options.tsOutput) as string
  const fileName = path.basename(output)
  const pathName = path.dirname(output)
  const typesOutputPath = path.join(pathName, `${fileName.split('.')[0]}.d.ts`)
  const {
    url: openapiSpecPath,
    tsOutput: tsApiOutputPath,
    output: esmApiOutputPath,
    service: servicePath = "import service from 'xxxx'",
  } = options

  checkOutputPath({ ...options, typesOutputPath })

  try {
    // 步骤 1: 解析 OpenAPI/Swagger 规范
    console.log(`📖 正在解析 OpenAPI/Swagger 规范 ${openapiSpecPath}...`)
    const spec = (await SwaggerParse.dereference(openapiSpecPath, {
      resolve: { http: { timeout: 60000 } },
    })) as any

    const specVersion = detectSpecVersion(spec)
    console.log(`📌 检测到规范版本：${specVersion === 'openapi3' ? 'OpenAPI 3.x' : 'Swagger 2.x'}`)

    const { paths = {} } = spec
    if (Object.keys(paths).length === 0) {
      console.warn('⚠️  未找到任何 paths，跳过函数生成')
      return
    }

    // 步骤 2: 生成 API 函数
    console.log(`🔄 正在遍历 ${Object.keys(paths).length} 个 paths...`)
    const apiFunctions: APIPathInfo[] = []

    Object.keys(paths).forEach((pathUrl) => {
      const pathItem = paths[pathUrl]
      const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace']

      methods.forEach((method) => {
        const operation = pathItem[method]
        if (!operation) return

        apiFunctions.push(createApiFunctionInfo(pathUrl, method, operation, specVersion, existingNames))
      })
    })

    console.log(`✅ 成功识别到 ${apiFunctions.length} 个 API 函数。`)

    // 步骤 3: 生成 DTS（铺平的类型定义 + 函数声明）
    generateDTsCode(apiFunctions, typesOutputPath, paths)

    // 步骤 4: 生成 TypeScript 版本
    if (tsApiOutputPath) {
      generateTypescriptCode(apiFunctions, paths, { typesOutputPath, apiOutputPath: tsApiOutputPath, servicePath })
    }

    // 步骤 5: 生成 ESM 版本
    if (esmApiOutputPath) {
      generateEsmCode(apiFunctions, paths, { apiOutputPath: esmApiOutputPath, servicePath, typesOutputPath })
    }

    console.log('🎉 API 客户端代码生成成功！')
  } catch (error) {
    console.error('❌ 代码生成过程中发生错误:', (error as Error).message)
    throw error
  }
}
