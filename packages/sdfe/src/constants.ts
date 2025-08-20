import { existsSync } from 'fs'

// 进程当前工作目录
export const PROCESS_CWD = process.cwd()
// monorepo 模式下的应用目录
export const MULTI_APP_DIR = 'microApps'
// 当前项目是否是 monorepo
export const IS_MONO_REPO =
  existsSync(`${PROCESS_CWD}/pnpm-workspace.yaml`) && existsSync(`${PROCESS_CWD}/${MULTI_APP_DIR}`)
// git文件地址
export const GIT_FILE_URL = 'https:///raw.githubusercontent.com/cqfe/cqfe/main'
// 可初始化模版
export const APP_TEMPLATE_MAP = {
  desktop: {
    desc: 'Web应用：vue3 + vite4 + antdv',
    url: 'https://github.com/cqfe/template-vue.git',
  },
} as Record<string, { desc: string; url: string }>
