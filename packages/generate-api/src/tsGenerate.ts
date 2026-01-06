// src/codegen/generate-api.ts

import * as fs from 'fs'
import * as path from 'path'
import * as ejs from 'ejs'
import openapiTS, { astToString } from 'openapi-typescript'
import SwaggerParse from '@readme/openapi-parser'
import { detectSpecVersion, generateUrl, parseParameters, generateJSDoc, normalizeSwagger2Operation } from './utils'
import { resolveName } from './resolve'
import {
  getRelativeTypeImportPath,
  // extractPathTypes, PathTypeInfo
} from './typeExtractor'
import { APIPathInfo, GenerateAPIOptions, GenerateCodeOptions } from './types'
import { pick } from 'lodash'

const tsTemplatePath = path.resolve(__dirname, './templates/ts-api-file.ejs')
const esmTemplatePath = path.resolve(__dirname, './templates/esm-api-file.ejs')
const dTsTemplatePath = path.resolve(__dirname, './templates/dts.ejs')
const existingNames = new Set<string>()

/**
 * 检查并准备输出路径，确保必要的目录存在并在需要时清理输出目录
 */
function checkOutputPath({
  typesOutputPath,
  tsApiOutputPath,
  esmApiOutputPath,
  jsdocOutputPath,
  cleanOutputDir,
}: Record<string, any>) {
  // 确保所有必要的目录都存在
  fs.mkdirSync(path.dirname(typesOutputPath), { recursive: true })
  if (tsApiOutputPath) {
    fs.mkdirSync(path.dirname(tsApiOutputPath), { recursive: true })
  }
  if (esmApiOutputPath) {
    fs.mkdirSync(path.dirname(esmApiOutputPath), { recursive: true })
  }
  if (jsdocOutputPath) {
    fs.mkdirSync(path.dirname(jsdocOutputPath), { recursive: true })
  }

  // 如果需要清理输出目录，则删除并重新创建相关目录
  if (cleanOutputDir) {
    const outputDirs = [tsApiOutputPath, esmApiOutputPath, jsdocOutputPath].filter(Boolean).map((p) => path.dirname(p!))
    const uniqueDirs = [...new Set(outputDirs)]
    uniqueDirs.forEach((dir) => {
      console.log(`🧹 正在清空输出目录: ${dir}`)
      fs.rmSync(dir, { recursive: true, force: true })
      fs.mkdirSync(dir, { recursive: true })
    })
  }
}

/**
 * 生成ts代码
 */
function generateTypescriptCode(
  apiFunctions: APIPathInfo[],
  paths: Record<string, any>,
  { apiOutputPath: tsApiOutputPath, servicePath, typesOutputPath }: GenerateCodeOptions,
) {
  console.log('📝 正在生成 TypeScript 版本的 API 函数...')
  const tsTemplateContent = fs.readFileSync(tsTemplatePath, 'utf8')
  const typesImportPath = getRelativeTypeImportPath(tsApiOutputPath, typesOutputPath as string)

  let tsGeneratedCode = `import service from '${servicePath}'\n`
  tsGeneratedCode += `import type { paths } from '${typesImportPath}'\n`

  apiFunctions.forEach((api) => {
    const pathItem = paths[api.url]
    const operation = pathItem[api.method.toLowerCase()]
    const jsdoc = generateJSDoc(operation?.description ?? api.description, operation?.summary ?? api.summary)

    const templateData = {
      api: {
        name: api.name,
        url: generateUrl(api.url, api.hasPathParams),
        method: api.method,
        params: api.params,
        data: api.data,
      },
      jsdoc,
      hasPathParams: api.hasPathParams,
      hasQueryParams: api.hasQueryParams,
      hasBody: api.hasBody,
    }

    const functionCode = ejs.render(tsTemplateContent, templateData, { root: path.dirname(tsTemplatePath) })
    tsGeneratedCode += functionCode + '\n'
  })

  fs.writeFileSync(tsApiOutputPath, tsGeneratedCode, 'utf8')
  console.log(`✅ TypeScript 版本生成成功: ${tsApiOutputPath}`)
}

/**
 * 生成esm代码
 */
function generateEsmCode(
  apiFunctions: APIPathInfo[],
  paths: Record<string, any>,
  { apiOutputPath: esmApiOutputPath, servicePath }: GenerateCodeOptions,
) {
  console.log('📝 正在生成 ESM 版本的 API 函数...')
  const esmTemplateContent = fs.readFileSync(esmTemplatePath, 'utf8')
  const moduleName = path.basename(esmApiOutputPath, path.extname(esmApiOutputPath))
  let esmGeneratedCode = `import service from '${servicePath}'\n`
  apiFunctions.forEach((api) => {
    const pathItem = paths[api.url]
    const operation = pathItem[api.method.toLowerCase()]
    const jsdoc = generateJSDoc(operation?.description ?? api.description, operation?.summary ?? api.summary)
    const templateData = {
      api: {
        name: api.name,
        url: generateUrl(api.url, api.hasPathParams),
        method: api.method,
        params: api.params,
        data: api.data,
      },
      jsdoc,
      hasPathParams: api.hasPathParams,
      hasQueryParams: api.hasQueryParams,
      hasBody: api.hasBody,
      moduleName,
    }

    const functionCode = ejs.render(esmTemplateContent, templateData, { root: path.dirname(esmTemplatePath) })
    esmGeneratedCode += functionCode + '\n'
  })

  fs.writeFileSync(esmApiOutputPath, esmGeneratedCode, 'utf8')
  console.log(`✅ ESM 版本生成成功: ${esmApiOutputPath}`)
}

