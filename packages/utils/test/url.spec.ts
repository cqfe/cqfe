import { getQueryByKey, loadScript } from '../src/index'

beforeEach(() => {
  Object.defineProperty(window, 'location', {
    value: new URL('https://www.example.com?name=test&age=18'),
    writable: true, // possibility to override
  })
})
describe('url test', () => {
  it('should get custom query by key', () => {
    const name = getQueryByKey('name', '?name=test&age=18')
    expect(name).toEqual('test')
  })
  it('should get location query by key', () => {
    const name = getQueryByKey('name')
    expect(name).toEqual('test')
  })
  it('should load script', () => {
    loadScript('https://cdn.jsdelivr.net/npm/@antv/g2plot@latest')
  })
})
