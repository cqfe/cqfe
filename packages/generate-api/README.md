# generate-api

> 基于 Swagger/OpenAPI 规范生成 TypeScript/JavaScript API 客户端代码

## 功能特性

- ✅ 支持 Swagger 2.0 和 OpenAPI 3.0 规范
- ✅ 生成带完整 JSDoc 注释的 JavaScript 文件
- ✅ 生成带类型定义的 TypeScript 文件（.ts + .d.ts）
- ✅ 自动提取请求参数（path/query/body/formData）
- ✅ 支持嵌套对象字段的详细文档注释

## 安装

```bash
npm install @cqfe/generate-api
```

## 使用方式

### 方式一：生成 JS 文件（带 JSDoc）

```js
// scripts/gen-api.mjs
import { generateApi } from '@cqfe/generate-api'
import { resolve } from 'path'

const apis = [
  {
    // Swagger JSON 文件路径（可以是 http(s)://xxx）
    url: resolve(process.cwd(), 'scripts/swaggers/swagger1.json'),
    // 输出 API JS 文件路径
    outPut: resolve(process.cwd(), 'src/api/api1.js'),
    // 请求服务导入路径，应该是 axios 实例
    servicePath: "import { service } from '@/services/service1'",
    // 是否生成请求文档注释（默认：true）
    generateRequestDoc: true,
  },
]

;(async () => {
  for (const api of apis) {
    await generateApi(api)
  }
})()
```

### 方式二：生成 TS + JS + DTS 文件（推荐）

```js
// scripts/gen-api.mjs
import { generateAPIClient } from '@cqfe/generate-api'
import { resolve } from 'path'

;(async () => {
  await generateAPIClient({
    // OpenAPI/Swagger 规范文件路径（YAML 或 JSON）
    openapiSpecPath: resolve(process.cwd(), 'swagger.json'),
    // 生成的 TypeScript 类型文件路径（包含 paths 类型和函数声明）
    typesOutputPath: resolve(process.cwd(), 'src/api/types.d.ts'),
    // TypeScript 版本的 API 客户端代码输出路径（.ts 文件，带类型引用）
    tsApiOutputPath: resolve(process.cwd(), 'src/api/api.ts'),
    // ESM 版本的 API 客户端代码输出路径（.js 文件，带 JSDoc）
    esmApiOutputPath: resolve(process.cwd(), 'src/api/api.js'),
    // service 导入路径（默认：'@/utils/services'）
    servicePath: '@/utils/service',
    // 是否在生成前清空输出目录（默认：false）
    cleanOutputDir: true,
  })
})()
```

## 生成的文件说明

### 1. types.d.ts - 类型定义文件

包含两部分：
- `paths` 接口：从 OpenAPI 规范生成的完整类型定义
- 函数声明：带详细 JSDoc 注释的函数类型声明

```typescript
/**
 * postUser - This can only be done by the logged in user.
 * @param {Object} body - 请求体数据
 * @param {Object} [options] - Axios 请求配置选项
 * @returns {Promise<any>} API 响应数据
 */
export function postUser(
  body: NonNullable<NonNullable<paths['/user']['post']['requestBody']>['content']['application/json']>,
  options?: any
): Promise<any>
```

### 2. api.ts - TypeScript 实现文件

带类型引用的 TypeScript 实现，可直接在 TS 项目中使用：

```typescript
import service from '@/utils/service'
import type { paths } from './types.d'

/**
 * Add a new pet to the store
 * @returns {Promise<any>} API 响应数据
 */
export function postPet(
  /** Axios 请求配置选项 */
  options?: any
): Promise<NonNullable<paths['/pet']['post']['responses']['200']['content']['application/json']>> {
  return service({
    url: '/pet',
    method: 'post',
    ...options,
  })
}
```

### 3. api.js - ESM JavaScript 文件

带完整 JSDoc 注释的 JavaScript 文件，可在支持 ESM 的项目中直接使用：

```javascript
import service from '@/utils/service'

/**
 * Add a new pet to the store
 * @returns {Promise<any>} API 响应数据
 */
export function postPet(body, options = {}) {
  return service({
    url: '/pet',
    method: 'post',
    data: body,
    ...options,
  })
}
```

## 编译 TypeScript 文件

生成的 `.ts` 文件可以使用 TypeScript 编译器编译成 JavaScript：

```bash
# 使用 tsc 编译
tsc src/api/api.ts --outDir dist/api

# 或使用 vite/rollup 等工具打包
```

## ⚠️ 注意事项

1. **串行执行**：当存在多个 API 需要生成时，请使用 `for` 循环串行执行，不要使用 `forEach`，否则可能导致函数名重复异常。

2. **service 实例**：`servicePath` 导入的应该是一个配置好的 axios 实例。

3. **路径参数**：如果 URL 包含路径参数（如 `/pet/{petId}`），生成的函数会将 `path` 作为第一个参数。

## 参数说明

### generateApi 配置

| 参数 | 类型 | 说明 |
|------|------|------|
| url | string | Swagger JSON 文件路径 |
| outPut | string | 输出 JS 文件路径 |
| servicePath | string | 请求服务导入路径 |
| generateRequestDoc | boolean | 是否生成请求文档注释 |

### generateAPIClient 配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| openapiSpecPath | string | ✅ | OpenAPI/Swagger 规范文件路径 |
| typesOutputPath | string | ✅ | TypeScript 类型文件输出路径 |
| tsApiOutputPath | string | ❌ | TypeScript 实现文件输出路径 |
| esmApiOutputPath | string | ❌ | ESM JavaScript 文件输出路径 |
| servicePath | string | ❌ | service 导入路径（默认：`@/utils/services`） |
| cleanOutputDir | boolean | ❌ | 是否清空输出目录（默认：false） |

## License

MIT
