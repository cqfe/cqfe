import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const BASE_PATH = process.cwd()
const CONFIG_CJS_PATH = resolve(BASE_PATH, '.sdfe.cjs')

function rmFile(filePath: string) {
  if (existsSync(filePath)) {
    rmSync(filePath, { recursive: true, force: true })
  }
}
// 模拟 monorepo 模式下的应用目录和配置文件
function mockMonorepo() {
  clearMonorepo()
  const APP_PATH = resolve(BASE_PATH, 'microApps/app')
  writeFileSync(resolve(BASE_PATH, 'pnpm-workspace.yaml'), '')
  mkdirSync(resolve(APP_PATH, 'app_dist'), { recursive: true })
  writeFileSync(resolve(APP_PATH, 'vite.config.js'), "module.exports = {build:{output:'app_dist'}}")
  writeFileSync(resolve(APP_PATH, 'app_dist', 'index.html'), '<html><body>Hello world</body></html>')
  writeFileSync(
    resolve(APP_PATH, 'package.json'),
    '{"scripts": { "build": "echo start build","dev": "echo start dev"}}',
  )
}
// 清除 monorepo 模式下的应用目录和配置文件
function clearMonorepo() {
  rmFile(resolve(BASE_PATH, 'microApps'))
  rmFile(resolve(BASE_PATH, 'iot-os'))
  rmFile(resolve(BASE_PATH, 'pnpm-workspace.yaml'))
}
// 模拟配置
function mockConfig() {
  writeFileSync(
    CONFIG_CJS_PATH,
    `module.exports = {
name: 'app',
deploy: [{namespace:'dev',host:'206.237.26.101',user:'root',path:'/tmp'}],
genApi: [{app: 'pet', url:'https://petstore.swagger.io/v2/swagger.json',output: '${BASE_PATH}/pet.js', service: 'import service from "../services/app.js"'}]
}`,
  )
}
// 清除配置文件
function clearConfig() {
  rmFile(CONFIG_CJS_PATH)
}

describe('SDFE', () => {
  beforeAll(() => {
    mockMonorepo()
    execSync('npm run build')
  })
  beforeEach(() => {
    clearConfig()
  })
  afterAll(() => {
    clearConfig()
    clearMonorepo()
    rmFile(resolve(BASE_PATH, 'pet.js'))
  })
  it('获取版本号', async () => {
    const pkg = JSON.parse(readFileSync(resolve(BASE_PATH, 'package.json'), 'utf-8'))
    const subprocess = execSync('node ./bin/index.js -v')
    expect(subprocess.toString()).toContain(pkg.version)
  })
  it('初始化配置文件', async () => {
    const subprocess = execSync('node ./bin/index.js init')
    expect(subprocess.toString()).toContain('config file .sdfe.cjs created')
    rmFile(CONFIG_CJS_PATH)
  })
  it('配置存在', async () => {
    writeFileSync(CONFIG_CJS_PATH, 'module.exports = {}')
    const subprocess = execSync('node ./bin/index.js init')
    expect(subprocess.toString()).toContain('config file already exists')
  })
  it('操作不存在应用', async () => {
    mockMonorepo()
    mockConfig()
    try {
      execSync('node ./bin/index.js deploy -a app app2')
    } catch (e: any) {
      expect(e.message).toContain('指定的应用app2不存在')
    }
  })
  it('deploy成功', async () => {
    mockMonorepo()
    mockConfig()
    const subprocess = execSync('node ./bin/index.js deploy -a app -n dev')
    expect(subprocess.toString()).toContain('应用 app 部署成功')
  })
  it('build成功', async () => {
    mockMonorepo()
    const subprocess = execSync('node ./bin/index.js build -a app')
    expect(subprocess.toString()).toContain('start build')
  })
  it('dev成功', async () => {
    mockMonorepo()
    const subprocess = execSync('node ./bin/index.js dev -a app')
    expect(subprocess.toString()).toContain('start dev')
  })
  it('genApi成功', async () => {
    mockConfig()
    const subprocess = execSync('node ./bin/index.js genApi -a pet')
    expect(subprocess.toString()).toContain('Generate api success')
  })
})
