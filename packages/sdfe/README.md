# deploy-scp

## Description

SD前端研发工具，支持`deploy`,`build`,`dev`,`generateApi`,支持pnpm管理的多应用，和单应用

## Usage

## Example

- 开发应用：`sdfe dev -a app1 app2`或者`sdfe dev`选择需要开发的应用
- 构建应用：`sdfe build -a app1 app2`或者`sdfe build`选择需要构建的应用
- 发布应用：`sdfe deploy -a app1 app2 -n dev`或者`sdfe deploy -n dev`选择需要发布的应用,如果不输入-n配置，默认发布到`deploy`数组第一个环境
- 生成API：`sdfe generateApi -a app1 -u https://xxx -o ./apis/pet.js`

## Config Field

```js
{
  app: 'appName'
  deploy: [{
    namespace: 'dev',
    path: '/nginx/html',
    user: 'root',
    host: '111.111.111.111',
    port: '2202' || 22
  }],
  genApi: [{
    app: 'pet',
    url: 'https://petstore.swagger.io/v2/swagger.json',
    output: './apis/pet.js',
    service: "import service from '@/services/pet.js'"
  }],
  build: {
    copy: 'root-dir',
    zip: true
  }
}
```
