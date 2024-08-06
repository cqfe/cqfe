import { toFirstUpper } from '../src/index';

describe('string test', () => {
  it('should upper success', async () => {
    const ret = toFirstUpper('test');
    expect(ret).toEqual('Test');
  });
  it('should upper empty', async () => {
    const ret = toFirstUpper('');
    expect(ret).toEqual('');
  });
});
