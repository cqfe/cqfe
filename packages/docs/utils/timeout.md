## setAccuracyTimeout{#setAccuracyTimeout}

> 精确的定时器，由`requestAnimationFrame`驱动，在动画帧中执行回调

```js-vue
import { setAccuracyTimeout } from '@cqfe/utils'

const timer = setAccuracyTimeout(() => {
    console.log('timeout')
}, 1000)
timer.cancel()
```

## setAccuracyInterval{#setAccuracyInterval}

> 精确的定时器，由`requestAnimationFrame`驱动，在动画帧中执行回调

```js-vue
import { setAccuracyInterval } from '@cqfe/utils'

const timer = setAccuracyInterval(() => {
    console.log('timeout')
}, 1000)
timer.cancel()
```

## throttle{#throttle}

> 节流函数，返回一个函数，在执行时，如果该函数被调用过，则不立即执行，而是等待`delay`毫秒后再次调用。

```js-vue
import { throttle, setAccuracyInterval } from '@cqfe/utils'

const fn = throttle(() => {
    console.log('timeout')
}, 2000)
setAccuracyInterval(() => {
    fn()
}, 1000)
```

## debounce{#debounce}

> 防抖函数，返回一个函数，在执行时，如果该函数被调用过，则不立即执行，而是等待`delay`毫秒后再次调用。

```js-vue
import { debounce } from '@cqfe/utils'

const fn = debounce(() => {
    console.log('timeout')
}, 2000)
setAccuracyInterval(() => {
    fn()
}, 1000)
```
