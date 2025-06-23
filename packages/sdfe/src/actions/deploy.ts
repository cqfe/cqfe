import { resolve } from 'path'
import getApp from '../getApp'
import { DeployCmdInterface, ServerOption } from '../types'
import { getAppOutput, getConfig, logger } from '../utils'
import { existsSync } from 'fs'
import { NodeSSH } from 'node-ssh'
import { execSync } from 'child_process'
import prompts from 'prompts'

const ssh = new NodeSSH()

async function sshConnect(server: ServerOption) {
  // 填充密码
  let pwd = process.env[`PWD_${server.user}_${server.host.replace(/\./g, '_')}`]
  if (pwd) {
    execSync(`echo ${pwd} | pbcopy`)
    logger.success('环境变量读取密码成功')
  } else {
    logger.warn(`未读取到环境变量(PWD_${server.user}_${server.host.replace(/\./g, '_')})密码`)
    const pwdRl = await prompts([
      {
        type: 'text',
        name: 'value',
        message: '请输入密码',
      },
    ])
    pwd = pwdRl.value
  }
  await ssh
    .connect({
      host: server.host,
      username: server.user,
      port: server.port || 22,
      tryKeyboard: true,
      password: pwd,
    })
    .catch((err) => {
      logger.error('ssh connect error', err)
      process.exit(1)
    })
}

async function deployApp(path: string, server: ServerOption) {
  const appName = path.split('/').pop()
  logger.info(`[Deploy] 开始部署应用: ${appName} 到服务器: ${server.host}${server.path}`)
  const outputDir = getAppOutput(path)
  if (!existsSync(resolve(path, outputDir))) {
    logger.error(`应用 ${appName} 的输出目录 ${outputDir} 不存在，请先执行构建命令`)
    return Promise.resolve()
  }
  const status = await ssh.putDirectory(resolve(path, outputDir), `${server.path}/${appName}`, {
    recursive: true,
    concurrency: 10,
  })
  if (status) {
    logger.success(`应用 ${appName} 部署成功`)
  } else {
    logger.error(`应用 ${appName} 部署失败`)
  }
}

export default async function (options: Partial<DeployCmdInterface> = {}) {
  // 需要发布的应用
  const apps = await getApp(options)
  // 配置
  const conf = getConfig()
  const serverInfo = {} as ServerOption
  if (!conf.deploy?.length) {
    throw new Error('未找到部署配置,请检查[deploy]配置项')
  }
  if (options.namespace) {
    const ret = conf.deploy.find((item) => item.namespace === options.namespace)
    if (!ret) {
      throw new Error(`未找到deploy.${options.namespace}的配置`)
    }
    Object.assign(serverInfo, ret)
  } else {
    // 如果没有指定命名空间，则使用第一个配置
    Object.assign(serverInfo, conf.deploy[0])
  }
  logger.info('deploy args', JSON.stringify({ ...serverInfo }, undefined, 2))
  await sshConnect(serverInfo)
  for (const app of apps) {
    await deployApp(app, serverInfo)
  }
  ssh.dispose()
}
