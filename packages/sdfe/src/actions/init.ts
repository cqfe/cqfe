import { APP_TEMPLATE_MAP, IS_MULTI_REPO, MULTI_REPO_DIR, PROCESS_CWD } from '../constants'
import prompts from 'prompts'
import { spawnSync } from 'child_process'
import { resolve } from 'path'
import { logger } from '../utils'

export default async function () {
  const resTemplate = await prompts([
    {
      type: 'select',
      name: 'template',
      message: '选择要初始化的项目模板',
      choices: Object.keys(APP_TEMPLATE_MAP).map((key: string) => ({
        title: APP_TEMPLATE_MAP[key].desc,
        value: key,
      })),
    },
  ])
  const resName = await prompts([
    {
      type: 'text',
      name: 'name',
      message: '请输入项目名称',
    },
  ])
  if (IS_MULTI_REPO && resTemplate.template === 'subDesktop') {
    // clone 子应用
    const resClone = spawnSync('git', ['clone', APP_TEMPLATE_MAP[resTemplate.template].url, resName.name], {
      cwd: resolve(PROCESS_CWD, MULTI_REPO_DIR),
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
      cwd: resolve(PROCESS_CWD, MULTI_REPO_DIR, resName.name),
      stdio: 'inherit',
    })
    if (resRm.status !== 0)
      logger.error(`删除.git 失败，请手动删除 cd ./${MULTI_REPO_DIR}/${resName.name} && rm -rf .git`)
    logger.success(`初始化子应用 ${MULTI_REPO_DIR}/${resName.name} 成功`)
  } else {
    // clone 项目
    const resClone = spawnSync('git', ['clone', APP_TEMPLATE_MAP[resTemplate.template].url, resName.name], {
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
