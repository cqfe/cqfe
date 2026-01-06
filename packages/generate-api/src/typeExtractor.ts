import * as ts from 'typescript'
import * as path from 'path'
import { resolveName } from './resolve'

/**
 * 从生成的类型文件中提取路径的类型信息
 */
export interface PathTypeInfo {
  path: string
  method: string
  pathInterface?: string
  queryInterface?: string
  bodyInterface?: string
  headerInterface?: string
  responseInterface?: string
}

/**
 * 检查TypeScript类型是否为never类型
 * @param type TypeScript类型对象
 * @param checker TypeScript类型检查器
 * @returns 如果类型是never则返回true，否则返回false
 */
export function isNeverType(type: ts.Type, checker: ts.TypeChecker): boolean {
  // 获取类型的字符串表示
  const typeString = checker.typeToString(type)

  // 检查是否为never类型
  return typeString === 'never'
}

/**
 * 根据TypeScript类型和键路径获取对应的类型代码字符串
 * @param type TypeScript类型对象
 * @param checker TypeScript类型检查器
 * @param keys 键路径数组，例如 ['post', 'requestBody', 'content', 'application/json']
 * @returns 对应路径下的类型代码字符串
 */
export function getTypeAtPath(type: ts.Type, checker: ts.TypeChecker, keys: string[]): string {
  let currentType = type

  // 遍历键路径
  for (const key of keys) {
    // 获取当前类型的属性
    const property = currentType.getProperty(key)

    // 如果找不到属性，返回never类型
    if (!property) {
      return 'never'
    }

    // 获取属性的声明节点
    const declaration = property.valueDeclaration

    // 如果没有声明节点，尝试直接获取类型
    if (!declaration) {
      currentType = checker.getTypeOfSymbolAtLocation(
        property,
        declaration || type.symbol.valueDeclaration || (undefined as any),
      )
      continue
    }

    // 根据声明节点的类型处理
    if (ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration)) {
      // 处理属性签名
      if (declaration.type) {
        currentType = checker.getTypeFromTypeNode(declaration.type)
      } else {
        currentType = checker.getTypeOfSymbolAtLocation(property, declaration)
      }
    } else if (ts.isMethodSignature(declaration)) {
      // 处理方法签名
      currentType = checker.getTypeOfSymbolAtLocation(property, declaration)
    } else {
      // 其他情况直接获取符号的类型
      currentType = checker.getTypeOfSymbolAtLocation(property, declaration)
    }
  }

  // 返回最终类型的字符串表示
  return checker.typeToString(currentType)
}

/**
 * 解析类型文件，提取 paths 的类型信息
 */
export function extractPathTypes(typesFilePath: string): Map<string, PathTypeInfo> {
  const program = ts.createProgram([typesFilePath], {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    skipLibCheck: true,
  })
  const existingNames = new Set<string>()

  const sourceFile = program.getSourceFile(typesFilePath)
  if (!sourceFile) {
    throw new Error(`无法找到或解析类型文件: ${typesFilePath}`)
  }

  const checker = program.getTypeChecker()
  const pathTypes = new Map<string, PathTypeInfo>()
  function visitNode(node: ts.Node) {
    // 查找 paths 接口
    if (ts.isInterfaceDeclaration(node) && node.name.text === 'paths') {
      // && ts.isIdentifier(member.name)
      node.members.forEach((member) => {
        if (ts.isPropertySignature(member) && member.name) {
          const pathUrl = (member.name as any).text
          const pathType = checker.getTypeAtLocation(member)

          // 遍历路径的方法（get, post, etc.）
          pathType.getProperties().forEach((prop) => {
            const method = prop.getName()
            if (['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'].includes(method)) {
              const methodSymbol = prop.valueDeclaration
              if (methodSymbol && ts.isPropertySignature(methodSymbol) && methodSymbol.type) {
                const methodType = checker.getTypeFromTypeNode(methodSymbol.type)
                if (isNeverType(methodType, checker)) return
                const key = resolveName(method.toLowerCase(), pathUrl, existingNames)

                const typeInfo: PathTypeInfo = {
                  path: pathUrl,
                  method,
                }

                // 提取 parameters
                const parametersProp = methodType.getProperty('parameters')
                if (parametersProp) {
                  const parametersType = checker.getTypeOfSymbolAtLocation(parametersProp, methodSymbol)
                  // const requestParams: PathTypeInfo['requestParams'] = {}

                  parametersType.getProperties().forEach((paramProp) => {
                    const paramName = paramProp.getName()
                    if (['path', 'query'].includes(paramName)) {
                      const paramType = checker.getTypeOfSymbolAtLocation(paramProp, methodSymbol)
                      const typeStr = checker.typeToString(paramType)
                      if (typeStr !== 'never') {
                        typeInfo[`${paramName}Interface` as keyof PathTypeInfo] = typeStr
                      }
                    }
                  })

                  // if (Object.keys(requestParams).length > 0) {
                  //   typeInfo.requestParams = requestParams
                  // }
                }

                // 提取 requestBody
                const requestBodyProp = methodType.getProperty('requestBody')
                if (requestBodyProp) {
                  const requestBodyType = checker.getTypeOfSymbolAtLocation(requestBodyProp, methodSymbol)
                  const typeStr = checker.typeToString(requestBodyType)
                  if (typeStr !== 'never') {
                    // if (!typeInfo.requestParams) {
                    //   typeInfo.requestParams = {}
                    // }
                    typeInfo.bodyInterface = getTypeAtPath(requestBodyType, checker, ['content', 'application/json'])
                  }
                }

                // 提取 responses
                // const responsesProp = methodType.getProperty('responses')
                // if (responsesProp) {
                //   const responsesType = checker.getTypeOfSymbolAtLocation(responsesProp, methodSymbol)
                //   // 尝试获取 200 响应
                //   typeInfo.responseType = getTypeAtPath(responsesType, checker, ['200', 'content', 'application/json'])
                //   // const successResponse = responsesType.getProperty('200')
                //   // if (successResponse) {
                //   //   const responseType = checker.getTypeOfSymbolAtLocation(successResponse, methodSymbol)
                //   //   const contentProp = responseType.getProperty('content')
                //   //   if (contentProp) {
                //   //     const contentType = checker.getTypeOfSymbolAtLocation(contentProp, methodSymbol)
                //   //     const jsonProp = contentType.getProperty('application/json')
                //   //     if (jsonProp) {
                //   //       const jsonType = checker.getTypeOfSymbolAtLocation(jsonProp, methodSymbol)
                //   //       typeInfo.responseType = checker.typeToString(jsonType)
                //   //     }
                //   //   }
                //   // }
                // }

                pathTypes.set(key, typeInfo)
              }
            }
          })
        }
      })
    }

    ts.forEachChild(node, visitNode)
  }

  visitNode(sourceFile)
  return pathTypes
}

/**
 * 获取类型文件的相对导入路径
 */
export function getRelativeTypeImportPath(fromPath: string, toPath: string): string {
  const relative = path.relative(path.dirname(fromPath), path.dirname(toPath))
  const importPath = relative ? `./${relative}/${path.basename(toPath, '.ts')}` : `./${path.basename(toPath, '.ts')}`
  return importPath.replace(/\\/g, '/')
}
