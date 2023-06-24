<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { usePlayStore } from '../store/playStore';
import EventBus from '../../common/EventBus';
import PlayMeta from '../components/PlayMeta.vue';
const { progress } = storeToRefs(usePlayStore())

const progressBarRef = ref(null)

const seekTrack = (percent) => {
    EventBus.emit('track-seek', percent)
}

watch(progress, (nv, ov) => {
    progressBarRef.value.updateProgress(nv)
})
</script>

<template>
    <div id="main-top">
        <div id="play-nav">
            <PlayMeta id="play-meta"></PlayMeta>
            <PlayControl id="play-ctl"></PlayControl>
            <div class="top-right">

            </div>
        </div>
        <ProgressBar ref="progressBarRef" :onseek="seekTrack"></ProgressBar>
    </div>
</template>
<style scoped>
#main-top,
#play-nav {
    display: flex;
}

#main-top {
    flex-direction: column;
    height: 71px;
    height: 80px;
    -webkit-app-region: drag;
}

#play-nav #play-meta {
    width: 34.33%;
}

#play-nav #play-ctl {
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
    margin-right: 15px;
}

#play-nav .top-right {
    width: 39.33%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>