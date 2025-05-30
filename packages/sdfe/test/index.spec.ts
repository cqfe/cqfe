import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const CONFIG_PATH = resolve(__dirname, '../.sdfe.cjs')
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))

// 模拟 monorepo 模式下的应用目录和配置文件
function mockMonorepo() {
  writeFileSync(resolve(__dirname, 'pnpm-workspace.yaml'), '')
  mkdirSync(resolve(__dirname, 'microApps/test'), { recursive: true })
}
// 清除 monorepo 模式下的应用目录和配置文件
function clearMonorepo() {
  unlinkSync(resolve(__dirname, 'pnpm-workspace.yaml'))
  if (existsSync(resolve(__dirname, 'microApps/test'))) {
    unlinkSync(resolve(__dirname, 'microApps/test'))
  }
  if (existsSync(resolve(__dirname, 'microApps'))) {
    unlinkSync(resolve(__dirname, 'microApps'))
  }
}
// 清除配置文件
function clearConfig() {
  if (existsSync(CONFIG_PATH)) {
    unlinkSync(CONFIG_PATH)
  }
}

describe('SDFE', () => {
  beforeAll(() => {
    execSync('npm run build')
  })
  beforeEach(() => {
    clearConfig()
  })
  afterAll(() => {
    clearConfig()
    // clearMonorepo()
  })
  it('获取版本号', async () => {
    const subprocess = execSync('node ./bin/index.js -v')
    expect(subprocess.toString()).toContain(pkg.version)
  })
  it('初始化配置文件', async () => {
    const subprocess = execSync('node ./bin/index.js init')
    expect(subprocess.toString()).toContain('config file .sdfe.cjs created')
  })
  it('配置存在', async () => {
    writeFileSync(CONFIG_PATH, 'module.exports = {}')
    const subprocess = execSync('node ./bin/index.js init')
    expect(subprocess.toString()).toContain('config file already exists')
  })
  it('操作不存在应用', async () => {
    clearMonorepo()
    mockMonorepo()
    const subprocess = execSync('node ./bin/index.js deploy -a test test2')
    expect(subprocess.toString()).toContain('指定的应用test2不存在')
  })
  it('should command deploy', async () => {
    mockMonorepo()
    execSync('node ./bin/index.js deploy -a support venue -n test')
    // expect(subprocess.toString()).toContain('config file .sdfe.cjs created')
  })
})
