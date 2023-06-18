<script setup>
import { ref } from 'vue'

const barRef = ref(null)
const barValueRef = ref(null)

const props = defineProps({
    onseek: Function
})

const seek = (e) => {
    const offsetX = e.offsetX
    const offsetWidth = barRef.value.offsetWidth
    const percent = (offsetX / offsetWidth).toFixed(3)
}

</script>
<template>
    <div class="progress-bar" ref="barRef">
        <div class="progress" ref="barValueRef"></div>
    </div>
</template>
<style scoped>
.progress-bar {
    height: 3px;
    border-radius: 10rem;
    background: var(--progress-track-gb);
    cursor: pointer;
    -webkit-app-region: none;
}

.progress-bar .progress {
    width: 20%;
    height: 100%;
    border-radius: 10rem;
    background: var(--progress-bg);
}
</style>