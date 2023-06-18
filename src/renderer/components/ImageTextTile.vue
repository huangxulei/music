<script setup>
import { ref } from 'vue';
import EventBus from '../../common/EventBus';

const props = defineProps({
    cover: String,
    title: String
})


</script>
<template>
    <div class="image-text-tile">
        <div class="cover-wrap">
            <img class="cover" v-lazy="cover" />
        </div>
        <div class="title" v-html="title"></div>
    </div>
</template>
<style scoped>
.image-text-tile {
    margin: 15px 12px;
}

.image-text-tile .cover {
    width: 165px;
    height: 165px;
    line-height: 165px;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0px 0px 10px #161616;
    background-color: var(--text-color);
}

.image-text-tile .cover-wrap:hover {
    transform: scale(1.05) translateY(-4px);
}

.image-text-tile .title {
    width: 165px;
    margin-top: 5px;
    text-align: left;
    cursor: pointer;
    line-height: 21px;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.image-text-tile .title:hover {
    background: linear-gradient(to right, #1ca388, #28c83f);
    background: var(--btn-bg);
    -webkit-background-clip: text;
    color: transparent;
}
</style>