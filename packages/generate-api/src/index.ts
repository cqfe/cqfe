import * as fs from 'fs'
import * as path from 'path'
import SwaggerParse from '@readme/openapi-parser'

import type { GenerateAPIOptions, APIFunctionInfo } from './types'
import { generateFunctionName, toPascalCase, detectSpecVersion } from './naming'
import { extractParams, extractResponseSchema, extractTypeDefinitions } from './parser'
import { generateJS, generateTS, generateDTS } from './generators'

export default async function generateAPIClient(options: GenerateAPIOptions): Promise<void> {
  const {
    fileName,
    url,
    output,
    generateJs = true,
    generateTs = false,
    service = "import service from '@/utils/services'",
  } = options

  console.log('🚀 开始生成 API 客户端...')

  const spec = (await SwaggerParse.dereference(url, {
    resolve: { http: { timeout: 60000 } },
  })) as any

  const specVersion = detectSpecVersion(spec)
  console.log(`📌 检测到规范版本：${specVersion.type === 'openapi3' ? 'OpenAPI 3.x' : 'Swagger 2.x'}`)

  const { paths = {} } = spec
  if (Object.keys(paths).length === 0) {
    console.warn('⚠️  未找到任何 paths，跳过函数生成')
    return
  }

  const existingNames = new Set<string>()
  const apiFunctions: APIFunctionInfo[] = []
  const definitions = extractTypeDefinitions(spec, specVersion)

  Object.keys(paths).forEach((pathUrl) => {
    const pathItem = paths[pathUrl]
    const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace']

    methods.forEach((method) => {
      const operation = pathItem[method]
      if (!operation) return

      const functionName = generateFunctionName(method, pathUrl, existingNames)
      const params = extractParams(operation)
      const responseSchema = extractResponseSchema(operation.responses)

      apiFunctions.push({
        name: functionName,
        originalMethod: method.toUpperCase(),
        method: method.toLowerCase(),
        path: pathUrl,
        description: operation.description || operation.summary,
        hasPathParams: params.path.length > 0,
        hasQueryParams: params.query.length > 0,
        hasBody: params.body !== undefined,
        pathParams: params.path,
        queryParams: params.query,
        bodySchema: params.body,
        responseSchema,
      })
    })
  })

  console.log(`✅ 成功识别到 ${apiFunctions.length} 个 API 函数`)

  // Determine output directory and file name
  const outputIsFile = output.includes('.') && !output.endsWith('.json') && !output.endsWith('.yaml')
  const outputDir = outputIsFile ? path.dirname(output) : output
  const fileBaseName = outputIsFile ? path.basename(output, path.extname(output)) : fileName
  const namespace = toPascalCase(fileBaseName)

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  if (generateJs) {
    const jsPath = path.resolve(outputDir, `${fileBaseName}.js`)
    const jsCode = generateJS(apiFunctions, namespace, service)
    fs.writeFileSync(jsPath, jsCode, 'utf-8')
    console.log(`✅ JS 文件生成成功：${jsPath}`)
  }

  if (generateTs) {
    const tsPath = path.resolve(outputDir, `${fileBaseName}.ts`)
    const tsCode = generateTS(apiFunctions, namespace, service, definitions)
    fs.writeFileSync(tsPath, tsCode, 'utf-8')
    console.log(`✅ TS 文件生成成功：${tsPath}`)
  }
  const dtsPath = path.resolve(outputDir, `${fileBaseName}.d.ts`)
  const dtsCode = generateDTS(apiFunctions, namespace, definitions)
  fs.writeFileSync(dtsPath, dtsCode, 'utf-8')
  console.log(`✅ d.ts 文件生成成功：${dtsPath}`)

  console.log('🎉 API 客户端代码生成成功！')
}
