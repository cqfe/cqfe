# `@cqfe/prettier-config`

> [prettier](https://prettier.io/) config used by `cqfe` team

## Usage

- `package.json`

```json
{
  "prettier": "@cqfe/prettier-config"
}
```

- `.prettierrc`

```
"@cqfe/prettier-config"
```

- `prettier.config.js`

```js
module.exports = {
  ...require('@cqfe/prettier-config'),
};
```
