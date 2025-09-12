# @cqfe/eslint-config

ESLint config used by cqfe team

## Usage

### 1. 在 package.json 中配置（适用于支持的编辑器）

```json
{
  "eslintConfig": {
    "extends": "@cqfe/eslint-config"
  }
}
```

### 2. 创建 .eslintrc.js 文件（适用于所有编辑器）

```js
module.exports = {
  extends: ['@cqfe/eslint-config'],
}
```

### 3. 在项目中直接安装和使用

```bash
npm install -D @cqfe/eslint-config
```

然后在 .eslintrc.js 中:

```js
module.exports = {
  extends: ['@cqfe/eslint-config'],
}
```
