import { existsSync } from 'fs'

// 进程当前工作目录
export const PROCESS_CWD = process.cwd()
// monorepo 模式下的应用目录
export const MULTI_REPO_DIR = 'microApps'
// 当前项目是否是 monorepo
export const IS_MULTI_REPO =
  existsSync(`${PROCESS_CWD}/pnpm-workspace.yaml`) && existsSync(`${PROCESS_CWD}/${MULTI_REPO_DIR}`)

export const GIT_SDFE_URL = 'https://github.com/cqfe/cqfe/tree/main/packages/sdfe'
export const APP_TEMPLATE_MAP = {
  desktop: {
    desc: 'vue：桌面端模板',
    url: 'https://github.com/cqfe/template-vue.git',
  },
} as Record<string, { desc: string; url: string }>
