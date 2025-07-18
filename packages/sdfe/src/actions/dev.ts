import { spawn } from 'child_process'
import getApp from '../getApp'
import { BuildOptions } from '../types'
import { logger } from '../utils'

function devApp(path: string, extra: string[] = []) {
  spawn('npm', ['run', 'dev', ...extra], {
    cwd: path,
    stdio: 'inherit', // 将子进程的标准输入输出绑定到父进程
  })
  const appName = path.split('/').pop()
  logger.success(`dev ${appName} success`)
}

export default async function (options: BuildOptions, cmd: Record<string, any>) {
  // 需要构建的应用
  const apps = await getApp(options)
  logger.info('dev args', JSON.stringify({ ...options, ...cmd.args }, undefined, 2))
  apps.forEach((app) => devApp(app, cmd.args))
}
