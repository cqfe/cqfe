import { setAccuracyTimeout, setAccuracyInterval } from '../src/timeout';

jest.useFakeTimers();

describe('timeout test', () => {
  it('should set accuracy timeout', () => {
    const callback = jest.fn();
    setAccuracyTimeout(callback, 100);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalled();
  });
  it('should cancel accuracy timeout', () => {
    const callback = jest.fn();
    const timer = setAccuracyTimeout(callback, 100);
    timer.cancel();
    expect(callback).not.toHaveBeenCalled();
  });
  it('should set accuracy interval', () => {
    const callback = jest.fn();
    setAccuracyInterval(callback, 100);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(9);
  });
  it('should cancel accuracy interval', () => {
    const callback = jest.fn();
    const timer = setAccuracyInterval(callback, 100);
    jest.advanceTimersByTime(500);
    timer.cancel();
    expect(callback).toHaveBeenCalledTimes(4);
  });
});
