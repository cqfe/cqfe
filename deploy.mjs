import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

// 修改pkg版本号并提交
const pkgs = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf8'))
const version = pkgs.version
  .split('.')
  .map((i, j) => {
    return j === 2 ? parseInt(i) + 1 : parseInt(i)
  })
  .join('.')
pkgs.version = version
console.log('New version:', version)
fs.writeFileSync(path.resolve('./package.json'), JSON.stringify(pkgs, null, 2) + '\n', 'utf8')
execSync('git add . && git commit -m "chore: release v' + version + '"')
execSync('git tag v' + version)
execSync('git push origin master && git push --tags')
