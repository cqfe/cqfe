import { existsSync, readdirSync } from 'fs'
import { IS_MULTI_REPO, MULTI_REPO_DIR, PROCESS_CWD } from './constants'
import { resolve } from 'path'
import prompts from 'prompts'
import { difference, isEmpty } from 'lodash'
import { logger } from './utils'

export default async function (options: Record<string, any>): Promise<string[]> {
  // 单应用直接返回当前工作目录
  if (!IS_MULTI_REPO) {
    logger.info('当前项目为Monorepo模式')
    return [PROCESS_CWD]
  }
  logger.info('当前项目为Multirepo模式')
  const microAppsDir = resolve(PROCESS_CWD, MULTI_REPO_DIR)
  const apps = readdirSync(microAppsDir)
  apps.unshift('All') // 添加一个选项用于选择所有应用
  // 多应用模式下，根据app配置或选择
  if (options.app?.length > 0) {
    // 返回全部
    if (options.app.map((item: string) => item.toLowerCase()).includes('all')) {
      return apps.map((app: string) => resolve(PROCESS_CWD, MULTI_REPO_DIR, app))
    }
    const invalidApps = difference(options.app, apps)
    if (invalidApps.length) {
      throw new Error(`指定的应用${invalidApps.join(',')}不存在`)
    }
    const appsPath = options.app.map((app: string) => resolve(PROCESS_CWD, MULTI_REPO_DIR, app))
    logger.info('HandleApps', appsPath)
    return appsPath
  } else {
    // 如果没有指定app，则返回所有应用目录
    const res = await prompts([
      {
        type: () => (!existsSync(microAppsDir) || isEmpty(microAppsDir) ? null : 'multiselect'),
        name: 'selectedApps',
        message: () =>
          !existsSync(microAppsDir) || isEmpty(microAppsDir)
            ? '请确保【microApps】目录下至少存在一个子应用代码'
            : '请选择子应用(可多选)',
        initial: 0,
        choices: apps.map((name) => ({ title: name, value: name })),
      },
    ])
    // 返回全部
    if (res.selectedApps?.map((item: string) => item.toLowerCase()).includes('all')) {
      return apps.map((app: string) => resolve(PROCESS_CWD, MULTI_REPO_DIR, app))
    }
    // 返回选中app
    const appsPath = res.selectedApps?.map((app: string) => resolve(PROCESS_CWD, MULTI_REPO_DIR, app))
    if (appsPath.length === 0) {
      throw new Error('未选择任何子应用，请重新运行命令')
    }

    logger.info('HandleApps', appsPath)
    return appsPath
  }
}
