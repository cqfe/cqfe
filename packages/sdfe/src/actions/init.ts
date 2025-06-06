import { APP_TEMPLATE_MAP, IS_MONOREPO, MONOREPO_DIR, PROCESS_CWD } from '../constants'
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
  if (IS_MONOREPO && resTemplate.template === 'subDesktop') {
    // clone 子应用
    spawnSync('git', ['clone', APP_TEMPLATE_MAP[resTemplate.template].url, resName.name], {
      cwd: resolve(PROCESS_CWD, MONOREPO_DIR),
      stdio: 'inherit',
    })
    // 安装依赖
    spawnSync('pnpm', ['install'], {
      stdio: 'inherit',
    })
    // 删除 .git
    spawnSync('rm', ['-rf', '.git'], {
      cwd: resolve(PROCESS_CWD, MONOREPO_DIR, resName.name),
      stdio: 'inherit',
    })
    logger.success(`初始化子应用 ${MONOREPO_DIR}/${resName.name} 成功`)
  } else {
    // clone 项目
    spawnSync('git', ['clone', APP_TEMPLATE_MAP[resTemplate.template].url, resName.name], {
      stdio: 'inherit',
    })
    // 安装依赖
    spawnSync('pnpm', ['install'], {
      cwd: resolve(PROCESS_CWD, resName.name),
      stdio: 'inherit',
    })
    // 删除 .git
    spawnSync('rm', ['-rf', '.git'], {
      cwd: resolve(PROCESS_CWD, resName.name),
      stdio: 'inherit',
    })
    logger.success(`初始化项目 ${resName.name} 成功`)
  }
}
