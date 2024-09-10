# @cqfe

> 前端工具库

## 发布步骤

1. `npm run version`: 使用lerna进行发布包的版本添加，changelog生成，tag生成并push到github
2. 运行 github action `npm-publish-all` 或 执行发布脚本`node deploy.mjs`(打`v*`的tag，自动触发`npm-publish-all` action)

## 主要目录结构

```bash
packages
|-- deploy-scp // scp部署工具
|-- generate-api // api生成工具
|-- eslint-config // eslint配置
|-- stylelint-config // stylelint配置
|-- prettier-config // prettier配置
|-- vue-hooks // vue hooks
|-- vue-components // vue components
|-- utils // 工具包
|-- docs // 文档
```

## Todo

- Feature
  - [ ] @cqfe/utils: 添加通用正则表达式
- Bug
  - [x] chore: lerna 在action中npm实际发布成功，但显示发布失败(似乎npm publish会执行两次)
