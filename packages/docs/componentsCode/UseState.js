export default { content: `<template>
  <h4>CurrentState</h4>
  <pre>{{ JSON.stringify(state, undefined, 2) }}</pre>
  <div class="space">
    <button @click="onBirthday">Birthday</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script setup>
import { useState } from '@cqfe/vue-hooks'

const { state, reset } = useState({
  name: 'leo',
  age: 18,
})

function onBirthday() {
  state.age++
}
</script>
` }