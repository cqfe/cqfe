/* eslint-disable @typescript-eslint/no-var-requires */
import { resolve } from 'path'
import { getConfig, logger } from '../utils'
import { execSync } from 'child_process'
import { existsSync } from 'fs'

function execCmd(command: string) {
  execSync(command, {
    stdio: [process.stdin, process.stdout, process.stderr],
  })
}

function clear(buildDir: string, targetDirName: string) {
  // clear build dir
  logger.info('[Clear] buildDir and targetDir and zip')
  const buildPath = resolve(process.cwd(), buildDir)
  const targetPath = resolve(process.cwd(), targetDirName)
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

export default function (option: { namespace: string[] }) {
  const namespace = option.namespace?.[0]
  if (!namespace) {
    throw new Error('namespace is required')
  }
  const config = getConfig(namespace)
  const { host, username, targetPath, buildCmd, buildDir, port } = config
  const targetDirName = targetPath.split('/').pop() || buildDir
  const outputRenameDir = resolve(process.cwd(), targetDirName)
  clear(buildDir, targetDirName)
  // build front end code
  logger.info(`[Build] ${buildCmd}`)
  execCmd(buildCmd)
  // rename and zip
  execCmd(`mv ${resolve(process.cwd(), buildDir)} ${resolve(process.cwd(), targetDirName)}`)
  execCmd(`zip -q -r ${targetDirName}.zip ${targetDirName}/`)
  // upload code to server by scp
  const cmd = `scp -P ${port} ${outputRenameDir}.zip ${username}@${host}:${targetPath}.zip`
  // 填充密码
  const pwd = process.env[`PWD_${username}_${host.replace(/\./g, '_')}`]
  if (pwd) {
    execCmd(`echo ${pwd} | pbcopy`)
  }
  logger.info(`[Upload] ${cmd}`)
  execCmd(cmd)
  logger.success('Deploy success')
  clear(buildDir, targetDirName)
  logger.success(`[ServerCmd] cd ${targetPath}`)
  execCmd(`echo ${pwd} | pbcopy && ssh -p ${port} ${username}@${host}`)
}
