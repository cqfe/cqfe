# sdfe

## Description

SD前端研发工具，支持`init`,`dev`,`build`,`deploy`,`generateApi`,支持pnpm管理的多应用，和单应用（多应用默认在`microApps`目录下）

## Usage

`npm i @cqfe/sdfe -g`

## Example

- 初始化应用: `sdfe init`选择相应模板，填写应用名称
- 生成API：`sdfe genApi -a app1 -u "https://xxx" -o "./apis/pet.js"`, -u -o 选项为可选项,默认读取配置
- 开发应用：`sdfe dev -a app1 app2`或者`sdfe dev`选择需要开发的应用
- 构建应用：`sdfe build -a app1 app2`或者`sdfe build`选择需要构建的应用
- 发布应用：`sdfe deploy -a app1 app2 -n dev`或者`sdfe deploy -n dev`选择需要发布的应用,如果不输入-n配置，默认发布到`deploy`数组第一个环境（密码可在环境变量设置PWD*${server.user}*${server.host.replace(/\./g, '\_')}，也可以手动输入）
- 初始化配置文件：`sdfe initConfig`，然后修改对应字段

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
    // service引用地址，原样写入pet.js文件
    service: "import service from '@/services/pet.js'"
  }],
  build: {
    copy: 'root-dir',
    zip: true
  }
}
```
