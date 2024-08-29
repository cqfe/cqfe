/**
 * 将时间值转换为可读性更高的字符串表示形式
 *
 * @param value 时间值
 * @param fixed 保留的小数位数，默认为 1
 * @param unit 时间单位，可选值为 'ms'（毫秒）、's'（秒）、'm'（分钟）、'd'（天）、'M'（月）、'y'（年）
 * @param lang 单位语言，可选值为 'en'（英文）或 'zh'（中文），默认为 'en'
 * @returns 可读性更高的字符串表示形式
 */
export function readableDuration(
  value: number,
  fixed = 1,
  unit: 'ms' | 's' | 'm' | 'd' | 'M' | 'y' = 's',
  lang: 'en' | 'zh' = 'en',
) {
  let years = 0
  let months = 0
  let days = 0
  const hours = 0
  let minutes = 0
  let seconds = 0
  let milliseconds = 0
  let ret = ''

  switch (unit) {
    case 'ms':
      milliseconds = value
      break
    case 's':
      seconds = value
      break
    case 'm':
      minutes = value
      break
    case 'd':
      days = value
      break
    case 'M':
      months = value
      break
    case 'y':
      years = value
      break
    default:
      return 'Invalid unit'
  }

  // 将所有单位转换为毫秒
  const totalMilliseconds =
    years * 365 * 24 * 60 * 60 * 1000 +
    months * 30 * 24 * 60 * 60 * 1000 +
    days * 24 * 60 * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000 +
    milliseconds

  if (totalMilliseconds >= 365 * 24 * 60 * 60 * 1000) {
    ret = (totalMilliseconds / (365 * 24 * 60 * 60 * 1000)).toFixed(fixed)
    ret += lang === 'en' ? 'y' : '年'
    return ret
  } else if (totalMilliseconds >= 30 * 24 * 60 * 60 * 1000) {
    ret = (totalMilliseconds / (30 * 24 * 60 * 60 * 1000)).toFixed(fixed)
    ret += lang === 'en' ? 'M' : '月'
    return ret
  } else if (totalMilliseconds >= 24 * 60 * 60 * 1000) {
    ret = (totalMilliseconds / (24 * 60 * 60 * 1000)).toFixed(fixed)
    ret += lang === 'en' ? 'd' : '天'
    return ret
  } else if (totalMilliseconds >= 60 * 60 * 1000) {
    ret = (totalMilliseconds / (60 * 60 * 1000)).toFixed(fixed)
    ret += lang === 'en' ? 'h' : '小时'
    return ret
  } else if (totalMilliseconds >= 60 * 1000) {
    ret = (totalMilliseconds / (60 * 1000)).toFixed(fixed)
    ret += lang === 'en' ? 'm' : '分钟'
    return ret
  } else if (totalMilliseconds >= 1000) {
    ret = (totalMilliseconds / 1000).toFixed(fixed)
    ret += lang === 'en' ? 's' : '秒'
    return ret
  } else {
    return `${totalMilliseconds}${lang === 'en' ? 'ms' : '毫秒'}`
  }
}

/**
 * 将数字转换为可读性更好的字符串形式
 *
 * @param num 待转换的数字
 * @param fixed 保留的小数位数，默认为1
 * @param lang 语言类型，'en'表示英文，'zh'表示中文，默认为'en'
 * @returns 转换后的字符串
 */
export function readableNumber(num: number, fixed = 1, lang = 'en') {
  if (num < 1000) {
    return num.toString()
  } else if (num < 100000) {
    return (num / 1000).toFixed(fixed) + (lang === 'en' ? 'k' : '千') + '+'
  } else if (num < 10000000) {
    return (num / 10000).toFixed(fixed) + (lang === 'en' ? 'w' : '万') + '+'
  } else if (num < 100000000) {
    return (num / 10000000).toFixed(fixed) + (lang === 'en' ? 'kw' : '千万') + '+'
  } else {
    return (num / 100000000).toFixed(fixed) + (lang === 'en' ? 'gw' : '亿') + '+'
  }
}

/**
 * 给数字添加分隔符
 *
 * @param num 需要添加分隔符的数字
 * @returns 带有分隔符的字符串形式数字
 */
export function addSeparatorsInNumber(num: number) {
  const parts = num.toString().split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1] ? `.${parts[1]}` : ''

  let resultInteger = ''
  let count = 0
  for (let i = integerPart.length - 1; i >= 0; i--) {
    resultInteger = integerPart[i] + resultInteger
    count++
    if (count % 3 === 0 && i !== 0) {
      resultInteger = ',' + resultInteger
    }
  }

  while ([',', '0'].includes(resultInteger.charAt(0))) {
    resultInteger = resultInteger.slice(1)
  }

  resultInteger = resultInteger || '0'

  return resultInteger + decimalPart
}
