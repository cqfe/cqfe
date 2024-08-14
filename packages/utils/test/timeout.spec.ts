import { setAccuracyTimeout, setAccuracyInterval, throttle, debounce } from '../src'

jest.useFakeTimers()

describe('timeout test', () => {
  it('[setAccuracyTimeout] should set accuracy timeout', () => {
    const callback = jest.fn()
    setAccuracyTimeout(callback, 100)
    jest.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalled()
  })
  it('[setAccuracyTimeout] should cancel accuracy timeout', () => {
    const callback = jest.fn()
    const timer = setAccuracyTimeout(callback, 100)
    timer.cancel()
    expect(callback).not.toHaveBeenCalled()
  })
  it('[setAccuracyInterval] should set accuracy interval', () => {
    const callback = jest.fn()
    setAccuracyInterval(callback, 100)
    jest.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(9)
  })
  it('[setAccuracyInterval] should cancel accuracy interval', () => {
    const callback = jest.fn()
    const timer = setAccuracyInterval(callback, 100)
    jest.advanceTimersByTime(500)
    timer.cancel()
    expect(callback).toHaveBeenCalledTimes(4)
  })
  it('[throttle] should call the function immediately if called for the first time', () => {
    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 1000)

    throttledFn()

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('[throttle] should not call the function again within the delay', () => {
    jest.useFakeTimers()

    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 1000)

    throttledFn()
    throttledFn() // Should not be called

    jest.runAllTimers()

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('[throttle] should call the function after the delay if called again', () => {
    jest.useFakeTimers()

    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 1000)

    throttledFn()
    jest.advanceTimersByTime(500) // Halfway through the delay
    throttledFn() // Should not be called yet

    jest.runAllTimers()

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('[throttle] should reset the delay after each successful call', () => {
    jest.useFakeTimers()

    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 1000)

    throttledFn()
    jest.advanceTimersByTime(1000) // Wait for the delay
    throttledFn() // Should be called immediately

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('[throttle] should handle multiple calls with different delays', () => {
    jest.useFakeTimers()

    const mockFn = jest.fn()
    const throttledFn = throttle(mockFn, 1000)

    throttledFn()
    throttledFn() // Should not be called yet
    jest.advanceTimersByTime(500) // Wait for half of the delay
    throttledFn() // Still should not be called
    jest.advanceTimersByTime(1000) // Wait for another 1000ms

    throttledFn() // Should be called now

    expect(mockFn).toHaveBeenCalledTimes(2)
  })
  it('[debounce] should delay the execution of the function', () => {
    jest.useFakeTimers()

    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn()
    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalled()

    jest.clearAllTimers()
  })

  it('[debounce] should only execute the function once during the delay', () => {
    jest.useFakeTimers()

    const mockFn = jest.fn()
    const debouncedFn = debounce(mockFn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    expect(mockFn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(1)

    jest.clearAllTimers()
  })
})
