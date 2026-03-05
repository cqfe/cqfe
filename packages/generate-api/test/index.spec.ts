import * as path from 'path'
import generateAPIClient from '../src/index'

describe('app', () => {
  it('generate openapi3 and esm api', async () => {
    await generateAPIClient({
      url: path.resolve(__dirname, './mocks/local-openapi3.json'),
      output: path.resolve(__dirname, './output/apis-openapi3.js'),
      service: '@/utils/services',
    })
  })
  it('generate openapi3 and typescript api', async () => {
    await generateAPIClient({
      url: path.resolve(__dirname, './mocks/local-openapi3.json'),
      tsOutput: path.resolve(__dirname, './output/apis-openapi3.ts'),
      service: '@/utils/services',
    })
  })
  it('should generate swagger v2 typescript', async () => {
    await generateAPIClient({
      url: path.resolve(__dirname, './mocks/v2.json'),
      tsOutput: path.resolve(__dirname, './output/apis-v2.ts'),
      service: 'import service from "@/utils/services"',
    })
  })
  it('should generate swagger v2 esm', async () => {
    await generateAPIClient({
      url: path.resolve(__dirname, './mocks/v2.json'),
      output: path.resolve(__dirname, './output/apis-v2.js'),
      service: 'import service from "@/utils/services"',
    })
  })
})
