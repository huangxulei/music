<script setup>
import { onMounted, onActivated, reactive, ref, watch } from 'vue';
import PlayAddAllBtn from '../components/PlayAddAllBtn.vue';
import PlaylistsControl from '../components/PlaylistsControl.vue';
import { usePlatformStore } from '../store/platformStore';
import { usePlayStore } from '../store/playStore';
import { useMainViewStore } from '../store/mainViewStore';
import EventBus from '../../common/EventBus';
import SongListControl from '../components/SongListControl.vue';

const { getVender } = usePlatformStore()
const { addTracks, resetQueue, playNextTrack } = usePlayStore()
const { showToast } = useMainViewStore()

const props = defineProps({
    platform: String,
    id: String
})

const detail = reactive({})
const listSize = ref(0)
const playlistDetailRef = ref(null)
let offset = 0, page = 1, limit = 1000
let markScrollTop = 0
const isLoading = ref(true)

const setLoading = (value) => {
    isLoading.value = value
}

const resetView = () => {
    Object.assign(detail, { cover: 'default_cover.png', title: '', about: '', data: [] })
    offset = 0
    page = 1
    detail.total = 0
    listSize.value = detail.data.length
}
const loadContent = () => {
    setLoading(true)
    const vender = getVender(props.platform)
    if (!vender) return
    vender.playlistDetail(props.id, offset, limit, page).then(result => {
        if (page > 1) {
            result.data.unshift(...detail.data)
        }
        Object.assign(detail, result)
        listSize.value = detail.data.length
        setLoading(false)
    })
}

const playAll = () => {
    resetQueue()
    addAll("即将为您播放全部！")
    playNextTrack()
}

const addAll = (text) => {
    addTracks(detail.data)
    showToast(text || "歌曲已全部添加！")
    //traceRecentPlay()
}

onMounted(() => {
    resetView()
    loadContent()
})

</script>

<template>
    <div id="playlist-detail" ref="playlistDetailRef">
        <div class="header">
            <div>
                <img class="cover" v-lazy="detail.cover" />
            </div>
            <div class="right"
                v-show="!isLoading">
                <div class="title" v-html="detail.title"></div>
                <div class="about" v-html="detail.about"></div>
                <div class="action">
                    <PlayAddAllBtn :leftAction="playAll"
                        :rightAction="() => addAll()" class="btn-spacing">
                    </PlayAddAllBtn>
                </div>
            </div>
        </div>
        <div class="center">
            <div class="list-title">歌曲({{ listSize }})</div>
            <SongListControl :data="detail.data" :artistVisitable="true"
                :albumVisitable="true" :loading="isLoading">
            </SongListControl>
        </div>
    </div>
</template>

<style>
#playlist-detail {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 28px 33px 10px 33px;
    overflow: auto;
}

#playlist-detail .header {
    display: flex;
    flex-direction: row;
    margin-bottom: 25px;
}

#playlist-detail .header .right {
    flex: 1;
    margin-left: 25px;
}

#playlist-detail .header .title,
#playlist-detail .header .about {
    text-align: left;
    margin-bottom: 10px;
}

#playlist-detail .header .title {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 3px;

    overflow: hidden;
    word-wrap: break-all;
    white-space: pre-wrap;
    line-break: anywhere;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

#playlist-detail .header .about {
    height: 139px;
    line-height: 23px;
    color: var(--text-sub-color);

    overflow: hidden;
    word-wrap: break-all;
    white-space: pre-wrap;
    line-break: anywhere;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
}

#playlist-detail .header .cover {
    width: 233px;
    height: 233px;
    border-radius: 6px;
    box-shadow: 0px 0px 10px #161616;
}

#playlist-detail .action {
    display: flex;
    flex-direction: row;
}

#playlist-detail .btn-spacing {
    margin-right: 20px;
}

#playlist-detail .list-title {
    margin-left: 3px;
    margin-bottom: 3px;
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    background: var(--hl-text-bg);
    -webkit-background-clip: text;
    color: transparent;
}
</style>
