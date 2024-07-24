import * as path from 'path'
import generateApi from '../src'

describe('app', () => {
  it('should generate openapi v2', async () => {
    generateApi({
      url: path.resolve(__dirname, './mocks/v2.json'),
      outPut: path.resolve(__dirname, './apis-v2.js'),
      servicePath: '@/utils/services',
    })
  })
  it('without jsDoc', async () => {
    generateApi({
      url: path.resolve(__dirname, './mocks/v2.json'),
      outPut: path.resolve(__dirname, './apis-v2-without-doc.js'),
      servicePath: '@/utils/services',
      generateRequestDoc: false,
    })
  })
  it('should generate openapi v3', async () => {
    generateApi({
      url: path.resolve(__dirname, './mocks/v3.json'),
      outPut: path.resolve(__dirname, './apis-v3.js'),
      servicePath: '@/utils/services',
    })
  })
  it('should generate remote', async () => {
    generateApi({
      url: 'https://pub-1252165219.cos.ap-chongqing.myqcloud.com/v2.json',
      outPut: path.resolve(__dirname, './apis-remote.js'),
      servicePath: '@/utils/services',
    })
  })
})
