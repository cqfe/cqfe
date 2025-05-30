import { GenerateApiOptions } from '../types'
import { generateApi } from '@cqfe/generate-api'
import { getConfig, logger } from '../utils'

export default async function (options: GenerateApiOptions) {
  if (!options.app) {
    throw new Error('app is required, input -a or --app option')
  }
  const config = await getConfig()
  if (!config.genApi) {
    throw new Error('genApi is required in sdfe.config.js')
  }
  const apiConfig = config.genApi.find((item) => item.app === options.app)
  if (!apiConfig) {
    throw new Error(`app ${options.app} not found in .sdfe.js genApi`)
  }
  const output = options.output || apiConfig.output
  const url = options.url || apiConfig.url
  await generateApi({
    ...apiConfig,
    url,
    outPut: output,
    servicePath: apiConfig.service,
  })
  logger.success('Generate api success')
}
