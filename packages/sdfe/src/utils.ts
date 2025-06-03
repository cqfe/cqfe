import signale from 'signale'
import { SdfeOptions } from './types'
import { resolve, dirname } from 'path'
import { existsSync } from 'fs'
import { PROCESS_CWD } from './constants'

export const logger = signale.scope('SDFE')

// 查找配置文件，支持 .cdfe.js 和 .cdfe.cjs，从当前目录递归向上查找
export function findConfigFile(startDir: string = PROCESS_CWD): string | null {
  let dir = startDir
  let filePath: string | null = null
  while (!filePath) {
    const configPath = resolve(dir, '.sdfe.cjs')
    filePath = existsSync(configPath) ? configPath : null
    const parent = dirname(dir)
    if (parent === dir) break // 已到根目录
    dir = parent
  }
  return filePath
}

// 读取合并配置文件
export function getConfig(): SdfeOptions {
  const configPath = findConfigFile()
  if (!configPath) {
    logger.warn('未找到配置文件 .sdfe.cjs')
    return {} as SdfeOptions
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let originConfig = require(configPath) as any
  originConfig = (originConfig.default || originConfig) as SdfeOptions // 获取默认导出或整个模块
  return originConfig
}

// 获取app输出目录
export async function getAppOutput(path: string) {
  let outputDir = 'dist'
  try {
    let viteConf
    try {
      viteConf = require(resolve(path, 'vite.config.js'))
    } catch (e: any) {
      viteConf = (await import(resolve(path, 'vite.config.js'))).default
    }

    if (viteConf && viteConf.build && viteConf.build.output) {
      outputDir = viteConf.build.output
    }
  } catch (e: any) {
    logger.warn(`无法读取 ${path}/vite.config.js 文件，将使用默认输出目录 'dist'。错误信息: ${e.message}`)
  }
  return outputDir
}
