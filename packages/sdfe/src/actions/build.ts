import { execSync, spawnSync } from 'child_process'
import getApp from '../getApp'
import { BuildOptions } from '../types'
import { getAppOutput, getConfig, logger } from '../utils'
import { resolve } from 'path'
import { PROCESS_CWD } from '../constants'
import { existsSync, mkdirSync } from 'fs'
import { isUndefined } from 'lodash'

async function buildApp(path: string, options: BuildOptions, extra: string[] = []) {
  const appName = path.split('/').pop()
  const res = spawnSync('npm', ['run', 'build', ...extra], {
    cwd: path,
    stdio: 'inherit',
    shell: true,
  })
  if (res.status !== 0) {
    logger.error(`构建 ${appName} 失败`)
    process.exit(1)
  }
  const conf = getConfig()
  const copy = isUndefined(options.copy) ? conf.build?.copy : options.copy
  const zip = isUndefined(options.zip) ? conf.build?.zip : options.zip
  const output = getAppOutput(path)
  try {
    if (zip) {
      execSync(`cd ${path} && zip -r ${output}.zip ${output}`)
      logger.success(`zip success: ${resolve(path, output)}.zip`)
    }
    if (copy) {
      if (!existsSync(resolve(PROCESS_CWD, copy))) {
        mkdirSync(resolve(PROCESS_CWD, copy), { recursive: true })
      }
      execSync(`cp -rf ${path}/${output} ${resolve(PROCESS_CWD, copy)}`)
      logger.success(`copy success: ${resolve(PROCESS_CWD, copy)}/${output}`)
      if (zip) {
        execSync(`cp -rf ${path}/${output}.zip ${resolve(PROCESS_CWD, copy)}`)
      }
    }
  } catch (_err) {}
  logger.success(`build ${appName} success`)
}

export default async function (options: BuildOptions, cmd: Record<string, any>) {
  // 需要构建的应用
  const apps = await getApp(options)
  logger.info('build args', JSON.stringify({ ...options, ...cmd.args }, undefined, 2))
  await Promise.all(apps.map((app) => buildApp(app, options, cmd.args)))
}
