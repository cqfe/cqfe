export default { content: `<template>
    <div>
        <div>
            <button @click="scrollStart">StartScroll</button>
            <button @click="scrollStop">StopScroll</button>
        </div>
        <div ref="refList" class="list">
            <p v-for="(_, i) in new Array(10).fill(0)">{{ i }}</p>
        </div>
    </div>
</template>

<script setup>
import { useAutoScroll } from '@cqfe/vue-hooks';
import { ref } from 'vue';


const refList = ref(null)
const { scrollStart, scrollStop } = useAutoScroll(refList)
</script>
<style scoped>
.list {
    height: 100px;
    width: 50px;
    overflow-y: scroll;
}
</style>` }