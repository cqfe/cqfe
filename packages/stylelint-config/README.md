# @cqfe/stylelint-config

Stylelint config used by cqfe team

## Usage

### 1. 在 package.json 中配置（适用于支持的编辑器）

```json
{
  "stylelint": {
    "extends": "@cqfe/stylelint-config"
  }
}
```

### 2. 创建 .stylelintrc.js 文件（适用于所有编辑器）

```js
module.exports = {
  extends: ['@cqfe/stylelint-config'],
}
```

### 3. 在项目中直接安装和使用

```bash
npm install -D @cqfe/stylelint-config
```

然后在 .stylelintrc.js 中:

```js
module.exports = {
  extends: ['@cqfe/stylelint-config'],
}
```
