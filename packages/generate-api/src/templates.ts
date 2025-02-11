import { IFieldItem, IResolveRequest } from './resolve'
import { formatVarName } from './utils'

interface ITmpRequestFn {
  name: string
  url: string
  method: string
  description?: string
}
export function tmpRequestFn(
  { name, url, method }: ITmpRequestFn,
  docs: string,
  path?: IFieldItem[],
  query?: IFieldItem[],
  body?: IFieldItem[],
  formData?: IFieldItem[],
) {
  // 导出函数的参数
  let requestParamsStr = ''
  if (path) requestParamsStr += 'path'
  if (query) requestParamsStr += (requestParamsStr ? ', ' : '') + 'query'
  if (body) requestParamsStr += (requestParamsStr ? ', ' : '') + 'body'
  if (formData) requestParamsStr += (requestParamsStr ? ', ' : '') + 'formData'
  requestParamsStr += (requestParamsStr ? ', ' : '') + 'options = {}'
  // 修改path参数的url
  const patchedUrl = url.includes('{')
    ? `\`${url.replace(/{([^}]+)}/g, (_, key) => '${path.' + formatVarName(key) + '}')}\``
    : `'${url}'`

  // 生成函数
  let ret = `${docs}
export function ${name}(${requestParamsStr}) {
  return service({
    url: ${patchedUrl},
    method: '${method}',\n`
  if (query) ret += '    params: query,\n'
  if (formData) ret += '    data: formData,\n'
  if (body) ret += '    data: body,\n'
  ret += '    ...options,\n'
  ret += `  })
}`
  return ret
}

export function tmpRequestDocFn(description: string, requestParams: IResolveRequest, requestDoc?: boolean) {
  let doc = `\n/**
 * ${description || ''}`
  if (requestDoc) {
    ;(Object.keys(requestParams) as unknown as Array<keyof IResolveRequest>).forEach((key) => {
      requestParams[key]?.forEach((each) => {
        doc += `\n * @param {${each.type}} ${each.key} - ${each.description?.trim() || 'empty'}`
      })
    })
  }

  doc += '\n * @param {{[key]: any}} options - axios request options'
  doc += '\n */'
  return doc
}
