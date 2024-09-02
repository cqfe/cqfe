import { pick, compact, omit } from '../src/index'

describe('pick function', () => {
  test('should return a new object with picked keys', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    }
    const keys = ['a', 'c']
    const result = pick(obj, keys)

    expect(result).toEqual({
      a: 1,
      c: 3,
    })
  })

  test('should return an empty object if no keys are provided', () => {
    const obj = {
      a: 1,
      b: 2,
    }
    const keys = []
    const result = pick(obj, keys)

    expect(result).toEqual({})
  })

  test('should handle cases where keys are not present in the object', () => {
    const obj = {
      a: 1,
      b: 2,
    }
    const keys = ['a', 'c', 'd']
    const result = pick(obj, keys)

    expect(result).toEqual({
      a: 1,
    })
  })

  test('should handle null or undefined as object input', () => {
    const keys = ['a', 'b']

    expect(() => pick(null as any, keys)).toThrow() // 假设我们期望null输入时抛出错误
    expect(() => pick(undefined as any, keys)).toThrow() // 假设我们期望undefined输入时抛出错误
  })

  test('should handle duplicate keys in the keys array', () => {
    const obj = {
      a: 1,
      b: 2,
    }
    const keys = ['a', 'a', 'b']
    const result = pick(obj, keys)

    expect(result).toEqual({
      a: 1,
      b: 2,
    })
  })

  test('should handle keys with special characters', () => {
    const obj = {
      'a.b': 1,
      'c-d': 2,
    }
    const keys = ['a.b', 'c-d']
    const result = pick(obj, keys)

    expect(result).toEqual({
      'a.b': 1,
      'c-d': 2,
    })
  })
})

describe('compact function', () => {
  test('compact removes falsy values from an array', () => {
    const result = compact([0, 1, false, 2, '', 3, null, undefined, 4])
    expect(result).toEqual([1, 2, 3, 4])
  })

  test('compact handles empty array', () => {
    const result = compact([])
    expect(result).toEqual([])
  })

  test('compact handles array with no falsy values', () => {
    const result = compact([1, 2, 3, 4, 5])
    expect(result).toEqual([1, 2, 3, 4, 5])
  })

  test('compact handles array with only falsy values', () => {
    const result = compact([0, false, '', null, undefined])
    expect(result).toEqual([])
  })

  test('compact does not mutate the original array', () => {
    const originalArray = [0, 1, false, 2]
    const result = compact(originalArray)
    expect(originalArray).toEqual([0, 1, false, 2])
    expect(result).toEqual([1, 2])
  })

  test('compact handles array with objects', () => {
    const result = compact([{ key: 'value' }, null, { anotherKey: 'anotherValue' }])
    expect(result).toEqual([{ key: 'value' }, { anotherKey: 'anotherValue' }])
  })

  test('compact handles nested arrays', () => {
    const result = compact([[1, 2], null, [3, 4]])
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ])
  })
  test('compact handles non-array types', () => {
    expect(() => compact(null as any)).toThrow(TypeError)
    expect(() => compact(undefined as any)).toThrow(TypeError)
    expect(() => compact(123 as any)).toThrow(TypeError)
    expect(() => compact('string' as any)).toThrow(TypeError)
    expect(() => compact(true as any)).toThrow(TypeError)
  })
})

describe('omit function', () => {
  test('should omit specified keys from an object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, ['b', 'c'])
    expect(result).toEqual({ a: 1 })
  })

  test('should not modify the original object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const originalObj = { ...obj }
    omit(obj, ['b', 'c'])
    expect(obj).toEqual(originalObj) // 这里的断言是为了检查 omit 函数的纯函数性质
  })

  test('should return the same object if no keys are specified to omit', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, [])
    expect(result).toEqual(obj)
  })

  test('should handle case when object does not contain keys to omit', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, ['d', 'e'])
    expect(result).toEqual(obj)
  })

  test('should handle empty object', () => {
    const obj = {}
    const result = omit(obj, ['a', 'b'])
    expect(result).toEqual({})
  })

  test('should handle undefined object', () => {
    const result = omit(undefined as any, ['a', 'b'])
    expect(result).toBeUndefined()
  })

  test('should handle undefined keys array', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, undefined as any)
    expect(result).toEqual(obj)
  })

  test('should handle empty string keys in keysToOmit', () => {
    const obj = { '': 'emptyKey', a: 1, b: 2 }
    const result = omit(obj, ['', 'b'])
    expect(result).toEqual({ a: 1 })
  })

  test('should handle null values in object', () => {
    const obj = { a: 1, b: null, c: 3 }
    const result = omit(obj, ['b'])
    expect(result).toEqual({ a: 1, c: 3 })
  })

  test('should handle nested objects correctly (although not explicitly required)', () => {
    const obj = { a: 1, b: { c: 2, d: 3 }, e: 4 }
    const result = omit(obj, ['b.d', 'e'])
    // Note: This test checks the behavior when attempting to omit nested keys,
    // which the current implementation doesn't support. Expected behavior is to not omit nested keys.
    expect(result).toEqual({ a: 1, b: { c: 2, d: 3 } })
  })
})
