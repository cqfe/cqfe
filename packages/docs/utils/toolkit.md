## pick{#pick}

> 从对象中挑选指定键的值并返回新对象

```js-vue
import { pick } from '@cqfe/utils'

console.log(pick({ a: 1, b: 2, c: 3 },['a','b'])) // {a: 1, b: 2}
```

## compact{#compact}

> 去除数组中的假值元素

```js-vue
import { compact } from '@cqfe/utils'

console.log(compact([0, undefined, null, 2])) // [ 2 ]
```

## omit{#omit}

> 忽略对象中指定键的属性，返回一个新的对象

```js-vue
import { omit } from '@cqfe/utils'

console.log(omit({ a: 1, b: 2, c: 3 },['c'])) // {a: 1, b: 2}
```
