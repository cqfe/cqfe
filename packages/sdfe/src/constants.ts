import { existsSync } from 'fs'

// 进程当前工作目录
export const PROCESS_CWD = process.cwd()
// monorepo 模式下的应用目录
export const MULTI_REPO_DIR = 'microApps'
// 当前项目是否是 monorepo
export const IS_MULTI_REPO =
  existsSync(`${PROCESS_CWD}/pnpm-workspace.yaml`) && existsSync(`${PROCESS_CWD}/${MULTI_REPO_DIR}`)

export const APP_TEMPLATE_MAP = {
  desktop: {
    desc: 'vue：桌面端模板',
    url: 'https://github.com/cqfe/template-vue.git',
  },
  subDesktop: {
    desc: 'vue：子应用模板(如果是多应用根目录，自动初始化到microApps目录下)',
    url: 'https://github.com/cqfe/template-sub-vue.git',
  },
  mobile: {
    desc: 'taro：移动端模板',
    url: 'https://github.com/cqfe/template-taro.git',
  },
} as Record<string, { desc: string; url: string }>
