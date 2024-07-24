import { getQueryByKey } from '../src/index';

describe('url test', () => {
  it('should get query by key', () => {
    const name = getQueryByKey('name', '?name=test&age=18');
    expect(name).toEqual('test');
  });
});
