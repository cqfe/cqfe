## readableDuration{#readableDuration}

> 将时间值转换为可读性更高的字符串表示形式

### 参数

| 参数  | 类型   | 必填 | 默认值 | 描述                                                                          |
| ----- | ------ | ---- | ------ | ----------------------------------------------------------------------------- |
| value | number | 是   | -      | 持续时间                                                                      |
| fixed | number | 否   | 1      | 保留小数位数                                                                  |
| unit  | enum   | 否   | s      | 原始单位'ms'（毫秒）、's'（秒）、'm'（分钟）、'd'（天）、'M'（月）、'y'（年） |
| lang  | enum   | 否   | en     | 语言'en'（英语）或'zh'（中文）                                                |

```js-vue
import { readableDuration } from '@cqfe/utils'

console.log(readableDuration(90, 1, 's', 'en')) // 1.5m
console.log(readableDuration(90, 2, 's', 'en')) // 1.50m
console.log(readableDuration(90, 1, 's', 'zh')) // 1.5分钟
console.log(readableDuration(90, 1, 'ms', 'en')) // 1.5s
```

## readableNumber{#readableNumber}

> 将数字转换为可读性更好的字符串形式

### 参数

| 参数  | 类型   | 必填 | 默认值 | 描述                           |
| ----- | ------ | ---- | ------ | ------------------------------ |
| num   | number | 是   | -      | 原始数字                       |
| fixed | number | 否   | 1      | 保留小数位数                   |
| lang  | enum   | 否   | en     | 语言'en'（英语）或'zh'（中文） |

```js-vue
import { readableDuration } from '@cqfe/utils'

console.log(readableNumber(999, 1, 'en')) // 999
console.log(readableNumber(1500, 2, 'en')) // 1.50k
console.log(readableNumber(1500, 1, 'zh')) // 1.5千
console.log(readableNumber(100000000, 0,  'zh')) // 1亿
```

## addSeparatorsInNumber{#addSeparatorsInNumber}

> 给数字添加分隔符

### 参数

| 参数 | 类型   | 必填 | 默认值 | 描述     |
| ---- | ------ | ---- | ------ | -------- |
| num  | number | 是   | -      | 原始数字 |

```js-vue
import { addSeparatorsInNumber } from '@cqfe/utils'

console.log(addSeparatorsInNumber(1999)) // 1,999
console.log(addSeparatorsInNumber(0123123.123)) // 123,123.123
```
