import { spawnSync } from 'child_process'
import getApp from '../getApp'
import { ExecOptions } from '../types'
import { logger } from '../utils'

function execCmd(path: string, options: ExecOptions, extra: string[] = []) {
  const appName = path.split('/').pop()
  const { command, namespace = '@iot-os' } = options
  const res = spawnSync('pnpm', [`--filter=${namespace}/${appName}`, command, ...extra], {
    shell: true,
    stdio: 'inherit',
  })
  if (res.status !== 0) {
    logger.error(`Exec ${appName} ${command} error`)
    process.exit(1)
  }
  logger.success(`Exec ${appName} ${command} success`)
}

export default async function (options: ExecOptions, cmd: Record<string, any>) {
  // 需要构建的应用
  const apps = await getApp(options)
  logger.info('Exec args', JSON.stringify({ ...options, ...cmd.args }, undefined, 2))
  apps.forEach((app) => execCmd(app, options, cmd.args))
}
