import { APP_TEMPLATE_MAP, GIT_FILE_URL, IS_MONO_REPO, MULTI_APP_DIR, PROCESS_CWD } from '../constants'
import prompts from 'prompts'
import { spawnSync } from 'child_process'
import { resolve } from 'path'
import { logger } from '../utils'

export default async function () {
  const templates = { ...APP_TEMPLATE_MAP }
  try {
    const remoteTemplates = await (await fetch(`${GIT_FILE_URL}/packages/sdfe/templates.json`)).json()
    Object.assign(templates, remoteTemplates)
  } catch (error) {
    logger.error('fetch remote templates error', error)
  }
  const resTemplate = await prompts([
    {
      type: 'select',
      name: 'template',
      message: '选择要初始化的项目模板',
      choices: Object.keys(templates).map((key: string) => ({
        title: templates[key].desc,
        value: key,
      })),
    },
  ])
  if (!resTemplate.template) process.exit(0)
  const resName = await prompts([
    {
      type: 'text',
      name: 'name',
      message: '请输入项目名称',
    },
  ])
  if (IS_MONO_REPO && ['subDesktop', 'subMobile'].includes(resTemplate.template)) {
    // clone 子应用
    const resClone = spawnSync('git', ['clone', templates[resTemplate.template].url, resName.name], {
      cwd: resolve(PROCESS_CWD, MULTI_APP_DIR),
      stdio: 'inherit',
    })
    if (resClone.status !== 0) return logger.error(`初始化子应用 ${resName.name} 失败`)
    // 安装依赖
    const resInstall = spawnSync('pnpm', ['install'], {
      stdio: 'inherit',
      shell: true,
    })
    if (resInstall.status !== 0) logger.error('安装依赖失败，请手动安装 pnpm install')
    // 删除 .git
    const resRm = spawnSync('rm', ['-rf', '.git'], {
      cwd: resolve(PROCESS_CWD, MULTI_APP_DIR, resName.name),
      stdio: 'inherit',
    })
    if (resRm.status !== 0)
      logger.error(`删除.git 失败，请手动删除 cd ./${MULTI_APP_DIR}/${resName.name} && rm -rf .git`)
    logger.success(`初始化子应用 ${MULTI_APP_DIR}/${resName.name} 成功`)
  } else {
    // clone 项目
    const resClone = spawnSync('git', ['clone', templates[resTemplate.template].url, resName.name], {
      stdio: 'inherit',
    })
    if (resClone.status !== 0) return logger.error(`初始化子应用 ${resName.name} 失败`)
    // 安装依赖
    const resInstall = spawnSync('pnpm', ['install'], {
      cwd: resolve(PROCESS_CWD, resName.name),
      stdio: 'inherit',
      shell: true,
    })
    if (resInstall.status !== 0) logger.error(`安装依赖失败，请手动安装 cd ./${resName.name} && pnpm install`)
    // 删除 .git
    const resRm = spawnSync('rm', ['-rf', '.git'], {
      cwd: resolve(PROCESS_CWD, resName.name),
      stdio: 'inherit',
    })
    if (resRm.status !== 0) logger.error(`删除.git 失败，请手动删除 cd ./${resName.name} && rm -rf .git`)
    logger.success(`初始化项目 ${resName.name} 成功`)
  }
}
