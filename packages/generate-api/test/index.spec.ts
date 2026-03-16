import * as path from 'path'
import generateAPIClient from '../src/index'

describe('app', () => {
  it('generate openapi3 api', async () => {
    await generateAPIClient({
      fileName: 'apis-openapi3',
      url: path.resolve(__dirname, './mocks/local-openapi3.json'),
      output: path.resolve(__dirname, './output'),
      generateJs: true,
      generateTs: true,
      service: "import service from '@/utils/services'",
    })
  })
  it('generate swagger v2 api', async () => {
    await generateAPIClient({
      fileName: 'apis-v2',
      url: path.resolve(__dirname, './mocks/v2.json'),
      output: path.resolve(__dirname, './output'),
      generateJs: true,
      generateTs: true,
      service: "import service from '@/utils/services'",
    })
  })
})
