import { retry } from '../src/index';

describe('request test', () => {
  it('should retry success', async () => {
    let times = 0;
    const fn: () => Promise<string> = () => {
      return new Promise((resolve, reject) => {
        times++;
        setTimeout(() => {
          if (times === 3) {
            resolve('success');
          } else {
            reject('error');
          }
        }, 0);
      });
    };
    const res = await retry(fn, 1000, 3);
    expect(times).toEqual(3);
    expect(res).toEqual('success');
  });
  it('should retry fail', async () => {
    let times = 0;
    const fn: () => Promise<string> = () => {
      return new Promise((resolve, reject) => {
        times++;
        setTimeout(() => {
          reject('error');
        }, 0);
      });
    };
    await retry(fn, 1000, 3).catch(() => {});
    expect(times).toEqual(3);
  });
});
