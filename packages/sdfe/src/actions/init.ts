import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { existsConfigFile, logger } from '../utils'
import { CONFIG_NAME, PROCESS_CWD } from '../constants'

export default function () {
  if (existsConfigFile()) {
    logger.warn('config file already exists')
    return
  }
  writeFileSync(
    resolve(PROCESS_CWD, `${CONFIG_NAME}.cjs`),
    readFileSync(resolve(__dirname, '../../templates/config.tpl')),
  )
  logger.success(`config file ${CONFIG_NAME}.cjs created`)
}
