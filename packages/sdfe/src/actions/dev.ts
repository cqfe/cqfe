import { spawnSync } from 'child_process'
import getApp from '../getApp'
import { BuildOptions } from '../types'
import { logger } from '../utils'

function devApp(path: string, extra: string[] = []) {
  const appName = path.split('/').pop()
  const res = spawnSync('npm', ['run', 'dev', ...extra], {
    cwd: path,
    stdio: 'inherit',
    shell: true,
  })
  if (res.status !== 0) {
    logger.error(`dev ${appName} error`)
    process.exit(1)
  }
  logger.success(`dev ${appName} success`)
}

export default async function (options: BuildOptions, cmd: Record<string, any>) {
  // 需要构建的应用
  const apps = await getApp(options)
  logger.info('dev args', JSON.stringify({ ...options, ...cmd.args }, undefined, 2))
  apps.forEach((app) => devApp(app, cmd.args))
}
