# GenerateApi

## Description

Generate api for axios, based on swagger json.support `Swagger2.0`&`OpenAPI3.0`.

## Usage

1. Install `npm install @cqfe/generate-api`

2. Create a script file, and write the following code:

```js
// scripts/gen-api.mjs
import { generateApi } from '@cqfe/generate-api'
import { resolve } from 'path'

const apis = [
  {
    // path of swagger json file (can be http(s)://xxx)
    url: resolve(process.cwd(), 'scripts/swaggers/swagger1.json'),
    // output api js file path
    outPut: resolve(process.cwd(), 'src/api/api1.js'),
    // basic service path, used for string writing template, content should be an instance of axios
    servicePath: "import { service } from '@/services/service1'",
  },
  {
    url: resolve(process.cwd(), 'scripts/swaggers/swagger2.json'),
    outPut: resolve(process.cwd(), 'src/api/api2.js'),
    servicePath: "import { service } from '@/services/service2'",
  },
]
;(async () => {
  for (const api of apis) {
    await generateApi(api)
  }
})()
```

3. Run the script file, `node scripts/gen-api.mjs`

## ⚠️ Attention

当存在多个需要生成的api时，循环时请串行执行(使用for循环，不使用forEach)，否则会导致函数名异常。
