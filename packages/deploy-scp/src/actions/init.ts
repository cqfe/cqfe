import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { logger } from '../utils'
import { CONFIG_NAME, CONFIG_PATH } from '../constants'

export default function () {
  if (existsSync(CONFIG_PATH)) {
    logger.warn('config file already exists')
    return
  }
  writeFileSync(CONFIG_PATH, readFileSync(resolve(__dirname, '../../templates/config.tpl')))
  logger.success(`config file ${CONFIG_NAME} created`)
}
