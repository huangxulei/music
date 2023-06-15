<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    initValue: Number,
    onseek: Function,
    onscroll: Function,
    ondrag: Function
})

const sliderCtlRef = ref(null)
const progressRef = ref(null)
const thumbRef = ref(null)
let onDrag = false
let value = parseFloat(props.initValue).toFixed(2)

//点击改变进度
const seekProgress = (e) => {
    //根据不同系统分离方法 mac delta
    if (thumbRef.value.contains(e.target)) {
        updateProgressByDeltaWidth(e.offsetX)
    } else {
        updateProgressByWidth(e.offsetX)
    }
    if (props.onseek) {
        props.onseek(value)
    }
}

const updateProgressByWidth = (width) => {
    const totalWidth = sliderCtlRef.value.offsetWidth
    let percent = width / totalWidth
    //console.log("percent: " + percent)
    updateProgress(percent)
}

const updateProgressByDeltaWidth = (delta) => {
    if (delta == 0) return
    const totalWidth = sliderCtlRef.value.offsetWidth
    const oPercent = parseFloat(progressRef.value.style.width.replace('%', '')) / 100
    if (isNaN(oPercent)) return
    let oWidth = totalWidth * oPercent
    updateProgressByWidth(oWidth + delta)
}

const updateProgress = (percent) => {
    percent = percent * 100
    percent = percent > 0 ? percent : 0
    percent = percent < 100 ? percent : 100
    progressRef.value.style.width = percent + "%"
    thumbRef.value.style.left = percent + "%"
    value = (percent / 100).toFixed(2)
}

/**
 * value 为当前音量 
 * 改变value 0, 1 并改变进度条
 * 0.00 / 1.00
 */
const toggleProgress = () => {
    updateProgress(value > 0 ? 0 : 1)
    return value
}


//对外提供API
defineExpose({
    updateProgress,
    toggleProgress
})


</script>
<template>
    <div class="slider-bar">
        <div class="slider-bar-ctl" ref="sliderCtlRef" @click="seekProgress">
            <div class="progress" ref="progressRef"></div>
            <div class="thumb" ref="thumbRef"></div>
        </div>
    </div>
</template>
<style scoped>
.slider-bar {
    height: 10px;
    background: transparent;
}

.slider-bar .slider-bar-ctl {
    height: 3px;
    border-radius: 10rem;
    background: var(--progress-track-bg);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
}

.slider-bar-ctl,
.slider-bar .progress,
.slider-bar .thumb {
    -webkit-app-region: none;
}

.slider-bar .progress {
    width: 50%;
    height: 3px;
    border-radius: 10rem;
    background: linear-gradient(to top right, #28c83f, #1ca388);
    background: var(--hl-text-bg);
    z-index: 1;
    position: absolute;
}

.slider-bar .thumb {
    width: 10px;
    height: 10px;
    border-radius: 10rem;
    background-color: var(--text-color);
    z-index: 2;
    position: absolute;
    left: 50%;
}
</style>