/**
 * 生成dts代码
 */
function generateDTsCode(apiFunctions: APIPathInfo[], typesOutputPath: string) {
  const dTsTemplateContent = fs.readFileSync(dTsTemplatePath, 'utf8')
  apiFunctions.forEach((api) => {
    const templateData = pick(api, [
      'name',
      'method',
      'params',
      'data',
      'hasPathParams',
      'hasQueryParams',
      'hasBody',
      'hasFormData',
      'url',
    ])
    const functionCode = ejs.render(dTsTemplateContent, templateData, { root: path.dirname(dTsTemplatePath) })

    fs.appendFileSync(typesOutputPath, functionCode + '\n')
  })
}

/**
 * 根据 OpenAPI/Swagger 规范和模板生成 TypeScript API 客户端
 * @param options 生成配置
 */
export async function generateAPIClient(options: GenerateAPIOptions): Promise<void> {
  console.log('🚀 开始生成 API 客户端...')
  console.log('📋 使用配置:', JSON.stringify(options, null, 2))

  const {
    openapiSpecPath,
    typesOutputPath,
    tsApiOutputPath,
    esmApiOutputPath,
    servicePath = '@/utils/services',
  } = options
  checkOutputPath(options)
  try {
    // 步骤 1: 调用 openapi-typescript 生成类型文件（包含 description）
    console.log(`🔧 正在从 ${openapiSpecPath} 生成类型定义到 ${typesOutputPath}...`)
    const ast = await openapiTS(fs.readFileSync(openapiSpecPath, 'utf-8'))
    const typesCode = astToString(ast)
    fs.writeFileSync(typesOutputPath, typesCode)
    // const res = extractPathTypes(typesOutputPath)
    // res.forEach((value, key) => {
    //   let interfaceStr = ''
    //   ;(['pathInterface', 'queryInterface', 'bodyInterface'] as Array<keyof PathTypeInfo>).forEach((_) => {
    //     if (value[_]) {
    //       interfaceStr += ` ${_}: ${value[_]?.replace(/;/g, ';\n')}\n`
    //     }
    //   })
    //   const code = `export interface ${key}Interface {\n${interfaceStr}}\n\n`
    //   fs.appendFileSync(typesOutputPath, code)
    // })
    console.log('✅ 类型定义生成成功')

    // 步骤 2: 解析 OpenAPI/Swagger 规范，提取 paths 信息
    console.log(`📖 正在解析 OpenAPI/Swagger 规范 ${openapiSpecPath}...`)
    const spec = (await SwaggerParse.dereference(openapiSpecPath, {
      resolve: {
        http: {
          timeout: 60000,
        },
      },
    })) as any

    const specVersion = detectSpecVersion(spec)
    console.log(`📌 检测到规范版本: ${specVersion === 'openapi3' ? 'OpenAPI 3.x' : 'Swagger 2.x'}`)

    const { paths = {} } = spec
    if (Object.keys(paths).length === 0) {
      console.warn('⚠️  未找到任何 paths，跳过函数生成')
      return
    }

    // 步骤 3: 遍历 paths，生成 API 函数
    console.log(`🔄 正在遍历 ${Object.keys(paths).length} 个 paths...`)
    const apiFunctions: APIPathInfo[] = []
    // const existingNames = new Set<string>()

    Object.keys(paths).forEach((pathUrl) => {
      const pathItem = paths[pathUrl]
      const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace']

      methods.forEach((method) => {
        let operation = pathItem[method]
        if (!operation) return

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

        apiFunctions.push({
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
        })
      })
    })

    console.log(`✅ 成功识别到 ${apiFunctions.length} 个 API 函数。`)

    // 步骤 4: 生成d.ts文件函数
    generateDTsCode(apiFunctions, typesOutputPath)

    // 步骤 5: 生成 TypeScript 版本的 API 函数（引用类型）
    if (tsApiOutputPath)
      generateTypescriptCode(apiFunctions, paths, { typesOutputPath, apiOutputPath: tsApiOutputPath, servicePath })

    // 步骤 6: 生成 ESM 版本的 API 函数
    if (esmApiOutputPath) generateEsmCode(apiFunctions, paths, { apiOutputPath: esmApiOutputPath, servicePath })
    console.log('🎉 API 客户端代码生成成功！')
  } catch (error) {
    console.error('❌ 代码生成过程中发生错误:', (error as Error).message)
    throw error // 重新抛出错误，以便调用方可以捕获
  }
}
