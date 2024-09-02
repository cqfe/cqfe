import { readableDuration, readableNumber, addSeparatorsInNumber } from '../src/index'

describe('readableDuration function', () => {
  test('should return "Invalid unit" for invalid unit', () => {
    expect(readableDuration(1000, 1, 'sm' as unknown as any)).toBe('Invalid unit')
  })

  test('should handle milliseconds correctly in English', () => {
    expect(readableDuration(1000, 1, 'ms', 'en')).toBe('1.0s')
    expect(readableDuration(5000, 2, 'ms', 'en')).toBe('5.00s')
  })

  test('should handle seconds correctly in English', () => {
    expect(readableDuration(60, undefined, undefined, 'en')).toBe('1.0m')
    expect(readableDuration(120, 2, 's', 'en')).toBe('2.00m')
  })

  test('should handle minutes correctly in English', () => {
    expect(readableDuration(60, 1, 'm', 'en')).toBe('1.0h')
    expect(readableDuration(120, 2, 'm', 'en')).toBe('2.00h')
  })

  test('should handle days correctly in English', () => {
    expect(readableDuration(24 * 60, 1, 'd', 'en')).toBe('3.9y')
    expect(readableDuration(48 * 60, 2, 'd', 'en')).toBe('7.89y')
  })

  test('should handle months correctly in English', () => {
    expect(readableDuration(12 * 30, 1, 'M', 'en')).toBe('29.6y')
    expect(readableDuration(12 * 60, 2, 'M', 'en')).toBe('59.18y')
  })

  test('should handle years correctly in English', () => {
    expect(readableDuration(1, 1, 'y', 'en')).toBe('1.0y')
    expect(readableDuration(2, 2, 'y', 'en')).toBe('2.00y')
  })

  test('should handle milliseconds correctly in Chinese', () => {
    expect(readableDuration(1000, 1, 'ms', 'zh')).toBe('1.0秒')
    expect(readableDuration(5000, 2, 'ms', 'zh')).toBe('5.00秒')
  })

  test('should handle seconds correctly in Chinese', () => {
    expect(readableDuration(60, 1, 's', 'zh')).toBe('1.0分钟')
    expect(readableDuration(120, 2, 's', 'zh')).toBe('2.00分钟')
  })

  test('should handle minutes correctly in Chinese', () => {
    expect(readableDuration(60, 1, 'm', 'zh')).toBe('1.0小时')
    expect(readableDuration(120, 2, 'm', 'zh')).toBe('2.00小时')
  })

  test('should handle days correctly in En', () => {
    expect(readableDuration(1, 1, 'd')).toBe('1.0d')
  })

  test('should handle days correctly in Chinese', () => {
    expect(readableDuration(1, 1, 'd', 'zh')).toBe('1.0天')
    expect(readableDuration(2, 2, 'd', 'zh')).toBe('2.00天')
  })

  test('should handle months correctly in En', () => {
    expect(readableDuration(1, 1, 'M')).toBe('1.0M')
  })

  test('should handle months correctly in Chinese', () => {
    expect(readableDuration(1, 1, 'M', 'zh')).toBe('1.0月')
    expect(readableDuration(2, 2, 'M', 'zh')).toBe('2.00月')
  })

  test('should handle years correctly in Chinese', () => {
    expect(readableDuration(1, 1, 'y', 'zh')).toBe('1.0年')
    expect(readableDuration(2, 2, 'y', 'zh')).toBe('2.00年')
  })

  test('should handle small values in milliseconds', () => {
    expect(readableDuration(500, 1, 'ms', 'en')).toBe('500ms')
    expect(readableDuration(500, 1, 'ms', 'zh')).toBe('500毫秒')
  })
})

describe('readableNumber function', () => {
  test('readableNumber should return the number itself if less than 1000', () => {
    expect(readableNumber(500)).toBe('500')
    expect(readableNumber(999)).toBe('999')
  })

  test('readableNumber should return "k+" suffix for numbers between 1000 and 100000', () => {
    expect(readableNumber(1000)).toBe('1.0k+')
    expect(readableNumber(123456, 2)).toBe('12.35w+')
    expect(readableNumber(5000, 0, 'zh')).toBe('5千+')
  })

  test('readableNumber should return "w+" suffix for numbers between 100000 and 10000000', () => {
    expect(readableNumber(1000000)).toBe('100.0w+')
    expect(readableNumber(2345678, 2)).toBe('234.57w+')
    expect(readableNumber(1234567, 0, 'zh')).toBe('123万+')
  })

  test('readableNumber should return "kw+" suffix for numbers between 10000000 and 100000000', () => {
    expect(readableNumber(50000000)).toBe('5.0kw+')
    expect(readableNumber(78901234, 2)).toBe('7.89kw+')
    expect(readableNumber(67890123, 0, 'zh')).toBe('7千万+')
  })

  test('readableNumber should return "gw+" suffix for numbers greater than 100000000', () => {
    expect(readableNumber(1000000000)).toBe('10.0gw+')
    expect(readableNumber(1234567890, 2)).toBe('12.35gw+')
    expect(readableNumber(9876543210, 0, 'zh')).toBe('99亿+')
  })
})

describe('addSeparatorsInNumber function', () => {
  test('should add separators to a whole number', () => {
    expect(addSeparatorsInNumber(1234567)).toBe('1,234,567')
  })

  test('should add separators to a number with decimal part', () => {
    expect(addSeparatorsInNumber(1234567.89)).toBe('1,234,567.89')
  })

  test('should handle small numbers correctly', () => {
    expect(addSeparatorsInNumber(123)).toBe('123')
    expect(addSeparatorsInNumber(12)).toBe('12')
    expect(addSeparatorsInNumber(1)).toBe('1')
  })

  test('should handle numbers with leading zeros', () => {
    expect(addSeparatorsInNumber(0)).toBe('0')
    expect(addSeparatorsInNumber('000123' as unknown as any)).toBe('123') // JavaScript converts leading zeros to integer
  })

  test('should handle numbers with no decimal part', () => {
    expect(addSeparatorsInNumber(10000)).toBe('10,000')
  })

  test('should handle numbers with negative values', () => {
    expect(addSeparatorsInNumber(-1234567)).toBe('-1,234,567')
    expect(addSeparatorsInNumber(-1234567.89)).toBe('-1,234,567.89')
  })

  test('should handle numbers ending in zero correctly', () => {
    expect(addSeparatorsInNumber(1000)).toBe('1,000')
    expect(addSeparatorsInNumber(1000000)).toBe('1,000,000')
  })
})
