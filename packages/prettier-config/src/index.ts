/*
 * @description: prettier配置文件
 * @author: 李川
 * @update: 2024-08-15 10:31:07
 */
module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  // jsxBracketSameLine: false, // [Deprecated v2.4.0](https://prettier.io/docs/en/options.html#deprecated-jsx-brackets)
  bracketSameLine: false,
  arrowParens: 'always',
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  endOfLine: 'auto',
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: false,
}
