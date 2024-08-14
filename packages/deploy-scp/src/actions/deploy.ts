/* eslint-disable @typescript-eslint/no-var-requires */
import { resolve } from 'path'
import { getConfig, logger } from '../utils'
import { execSync } from 'child_process'

export default function (option: { namespace: string[] }) {
  const namespace = option.namespace?.[0]
  if (!namespace) {
    throw new Error('namespace is required')
  }
  const config = getConfig(namespace)
  const { host, username, targetPath, buildCmd, buildDir, port } = config

  // build front end code
  logger.info(`[Build] ${buildCmd}`)
  execSync(buildCmd, {
    stdio: [process.stdin, process.stdout, process.stderr],
  })
  // build output dir
  const outputDir = resolve(process.cwd(), buildDir)
  // upload code to server by scp
  const cmd = `scp -P ${port} -r ${outputDir}/* ${username}@${host}:${targetPath}`
  logger.info(`[Upload] ${cmd}`)
  execSync(cmd, {
    stdio: [process.stdin, process.stdout, process.stderr],
  })
  logger.success('Deploy success')
}
