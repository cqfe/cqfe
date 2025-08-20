import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { logger } from '../utils'
import { PROCESS_CWD } from '../constants'

export default function () {
  if (existsSync(resolve(PROCESS_CWD, '.sdfe.cjs'))) {
    logger.warn('config file already exists')
    return
  }
  writeFileSync(
    resolve(PROCESS_CWD, '.sdfe.cjs'),
    readFileSync(resolve(__dirname, '../../templates/config.tpl')) as unknown as string,
  )
  logger.success('config file .sdfe.cjs created')
}
