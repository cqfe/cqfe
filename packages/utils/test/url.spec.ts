import { getQueryByKey, loadScript } from '../src/index';
import { JSDOM } from 'jsdom';

beforeAll(() => {
  const dom = new JSDOM();
  global.document = dom.window.document;
  // Object.defineProperty(global, 'document', dom.document);
});
describe('url test', () => {
  it('should get query by key', () => {
    const name = getQueryByKey('name', '?name=test&age=18');
    expect(name).toEqual('test');
  });
  it('should load script', () => {
    loadScript('https://cdn.jsdelivr.net/npm/@antv/g2plot@latest');
  });
});
