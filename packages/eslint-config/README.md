# @cqfe/eslint-config

ESLint config used by cqfe team

## Usage

### {root}/eslint.config.js

```js
import cqfeEslintConfig from '@cqfe/eslint-config'

export default [
  ...cqfeEslintConfig.default,
  {
    ignores: ['node_modules/**/*', '**/*.d.ts'],
  },
]
```

### 2.x破坏更新

- 参考`eslint` 9.x 破坏更新文档
- 不支持`.eslintignore`,需要在`eslint.config.js`中配置
- 不支持嵌套规则，使用eslint 9.x 的扁平规则配置
- 不支持`extends`
- 命令不支持 -c 参数,请使用`eslint '**/*.{js,jsx,ts,tsx,vue}' --fix`

### 从1.x迁移到2.x

- 配置文件使用`{root}/eslint.config.js`
- ci脚本命令使用`eslint '**/*.{js,jsx,ts,tsx,vue}' --fix`
- 迁移忽略配置，从`.eslintignore`文件迁移到`eslint.config.js`中
