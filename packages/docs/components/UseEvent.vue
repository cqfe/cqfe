<template>
    <button @click="emitEvent('clicked', 'hello leo')">Click to emit event</button>
    <p>Event emits: {{ eventMsgRef }} times</p>
</template>

<script setup>
import * as xx from '@cqfe/vue-hooks';
import { ref } from 'vue';
debugger
const { useEvent } = xx;
const { emitEvent, onEvent } = useEvent();
const eventMsgRef = ref(0);
onEvent('clicked', (val) => {
    console.log('event params: ', val);
    eventMsgRef.value += 1;
});
</script>