/*
 * @description: eslint 配置文件
 * @author: 李川
 * @update: 2024-08-15 10:31:24
 */
import { isReact, isVue } from './env'

const eslintExtends = []

if (isReact) {
  eslintExtends.push('./react')
} else if (isVue) {
  eslintExtends.push('./vue')
} else {
  eslintExtends.push('./typescript')
}

module.exports = {
  extends: eslintExtends,
}
