/**
 * 将字符串首字母转为大写
 *
 * @param str 要转换的字符串
 * @returns 返回转换后的字符串
 */
export function toFirstUpper(str: string) {
  // 空2222
  if (!str) return '';
  return str.replace(str[0], str[0].toUpperCase());
}
