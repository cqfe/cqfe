import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { resolve } from 'path'
import { rimrafSync } from 'rimraf'

const codeDir = resolve(process.cwd(), 'componentsCode')
const componentDir = resolve(process.cwd(), 'components')

if (existsSync(codeDir)) {
  rimrafSync(codeDir)
}
mkdirSync(codeDir)

readdirSync(componentDir).forEach((fileName) => {
  const content = readFileSync(resolve(componentDir, fileName), 'utf-8')
  writeFileSync(resolve(codeDir, fileName.split('.')[0] + '.js'), `export default { content: \`${content}\` }`)
})
