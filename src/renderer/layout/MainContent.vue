<script setup>
import { useRouter } from 'vue-router';
import { useMainViewStore } from '../store/mainViewStore';
import { usePlatformStore } from '../store/platformStore';

const router = useRouter()
const { updateCurrentPlatformByCode } = usePlatformStore()

const { setExploreMode, setArtistExploreMode, setUserExploreMode, hidePlayingView } = useMainViewStore()

router.beforeResolve((to, from) => {
    console.log("[ ROUTE] ==>>>" + to.path)
    autoSwithExploreMode(to)
    highlightPlatform(to)
})
//设置浏览模式 
const autoSwithExploreMode = (to) => {
    const path = to.path
    if (path.includes('/playlists/')) {
        setExploreMode(0)
    } else if (path.includes('/artists/')) {
        setArtistExploreMode()
    } else if (path.includes('/userhome')) {
        setUserExploreMode()
    }
}
//设置平台 根据地址
const highlightPlatform = (to) => {
    const path = to.path
    let code = ''
    if (path.includes('/square') || path.includes('/playlist')
        || path.includes('/artist') || path.includes('/album')) {
        code = path.split('/')[3]
    } else if (path.includes('/local')) {
        code = 'local'
    } else if (path.includes('/userhome')) {
        const parts = path.split('/')
        // /userhome/{code}
        if (parts.length === 3) code = parts[2]
        // /userhome/customPlaylist/{id}
        if (parts.length === 4 && parts[2] === 'customPlaylist') code = 'all'
    }
    updateCurrentPlatformByCode(code)
}
</script>
<template>
    <div id="main-content">
        <router-view v-slot="{ Component }">
            <keep-alive :max="12">
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </div>
</template>
<style>
#main-content {
    display: flex;
    flex: 1;
    overflow: auto;
    margin-right: 2px;
}
</style>