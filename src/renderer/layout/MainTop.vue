<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePlayStore } from '../store/playStore';
import EventBus from '../../common/EventBus';
import PlayMeta from '../components/PlayMeta.vue';


const router = useRouter()
const progressBarRef = ref(null)
const { progress } = storeToRefs(usePlayStore())
</script>

<template>
    <div id="main-top">
        <div id="play-nav">
            <PlayMeta id="play-meta"></PlayMeta>
        </div>
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
</style>