/* eslint-disable @typescript-eslint/no-var-requires */
import { resolve } from 'path'
import { getConfig, logger } from '../utils'
import { execSync } from 'child_process'
import { existsSync } from 'fs'

function execCmd(command: string) {
  logger.info(`[Exec] ${command}`)
  execSync(command, {
    stdio: [process.stdin, process.stdout, process.stderr],
  })
}

function clear(buildDir: string, targetFolderName: string) {
  // clear build dir
  logger.info('[Clear] buildDir and targetDir and zip')
  const buildPath = resolve(process.cwd(), buildDir)
  const targetPath = resolve(process.cwd(), targetFolderName)
  if (existsSync(buildPath)) {
    execCmd(`rm -rf ${buildPath}`)
  }
  if (existsSync(targetPath)) {
    execCmd(`rm -rf ${targetPath}`)
  }
  if (existsSync(`${targetPath}.zip`)) {
    execCmd(`rm ${targetPath}.zip`)
  }
}

export default function (option: { namespace: string[]; clear: boolean }) {
  const shouldClear = option.clear
  const namespace = option.namespace?.[0]
  if (!namespace) {
    throw new Error('namespace is required')
  }
  const config = getConfig(namespace)
  const { host, username, targetPath, buildCmd, buildDir, port, postCmd } = config
  const targetFolderName = targetPath.split('/').pop() || buildDir
  const outputRenameDir = resolve(process.cwd(), targetFolderName)
  clear(buildDir, targetFolderName)
  // build front end code
  logger.info(`Build ${buildCmd}`)
  execCmd(buildCmd)
  logger.success('Build success')
  // rename and zip
  if (buildDir !== targetFolderName) {
    execCmd(`mv ${resolve(process.cwd(), buildDir)} ${resolve(process.cwd(), targetFolderName)}`)
    logger.success('Rename] output dir name success')
  }
  execCmd(`zip -q -r ${targetFolderName}.zip ${targetFolderName}/`)
  logger.success('Zip output dir success')
  // upload code to server by scp
  const cmd = `scp -P ${port} ${outputRenameDir}.zip ${username}@${host}:${targetPath}.zip`
  // 填充密码
  const pwd = process.env[`PWD_${username}_${host.replace(/\./g, '_')}`]
  if (pwd) {
    execCmd(`echo ${pwd} | pbcopy`)
    logger.success('password copy success, please paste it to your terminal')
  } else {
    logger.warn('not found password, please set PWD_{username}_{host}(replace . to _) env var')
  }
  execCmd(cmd)
  logger.success('Upload scp success')
  if (shouldClear) clear(buildDir, targetFolderName)
  let loginCmd = `echo ${pwd} | pbcopy && ssh -p ${port} ${username}@${host}`
  if (postCmd) {
    loginCmd += ` "${postCmd}"`
  }
  execCmd(loginCmd)
}
