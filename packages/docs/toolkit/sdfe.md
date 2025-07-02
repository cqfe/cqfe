# Sdfe

## Description

SD前端研发工具，支持`init`,`dev`,`build`,`deploy`,`generateApi`,支持pnpm管理的多应用，和单应用（多应用默认在`microApps`目录下）

## Usage

1. 安装：`npm i @cqfe/sdfe -g`
2. 已有项目初始化配置文件： `sdfe initConfig`
3. 初始化应用: `sdfe init`选择相应模板，填写应用名称
4. 生成API：`sdfe genApi -a app1 -u "https://xxx" -o "./apis/pet.js"`, -u -o 选项为可选项,默认读取配置
5. 开发应用：`sdfe dev -a app1 app2`或者`sdfe dev`选择需要开发的应用
6. 构建应用：`sdfe build -a app1 app2`或者`sdfe build`选择需要构建的应用
7. 发布应用：`sdfe deploy -a app1 app2 -n dev`或者`sdfe deploy -n dev`选择需要要发布的应用,如果不输入-n配置，默认发布到`deploy`数组第一个环境（密码可在环境变量设置PWD*${server.user}*${server.host.replace(/\./g, '\_')}，也可以手动输入）

## Config Field

```js
{
  app: 'appName',
  // 部署的环境配置
  deploy: [{
    // 对应deploy命令的-n参数
    namespace: 'dev',
    path: '/nginx/html',
    user: 'root',
    host: '111.111.111.111',
    port: '2202' || 22
  }],
  // 生成api的配置
  genApi: [{
    // 对应genApi命令的-a参数
    app: 'pet',
    // 对应genApi命令的-u参数
    url: 'https://petstore.swagger.io/v2/swagger.json',
    // 对应genApi命令的-o参数
    output: './apis/pet.js',
    // service引用地址，原样写入pet.js文件
    service: "import service from '@/services/pet.js'"
  }],
  // 构建的配置
  build: {
    // 构建完成是否复制到{copy}目录
    copy: 'root-dir',
    // 是否压缩构建文件
    zip: true
  }
}
```
