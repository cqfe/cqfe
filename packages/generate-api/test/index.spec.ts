import * as path from 'path'
// import { generateApi } from '../src'
import { generateAPIClient } from '../src/tsGenerate'

describe('app', () => {
  it('generate openapi3 typescript and esm api', async () => {
    await generateAPIClient({
      openapiSpecPath: path.resolve(__dirname, './mocks/local-openapi3.json'),
      typesOutputPath: path.resolve(__dirname, 'apis-openapi3.d.ts'),
      tsApiOutputPath: path.resolve(__dirname, 'apis-openapi3.ts'),
      esmApiOutputPath: path.resolve(__dirname, 'apis-openapi3.js'),
      // jsdocOutputPath: path.resolve(__dirname, 'apis-openapi3.jsdoc.js'),
      servicePath: '@/utils/services',
    })
  })
  // it('should generate openapi v2', async () => {
  //   await generateApi({
  //     // url: path.resolve(__dirname, './mocks/v2.json'),
  //     url: path.resolve(__dirname, './mocks/local-test3.json'),
  //     outPut: path.resolve(__dirname, './apis-v2.js'),
  //     servicePath: 'import service from "@/utils/services"',
  //   })
  // })
  // xit('without jsDoc', async () => {
  //   generateApi({
  //     url: path.resolve(__dirname, './mocks/v2.json'),
  //     outPut: path.resolve(__dirname, './apis-v2-without-doc.js'),
  //     servicePath: 'import service from "@/utils/services"',
  //     generateRequestDoc: false,
  //   })
  // })
  // xit('should generate openapi v3', async () => {
  //   generateApi({
  //     url: path.resolve(__dirname, './mocks/v3.json'),
  //     outPut: path.resolve(__dirname, './apis-v3.js'),
  //     servicePath: 'import service from "@/utils/services"',
  //   })
  // })
  // xit('should generate remote', async () => {
  //   generateApi({
  //     url: 'https://pub-1252165219.cos.ap-chongqing.myqcloud.com/v2.json',
  //     outPut: path.resolve(__dirname, './apis-remote.js'),
  //     servicePath: 'import service from "@/utils/services"',
  //   })
  // })
})
