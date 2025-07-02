import { reactive } from 'vue'

export function useState(initialState = {} as Record<string, any>) {
  const init = JSON.parse(JSON.stringify(initialState))
  const state = reactive(initialState)

  function reset() {
    Object.keys(state).forEach((key) => {
      state[key] = init[key]
    })
  }

  return { state, reset }
}
