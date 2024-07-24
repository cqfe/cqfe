import { resolve } from 'path'

export const CONFIG_NAME = '.deploy.config.cjs'
export const CONFIG_PATH = resolve(process.cwd(), CONFIG_NAME)
