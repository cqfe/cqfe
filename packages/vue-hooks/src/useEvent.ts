import { reactive, watchEffect } from 'vue';
// 创建一个响应式对象作为事件存储
const state = reactive(new Map());

/**
 * 跨组件事件通信
 *
 * @returns 返回一个包含 emitEvent 和 onEvent 方法的对象
 */
export function useEvent() {
  // 触发事件
  function emitEvent<T>(eventCode: string, param: T) {
    state.set(eventCode, param);
  }

  // 监听事件
  function onEvent(eventCode: string, callback: (data: any) => void) {
    watchEffect(() => {
      // 使用 watchEffect 监听事件总线中的事件变化
      const data = state.get(eventCode);
      if (data !== undefined) {
        callback(data);
        // 清除事件，避免重复处理
        state.delete(eventCode);
      }
    });
  }

  return { emitEvent, onEvent };
}
