# @cqfe/prettier-config

Prettier config used by cqfe team

## Usage

### 1. 在 package.json 中配置（适用于支持的编辑器）

```json
{
  "prettier": "@cqfe/prettier-config"
}
```

### 2. 创建 .prettierrc.js 文件（适用于所有编辑器）

```js
module.exports = '@cqfe/prettier-config'
```

或者:

```js
module.exports = {
  ...require('@cqfe/prettier-config'),
}
```

### 3. 在项目中直接安装和使用

```bash
npm install -D @cqfe/prettier-config
```

然后创建 .prettierrc.js 文件:

```js
module.exports = '@cqfe/prettier-config'
```
