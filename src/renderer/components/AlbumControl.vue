<script setup>
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useMainViewStore } from '../store/mainViewStore';
import { usePlatformStore } from '../store/platformStore';

const props = defineProps({
    visitable: Boolean,
    platform: String,
    data: Object
})

</script>

<template>
    <span class="album-ctl"
        v-html="data.name"></span>
</template>

<style scoped>
.album-ctl {
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-align: left;
}

.album-ctl:hover {
    background: var(--hl-text-bg);
    -webkit-background-clip: text;
    color: transparent;
}
</style>
