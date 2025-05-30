import { resolve } from 'path'
import getApp from '../getApp'
import { DeployCmdInterface, ServerOption } from '../types'
import { getConfig, logger } from '../utils'
import { existsSync } from 'fs'

async function deployApp(path: string, server: ServerOption) {
  const appName = path.split('/').pop()
  logger.info(`[Deploy] 开始部署应用: ${appName} 到服务器: ${server.host}/${server.path}`)
  let outputDir = 'dist'
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const viteConf = require(resolve(path, 'vite.config.js'))
    if (viteConf.build?.outDir) {
      outputDir = viteConf.build.outDir
    }
  } catch (error) {
    console.warn(`未找到 ${appName} 的vite.config.js,使用默认输出目录dist`)
  }
  if (!existsSync(resolve(path, outputDir))) {
    throw new Error(`应用 ${appName} 的输出目录 ${outputDir} 不存在，请先执行构建命令`)
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
      throw new Error(`未找到命名空间${options.namespace}的配置`)
    }
    Object.assign(serverInfo, ret)
  } else {
    // 如果没有指定命名空间，则使用第一个配置
    Object.assign(serverInfo, conf.deploy[0])
  }
  for (const app of apps) {
    await deployApp(app, serverInfo)
  }
}
