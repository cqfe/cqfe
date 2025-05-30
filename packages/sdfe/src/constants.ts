import { existsSync } from 'fs'

// 配置件名称
export const CONFIG_NAME = '.sdfe'
// 配置文件后缀名
export const CONFIG_SUFFIX = ['.js', '.cjs']
// 进程当前工作目录
export const PROCESS_CWD = process.cwd()
// monorepo 模式下的应用目录
export const MONOREPO_DIR = 'microApps'
// 当前项目是否是 monorepo
export const IS_MONOREPO =
  existsSync(`${PROCESS_CWD}/pnpm-workspace.yaml`) && existsSync(`${PROCESS_CWD}/${MONOREPO_DIR}`)
