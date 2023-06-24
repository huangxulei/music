<script setup>
import { onActivated, onDeactivated, onMounted, reactive, ref, useAttrs, watch } from 'vue';
import { storeToRefs } from 'pinia';
import EventBus from '../../common/EventBus';
import { usePlaylistSquareViewStore } from '../store/playlistSquareViewStore'
import PlaylistCategoryBar from '../components/PlaylistCategoryBar.vue';
import PlaylistsControl from '../components/PlaylistsControl.vue';
import { useMainViewStore } from '../store/mainViewStore';

const squareContentRef = ref(null)

const categories = reactive([])
const playlists = reactive([])
const pagination = { offset: 0, limit: 35, page: 1 }
let markScrollTop = 0

const { currentPlatformCode, currentCategoryCode } = storeToRefs(usePlaylistSquareViewStore())
const { currentVender, currentCategory, putCategory } = usePlaylistSquareViewStore()
const { isPlaylistMode } = storeToRefs(useMainViewStore())

const isLoadingCategories = ref(true)
const isLoadingContent = ref(true)

const setLoadingCategories = (value) => {
    isLoadingCategories.value = value
}

const setLoadingContent = (value) => {
    isLoadingContent.value = value
}

const resetPagination = () => {
    playlists.length = 0
    pagination.offset = 0
    pagination.page = 1
}

const nextPage = () => {
    pagination.offset = pagination.page * pagination.limit
    pagination.page = pagination.page + 1
}

const loadCategories = () => {
    categories.length = 0
    setLoadingCategories(true)
    setLoadingContent(true)
    let cached = currentCategory()
    if (!cached) {
        const vender = currentVender()
        if (!vender) return
        vender.categories().then(result => {
            putCategory(result.platform, result.data)
            //TODO
            categories.push(...result.data)
            EventBus.emit('playlistCategory-update')
            setLoadingCategories(false)
        })
    } else {
        categories.push(...cached)
        EventBus.emit('playlistCategory-update')
        setLoadingCategories(false)
    }
}

const loadContent = (noLoadingMask) => {
    const vender = currentVender()
    if (!vender) return
    if (!noLoadingMask) setLoadingContent(true)
    const cate = currentCategoryCode.value
    const offset = pagination.offset
    const limit = pagination.limit
    const page = pagination.page
    const platform = currentPlatformCode.value
    vender.square(cate, offset, limit, page).then(result => {
        if (platform != result.platform) return
        if (cate != result.cate) return
        playlists.push(...result.data)
        setLoadingContent(false)
    })
}

const loadMoreContent = () => {
    nextPage()
    loadContent(true)
}

const resetScrollState = () => {
    markScrollTop = 0
    //squareContentRef.value.scrollTop = markScrollTop
}

onMounted(() => {
    resetCommon()
    loadCategories()
})

onActivated(() => {
    resetCommon()
    loadCategories()
})

const resetCommon = () => {
    resetPagination()
    resetScrollState()
}

const refreshData = () => {
    resetCommon()
    loadContent()
}

watch(currentPlatformCode, (nv, ov) => {
    if (!isPlaylistMode.value) return
    resetCommon()
    loadCategories()
})
//刷新内容
EventBus.on("playlistSquare-refresh", refreshData)

</script>
<template>
    <div class="playlist-square-view" ref="squareContentRef">
        <PlaylistCategoryBar :data="categories" :loading="isLoadingCategories"></PlaylistCategoryBar>
        <PlaylistsControl :data="playlists" :loading="isLoadingContent"></PlaylistsControl>
    </div>
</template>
<style scoped>
.playlist-square-view {
    padding: 25px 33px 15px 33px;
    overflow: auto;
}
</style>