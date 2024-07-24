import { pick } from 'lodash'
import { toCamelCase } from './utils'
import { tmpRequestDocFn, tmpRequestFn } from './templates'
import { appendFileSync } from 'fs'

export interface IFieldItem {
  key: string
  type: string
  description: string
  enum?: string[]
}

export interface IResolveRequest {
  body?: Array<IFieldItem>
  query?: Array<IFieldItem>
  path?: Array<IFieldItem>
  formData?: Array<IFieldItem>
}

const names = [] as string[]

function parseBody(obj: Record<string, any>, parent = 'body') {
  if (parent.split('.').length > 3) return []
  const ret: Array<IFieldItem> = []
  if (obj.type && typeof obj.type === 'string') {
    switch (obj.type) {
      case 'object':
        ret.push(
          {
            key: parent,
            type: obj.type,
            description: '',
          },
          ...parseBody(obj.properties, parent),
        )
        break
      case 'array':
        ret.push(
          {
            key: parent,
            type: obj.type,
            description: '',
          },
          ...parseBody(obj.items, `${parent}[]`),
        )
        break
      case 'number':
      case 'boolean':
      case 'integer':
      case 'string':
        ret.push({
          key: parent,
          ...pick(obj, 'type', 'description'),
        })
        break
      default:
        console.error('has unknown type' + obj.type)
        break
    }
  } else {
    Object.keys(obj).forEach((key) => {
      const item = obj[key]
      if (item.type === 'object') {
        ret.push(
          {
            key: (parent ? `${parent}.` : '') + key,
            type: item.type,
            description: '',
          },
          ...parseBody(item.properties, `${parent}.${key}`),
        )
      } else if (item.type === 'array') {
        ret.push(
          {
            key: (parent ? `${parent}.` : '') + key,
            type: item.type,
            description: '',
          },
          ...parseBody(item.items, `${parent}.${key}[]`),
        )
      } else {
        ret.push({
          key: (parent ? `${parent}.` : '') + key,
          ...pick(obj[key], 'type', 'description', 'enum'),
        })
      }
    })
  }
  return ret
}

// resolve request parameters
export function resolveRequest(parameters: Array<any>) {
  const ret = {
    body: [],
    query: [
      {
        key: 'query',
        type: 'object',
        description: '查询条件',
      },
    ],
    path: [
      {
        key: 'path',
        type: 'object',
        description: '路由参数',
      },
    ],
    formData: [
      {
        key: 'formData',
        type: 'object',
        description: '表单数据',
      },
    ],
  } as IResolveRequest
  parameters.forEach((param) => {
    switch (param.in) {
      case 'body':
        ret.body = [...parseBody(param.schema)]
        break
      case 'path':
        ret.path?.push({
          key: `path.${param.name}`,
          description: param.description,
          type: param.type || param?.schema?.type,
        })
        break
      case 'query':
        ret.query?.push({
          key: `query.${param.name}`,
          description: param.description,
          type: param.type || param?.schema?.type,
        })
        break
      case 'formData':
        ret.formData?.push({
          key: `formData.${param.name}`,
          description: param.description,
          type: param.type || param?.schema?.type,
        })
        break
      default:
        break
    }
  })
  ;(Object.keys(ret) as [keyof IResolveRequest]).forEach((key: keyof IResolveRequest) => {
    if ((ret[key]?.length || 0) <= 1) delete ret[key]
  })

  return ret
}

// generate function name
export function resolveName(method: string, path: string) {
  // handle when function name is repeated
  let name = `${method}${toCamelCase(path)}`
  names.push(name)
  const nameIndex = names.filter((each) => each === name).length - 1
  if (nameIndex > 0) {
    name = `${name}V${nameIndex}`
  }
  return name
}

// swagger v2 generate request function and write to file
export function resolvePath(path: string, content: Record<string, any>, outPut: string, requestDoc = true) {
  Object.keys(content).forEach((method) => {
    const { parameters = [], summary, description } = content[method]
    // 解析请求参数
    const requestParams = resolveRequest(parameters)
    // 解析请求名称
    const name = resolveName(method, path)
    // 生成jsdoc文档
    const docs = tmpRequestDocFn(summary || description, requestParams, requestDoc)
    // 生成函数
    const code = tmpRequestFn(
      { method, url: path, name },
      docs,
      requestParams.path,
      requestParams.query,
      requestParams.body,
      requestParams.formData,
    )
    appendFileSync(outPut, code)
  })
}

// openapi v3 generate request function and write to file
export function resolvePathV3(path: string, content: Record<string, any>, outPut: string, requestDoc = true) {
  Object.keys(content).forEach((method) => {
    const { parameters = [], requestBody, summary, description } = content[method]
    if (requestBody) {
      parameters.push({
        in: 'body',
        description: requestBody.description,
        schema: requestBody.content['application/json']?.schema || {},
      })
    }
    // resolve request parameters
    const requestParams = resolveRequest(parameters)
    // resolve request name
    const name = resolveName(method, path)
    // generate jsdoc
    const docs = tmpRequestDocFn(summary || description, requestParams, requestDoc)
    // generate function code
    const code = tmpRequestFn(
      { method, url: path, name },
      docs,
      requestParams.path,
      requestParams.query,
      requestParams.body,
      requestParams.formData,
    )
    appendFileSync(outPut, code)
  })
}
