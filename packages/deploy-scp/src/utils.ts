import signale from 'signale'
import { CONFIG_PATH } from './constants'
import { DeployOption, ScpDeployOption, ServerOption } from './types'
import { isArray, isObject, pick } from 'lodash'

export const logger = signale.scope('scp-deploy')

export const getConfig = (namespace: string): DeployOption => {
  const defaultConfig = {
    port: 22,
    buildCmd: 'npm run build',
    buildDir: 'dist',
    username: 'root',
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const originConfig = require(CONFIG_PATH) as ScpDeployOption
  const config = { ...pick(defaultConfig, ['buildDir']), servers: [] as ServerOption[] } as ScpDeployOption
  if (isObject(config) === false) {
    throw new Error(`config file parse error, please remove and init agin, path: ${CONFIG_PATH}`)
  }
  Object.assign(config, pick(originConfig, ['buildDir']))
  if (isArray(originConfig.servers) === false || originConfig.servers.length < 1) {
    throw new Error('servers not found, please check config file')
  }
  originConfig.servers.forEach((item) => {
    config.servers.push({ ...pick(defaultConfig, ['port', 'username', 'buildCmd']), ...item })
  })
  const server = config.servers.find((item) => item.namespace === namespace)
  if (!server) {
    logger.fatal(`server not found, namespace: ${namespace}`)
    process.exit(1)
  }
  return { ...pick(config, ['buildDir']), ...server }
}
