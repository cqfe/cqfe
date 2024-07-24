import { execSync } from 'child_process'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { CONFIG_PATH } from '../src/constants'

const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'))

describe('scp-deploy', () => {
  beforeAll(() => {
    execSync('npm run build')
  })
  beforeEach(() => {
    if (existsSync(CONFIG_PATH)) {
      unlinkSync(CONFIG_PATH)
    }
  })
  afterAll(() => {
    if (existsSync(CONFIG_PATH)) {
      unlinkSync(CONFIG_PATH)
    }
  })
  it('should command version', async () => {
    const subprocess = execSync('node ./bin/index.js -v')
    expect(subprocess.toString()).toContain(pkg.version)
  })
  it('should command init', async () => {
    const subprocess = execSync('node ./bin/index.js init')
    expect(subprocess.toString()).toContain('config file .deploy.config.cjs created')
  })
  it('should command deploy', async () => {
    writeFileSync(
      CONFIG_PATH,
      `module.exports = {
  buildDir: 'dist',
  servers: [{
    namespace: 'test',
    host: '206.237.19.221',
    username: 'root',
    targetPath: '/var/tmp/dist2',
  }]
}`,
    )
    const subprocess = execSync('node ./bin/index.js deploy -n test')
    expect(subprocess.toString()).toContain('Deploy success')
  })
  it('should config exists', async () => {
    writeFileSync(CONFIG_PATH, 'module.exports = {}')
    const subprocess = execSync('node ./bin/index.js init')
    expect(subprocess.toString()).toContain('config file already exists')
  })
})
