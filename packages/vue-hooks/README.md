# `VueHooks`

> Some useful vue hooks

## Usage

1. Install `npm install @cqfe/vue-hooks`

## Hooks

### useEvent

> simple event bus,by vue3 reactive,used when you need to communicate between components

```js
// useEvent 事件通信
const { emitEvent, onEvent } = useEvent();
onEvent('test', (data) => {
  // your logic
});
function emitTest() {
  emitEvent('test', 'some your data');
}
```

### useAutoScroll

> auto scroll and paused when mouse move,used when you need to auto scroll a list

```js
const refList = ref(null); // your list ref
const { scrollStart, scrollStop } = useAutoScroll(refList);
onMounted(() => {
  scrollStart();
});
```

### useRem

> rem unit,used when you must manual operation rem,otherwise you can use some rem postcss plugin, like `postcss-pxtorem`

```js
const { scaleInfo } = useRem();
```
