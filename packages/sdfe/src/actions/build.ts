import { execSync, spawnSync } from 'child_process'
import getApp from '../getApp'
import { BuildOptions } from '../types'
import { getAppOutput, logger } from '../utils'
import { resolve } from 'path'
import { PROCESS_CWD } from '../constants'
import { existsSync, mkdirSync } from 'fs'

async function buildApp(path: string, options: BuildOptions, extra: string[] = []) {
  spawnSync('npm', ['run', 'build', ...extra], {
    cwd: path,
    stdio: 'inherit', // 将子进程的标准输入输出绑定到父进程
  })
  const appName = path.split('/').pop()
  const output = getAppOutput(path)
  if (options.zip) {
    execSync(`cd ${path} && zip -r ${output}.zip ${output}`)
    logger.success(`zip success: ${resolve(path, output)}.zip`)
  }
  if (options.copy) {
    if (!existsSync(resolve(PROCESS_CWD, options.copy))) {
      mkdirSync(resolve(PROCESS_CWD, options.copy), { recursive: true })
    }
    execSync(`cp -rf ${path}/${output} ${resolve(PROCESS_CWD, options.copy)}`)
    logger.success(`copy success: ${resolve(PROCESS_CWD, options.copy)}/${output}`)
    if (options.zip) {
      execSync(`cp -rf ${path}/${output}.zip ${resolve(PROCESS_CWD, options.copy)}`)
    }
  }
  logger.success(`build ${appName} success`)
}

export default async function (options: BuildOptions, cmd: Record<string, any>) {
  // 需要构建的应用
  const apps = await getApp(options)
  await Promise.all(apps.map((app) => buildApp(app, options, cmd.args)))
}
