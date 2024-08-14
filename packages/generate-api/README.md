# generate-api

## Description

Generate api for axios, based on swagger json.support `Swagger2.0`&`OpenAPI3.0`.

## Useage

1. Install `npm install @cqfe/generate-api`

2. Create a script file, and write the following code:

```js
// scripts/gen-api.mjs
import generateApi from '@cqfe/generate-api';
import path from 'path';

generateApi.default({
  // path of swagger json file (can be http(s)://xxx)
  url: path.resolve(process.cwd(), './mocks/v2.json'),
  // output api js file path
  outPut: path.resolve(process.cwd(), './apis.js'),
  // basic service path, used for string writing template, content should be an instance of axios
  servicePath: 'import service from "@/utils/request"',
  // be true if you want to generate jsDoc for request body
  generateRequestDoc: true,
  // be true if you want to generate jsDoc for response body, not work still now
  generateResponseDoc: false,
});
```
