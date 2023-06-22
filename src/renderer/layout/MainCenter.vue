<script setup>
import { onMounted, watch } from 'vue';
import MainTop from './MainTop.vue';
import MainContent from './MainContent.vue';
import { useMainViewStore } from '../store/mainViewStore';
import { usePlayStore } from '../store/playStore';
import { storeToRefs } from 'pinia';
import EventBus from '../../common/EventBus';
import { useRouter } from 'vue-router';
import PlaylistCategoryView from '../views/PlaylistCategoryView.vue';

const { playlistCategoryViewShow } = storeToRefs(useMainViewStore())
const { hidePlaylistCategoryView } = useMainViewStore()

const { togglePlay, } = usePlayStore()
const router = useRouter()

</script>
<template>
    <div id="main-center">
        <MainTop id="main-top"></MainTop>
        <MainContent id="main-content"> </MainContent>
        <!-- 浮层(Component、View)-->
        <transition name="fade-ex">
            <PlaylistCategoryView id="playlist-category-view" v-show="playlistCategoryViewShow">
            </PlaylistCategoryView>
        </transition>
    </div>
</template>
<style>
#main-center {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

#playlist-category-view,
#artist-category-view {
    position: fixed;
    top: 75px;
    top: 85px;
    right: 0px;
    width: 404px;
    width: 40.4%;
    padding-bottom: 30px;
    z-index: 55;
    background: var(--app-bg);
    box-shadow: 0px 0px 10px #161616;
}
</style>