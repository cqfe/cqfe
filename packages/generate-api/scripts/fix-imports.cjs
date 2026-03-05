const { readFileSync, writeFileSync, readdirSync, statSync } = require('fs')
const { join } = require('path')

function addJsExtension(dir) {
  const files = readdirSync(dir)
  files.forEach((file) => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)
    if (stat.isDirectory()) {
      addJsExtension(filePath)
    } else if (file.endsWith('.js')) {
      let content = readFileSync(filePath, 'utf8')
      content = content.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
        if (!p1.endsWith('.js')) {
          return match.replace(p1, p1 + '.js')
        }
        return match
      })
      writeFileSync(filePath, content, 'utf8')
    }
  })
}

addJsExtension('./lib')
addJsExtension('./es')
console.log('✅ 已为导入路径添加 .js 扩展名')
