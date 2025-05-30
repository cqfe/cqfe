import signale from 'signale'
import { SdfeOptions } from './types'
import { resolve, dirname } from 'path'
import { existsSync } from 'fs'
import { CONFIG_NAME, CONFIG_SUFFIX, PROCESS_CWD } from './constants'

export const logger = signale.scope('SDFE')

export function existsConfigFile(dir: string = PROCESS_CWD): string | null {
  let ret: string | null = null
  CONFIG_SUFFIX.forEach((suffix) => {
    const fileName = CONFIG_NAME + suffix
    const filePath = resolve(dir, fileName)
    if (existsSync(filePath) && !ret) ret = filePath
  })
  return ret
}

// 查找配置文件，支持 .cdfe.js 和 .cdfe.cjs，从当前目录递归向上查找
export function findConfigFile(startDir: string = PROCESS_CWD): string | null {
  let dir = startDir
  let filePath: string | null = null
  while (!filePath) {
    filePath = existsConfigFile(dir)
    const parent = dirname(dir)
    if (parent === dir) break // 已到根目录
    dir = parent
  }
  return filePath
}

// 读取合并配置文件
export async function getConfig(): Promise<SdfeOptions> {
  const configPath = findConfigFile()
  if (!configPath) {
    logger.warn('未找到配置文件 .sdfe.js 或 .sdfe.cjs')
    return {} as SdfeOptions
  }
  try {
    const originConfig = await import(configPath)
    return originConfig.default as SdfeOptions
  } catch (err) {
    // 如果 import 失败，尝试使用 require
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const originConfig = require(configPath) as SdfeOptions
      return originConfig
    } catch (err) {
      logger.error('读取配置文件失败', err)
      return {} as SdfeOptions
    }
  }
}

// 获取app输出目录
export async function getAppOutput(path: string) {
  let outputDir = 'dist'
  try {
    logger.info('viteConf', resolve(path, 'vite.config.js'))
    let viteConfModule
    try {
      // 尝试使用 import() 动态导入，支持 ES Module
      viteConfModule = await import(resolve(path, 'vite.config.js'))
    } catch (e) {
      // 如果 import 失败，尝试使用 require()，支持 CommonJS
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      viteConfModule = require(resolve(path, 'vite.config.js'))
    }

    const viteConf = viteConfModule.default || viteConfModule // 获取默认导出或整个模块

    if (viteConf && viteConf.build && viteConf.build.output) {
      outputDir = viteConf.build.output
    }
  } catch (e: any) {
    logger.warn(`无法读取 ${path}/vite.config.js 文件，将使用默认输出目录 'dist'。错误信息: ${e.message}`)
  }
  return outputDir
}
