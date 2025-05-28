# deploy-scp

## Description

SD前端研发工具，支持`deploy`,`build`,`generateApi`,支持pnpm管理的多应用，和单应用

## Usage

## Example

## Config Field

```js
{
  app: 'appName'
  deploy: [{
    namespace: 'test' || {folderName},
    path: '/nginx/html',
    user: 'root',
    host: '111.111.111.111',
    port: '2202' || 22
  }],
  genApi: {
    url: 'http://swagger.io',
    output: 'apis/',
    service: "import service from '@/services/appName'"
  },
  build: {
    copy: 'root-dir',
    zip: true
  }
}
```
