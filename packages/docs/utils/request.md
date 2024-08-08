## retry{#retry}

> 请求重试

```js-vue
import { retry } from '@cqfe/utils'

// async function
const loop = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('error')
        }, 1000)
    })
}
// 3次重试，每次间隔2000ms
retry(loop, 3, 2000)
```
