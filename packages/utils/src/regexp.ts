// 简单手机号
export const phoneRegexp = /^1[3-9]\d{9}$/

// 简单邮箱
export const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// 简单网址
export const httpOrSRegexp = /^(http|https):\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/

// 浏览器协议
export const protocolRegexp =
  /^(http|https|ftp|file|mailto|tel|sms|data|ws|wss):\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/

// 身份证号
export const idCardRegexp = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
