# @cqfe/eslint-config

ESLint config used by cqfe team

## Usage

### {root}/eslint.config.js

```js
import cqfeEslintConfig from "@cqfe/eslint-config";

export default [
  ...cqfeEslintConfig.default,
  {
    ignores: ["xx"],
  },
];
```

### 破坏更新

- 不支持`.eslintignore`,需要在`eslint.config.js`中配置
- 不支持嵌套规则，使用eslint 9.x 的扁平规则配置
- 不支持`extends`
- 命令不支持 -c 参数,请使用`eslint '**/*.{js,jsx,ts,tsx,vue}' --fix`
