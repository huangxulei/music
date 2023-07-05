<script setup>

import { onMounted, ref, reactive } from "vue";
import { useIpcRenderer } from "../../common/Utils";
import { useLocalMusicStore } from "../store/localMusicStore"
import { toYyyymmddHhMmSs } from '../../common/Times';
import PlayAddAllBtn from '../components/PlayAddAllBtn.vue';
import SongListControl from '../components/SongListControl.vue';
const { getLocalPlaylist } = useLocalMusicStore()
const ipcRenderer = useIpcRenderer()
const props = defineProps({
    exploreMode: String,
    id: String
})

const playlistDetailRef = ref(null)
const detail = reactive({})

const getAbout = () => {
    return (detail.about && detail.about.trim().length > 0) ?
        detail.about.trim() : "还没有简介 ~"
}


const loadContent = () => {
    const playlist = getLocalPlaylist(props.id)
    Object.assign(detail, { ...playlist })
    const { data } = playlist
}
onMounted(() => {
    loadContent()
})
</script>
<template>
    <div id="local-playlist-detail-view" ref="playlistDetailRef">
        <div class="header">
            <div>
                <img class="cover" v-lazy="detail.cover" />
            </div>
            <div class="right">
                <div class="title" v-html="detail.title"></div>
                <div class="about" v-html="getAbout()"></div>
                <div class="edit">
                    <div>
                        <svg width="16" height="16" viewBox="0 0 992.3 992.23" xmlns="http://www.w3.org/2000/svg">
                            <g id="Layer_2" data-name="Layer 2">
                                <g id="Layer_1-2" data-name="Layer 1">
                                    <path
                                        d="M428.27,992.13c-88.16,0-176.32.28-264.48-.1-56.56-.24-101.65-23.86-134.6-69.78A150.76,150.76,0,0,1,.34,833.37C0,743.21.19,653.05.18,562.89c0-88-.5-176,.17-264C.82,236.36,29,188.83,82.63,156.81c25.32-15.11,53.25-21.18,82.69-21.15q161,.15,322,.06c26.66,0,45.78,15.33,50.38,40,5,26.58-15,53-41.88,55.53-3.31.31-6.66.42-10,.42q-159.75,0-319.49-.06c-25.45,0-45.64,9.41-59.78,30.75-7.47,11.29-10.42,23.92-10.41,37.45q.09,229.23,0,458.47,0,35.25,0,70.5c.06,38.34,29,67.32,67.42,67.33q264.74,0,529.47,0c38.53,0,67.21-28.52,67.44-67.25.21-32.66.05-65.33.05-98q0-112.74,0-225.49c0-19.14,7-34.41,23.5-44.58,30.3-18.63,70.25,2.33,72.32,37.83.13,2.17.21,4.33.21,6.5q0,161.24,0,322.48c0,47.47-16.82,87.91-51.29,120.5-30,28.4-66.18,43.56-107.53,43.81-89.83.52-179.66.16-269.49.16Z" />
                                    <path
                                        d="M417,473.1c1.08-20.29,2.1-40.59,3.27-60.88a46.93,46.93,0,0,1,11.63-28.62c1.74-2,3.64-3.89,5.53-5.78L798.28,16.91c22.51-22.5,50.7-22.57,73.22-.07q52.15,52.11,104.27,104.27c22,22,22.06,50.57.07,72.54Q794.42,374.91,613,556.14c-10.34,10.34-22.49,15.36-37,16.06q-50.93,2.47-101.8,5.69c-14.62.91-28.69.35-40.88-9.11-12.48-9.69-19.48-22.41-19.12-38.27.43-19.15,1.73-38.28,2.65-57.41Zm95.78,6.38c13.28-.76,25.7-1.6,38.15-2.09a12.52,12.52,0,0,0,9.12-4q156.09-156.07,312.3-312c1.26-1.26,2.43-2.58,3.23-3.43l-41.31-41.26-72.48,72.49Q640.15,310.8,518.56,432.44c-1.44,1.45-3.22,3.37-3.35,5.18C514.19,451.23,513.55,464.86,512.74,479.48Z" />
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div class="time spacing">
                        <span>最后更新：{{ toYyyymmddHhMmSs(detail.updated) }}</span>
                    </div>
                </div>
                <div class="action">
                    <PlayAddAllBtn></PlayAddAllBtn>
                </div>
            </div>
        </div>
        <div class="center">
            <div class="list-title">
                <span class="content-text-highlight">歌曲({{ detail.data.length }})</span>
            </div>
            <SongListControl :data="detail.data" :artistVisitable="true" :albumVisitable="true" :id="id"></SongListControl>
        </div>
    </div>
</template>
<style scoped>
#local-playlist-detail-view {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 20px 33px 10px 33px;
    overflow: scroll;
    overflow-x: hidden;
}

#local-playlist-detail-view .header {
    display: flex;
    flex-direction: row;
    margin-bottom: 25px;
}

#local-playlist-detail-view .header .right {
    flex: 1;
    margin-left: 30px;
}

#local-playlist-detail-view .header .title,
#local-playlist-detail-view .header .about {
    text-align: left;
    margin-bottom: 10px;
}

#local-playlist-detail-view .header .title {
    /*font-size: 30px;*/
    font-size: var(--content-text-module-title-size);
    font-weight: bold;
}

#local-playlist-detail-view .header .about {
    min-height: 99px;
    /*line-height: 21px;*/
    line-height: var(--content-text-line-height);
    color: var(--content-subtitle-text-color);
    overflow: hidden;
    word-wrap: break-all;
    white-space: pre-wrap;
    line-break: anywhere;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
    margin-bottom: 10px;
    /*font-size: 15px;*/
}

#local-playlist-detail-view .right .edit {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
}

#local-playlist-detail-view .spacing {
    margin-left: 6px;
}

#local-playlist-detail-view .edit svg {
    fill: var(--svg-color);
    cursor: pointer;
}

#local-playlist-detail-view .edit svg:hover {
    fill: var(--hl-color);
}

#local-playlist-detail-view .time {
    /*font-size: 13px;*/
    font-size: var(--content-text-tip-text-size);
    font-weight: 520;
    color: var(--content-subtitle-text-color);
    text-align: left;
}

#local-playlist-detail-view .header .cover {
    width: 233px;
    height: 233px;
    border-radius: 6px;
    box-shadow: 0px 0px 1px #161616;
}

#local-playlist-detail-view .action {
    display: flex;
    flex-direction: row;
}

#local-playlist-detail-view .btn-spacing {
    margin-right: 20px;
}

#local-playlist-detail-view .list-title {
    position: relative;
    margin-left: 3px;
    margin-bottom: 10px;
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    display: flex;
}

#local-playlist-detail-view .checkbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 8px;
    margin-right: 15px;
    cursor: pointer;
}

#local-playlist-detail-view .checkbox svg {
    fill: var(--button-icon-btn-color);
    cursor: pointer;
}

#local-playlist-detail-view .checkbox .checked-svg {
    fill: var(--content-highlight-color);
}


#local-playlist-detail-view .search-wrap {
    position: absolute;
    right: -10px;
    display: flex;
    align-items: center;
    font-weight: bold;
}

#local-playlist-detail-view .search-wrap svg {
    margin-top: 1px;
}

#local-playlist-detail-view .search-wrap>span {
    margin-left: 5px;
    cursor: pointer;
}
</style>