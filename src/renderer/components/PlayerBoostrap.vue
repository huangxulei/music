<script setup>
import { usePlayStore } from '../store/playStore';
import { useMainViewStore } from '../store/mainViewStore'
import { usePlatformStore } from '../store/platformStore';
import { useUserProfileStore } from '../store/userProfileStore';
import EventBus from '../../common/EventBus';
import { Track } from '../../common/Track';
import { storeToRefs } from 'pinia';
import { onMounted, provide } from 'vue';
import { useIpcRenderer } from '../../common/Utils';
import { PLAY_STATE, TRAY_ACTION } from '../../common/Constants';
import { useRouter } from 'vue-router'
import { useSettingStore } from '../store/settingStore';

const router = useRouter()
const ipcRenderer = useIpcRenderer()

const { queueTracksSize } = storeToRefs(usePlayStore())

const { playTrack, playNextTrack, setAutoPlaying, playPrevTrack,
    togglePlay, switchPlayMode, updateCurrentTime, setPlaying } = usePlayStore()

const { getVender } = usePlatformStore()
const { showPlayNotification, hidePlayNotification,
    hidePlayingView, hidePlaybackQueueView, togglePlaybackQueueView } = useMainViewStore()
const { exploreModeCode } = storeToRefs(useMainViewStore())
const { isStorePlayStateBeforeQuit, isStoreLocalMusicBeforeQuit } = storeToRefs(useSettingStore())
const { addRecentSong } = useUserProfileStore()


//TODO 用户手动干预，即主动点击上/下一曲时，产生体验上的Bug
let playNextTimer = null
const showToast = (callback) => {
    showPlayNotification()//显示通知
    playNextTimer = setTimeout(() => {
        hidePlayNotification()
        if (callback) callback()
    }, 2000)
}

const tryCancelPlayNextTimer = () => {
    try {
        if (playNextTimer) clearTimeout(playNextTimer)
    } catch (e) {
        //Do nothing
    } finally {
        hidePlayNotification()
    }
}

const currentRoutePath = () => (router.currentRoute.value.path)
const resolveExploreMode = (exploreMode) => (exploreMode || exploreModeCode.value)
const resolveRoute = (route) => (typeof (route) == 'object' ? route : { toPath: route.toString() })
//TODO Reject是否需要实现待考虑
const visitRoute = (route) => {
    return new Promise((resolve, reject) => {
        if (!route) {
            return
        }
        const { toPath, onRouteReady, beforeRoute } = resolveRoute(route)
        if (!toPath) {
            //if(reject) reject()
            return
        }
        if (beforeRoute) beforeRoute(toPath)
        const fromPath = currentRoutePath()
        const isSame = (fromPath == toPath)
        if (isSame) {
            //if(reject) reject()
            return
        }
        if (onRouteReady) onRouteReady(toPath)
        router.push(toPath)
        if (resolve) resolve()
    })

}


provide('appRoute', {
    currentRoutePath,
    visitRoute,
    backward: () => router.back(),
    forward: () => router.forward(),
    visitLocalPlaylistCreate: (exploreMode) => {
        exploreMode = resolveExploreMode(exploreMode)
        return visitRoute(`/${exploreMode}/local/create`)
    },
    visitPlaylist: (platform, id) => {
        const exploreMode = resolveExploreMode()
        if (platform === 'local') {
            return visitRoute(`/${exploreMode}/local/${id}`)
        }
        return visitRoute(`/${exploreMode}/playlist/${platform}/${id}`)
    },
})



//加载歌词
const loadLyric = (track) => {
    if (!track) return
    if (Track.hasLyric(track)) {
        EventBus.emit('track-lyricLoaded', track)
        return
    }
    const platform = track.platform
    const vender = getVender(platform);
    if (!vender) return
    vender.lyric(track.id, track).then(result => assignLyric(track, result))
}

EventBus.on('track-loadLyric', track => loadLyric(track))

//普通歌曲
EventBus.on('track-changed', track => {
    //traceRecentPlay(track)
    bootstrapTrack(track, track => {
        playTrack(track)
        loadLyric(track)
    })
})

const traceRecentPlay = (track) => {
    const { isFMRadio } = track
    if (isFMRadio) {
        addRecentRadio(track)
    } else {
        addRecentSong(track)
    }
    //EventBus.emit("userHome-refresh")
}

const assignLyric = (track, lyric) => {
    //track.lyric = result
    if (!track) return
    if (!lyric) return
    Object.assign(track, { lyric })
    //LyricControl 来至playview
    EventBus.emit('track-lyricLoaded', track)
}

let toastCnt = 0 //连跳计数器
//获取url 
const bootstrapTrack = (track, callback, noToast) => {
    if (!track) return
    const { id, platform } = track
    const vender = getVender(platform)
    if (!vender) return
    vender.playDetail(id, track).then(result => {
        console.log('result', result)
        const { lyric, cover, artist, url } = result
        console.log('lyric', lyric)
        if (Track.hasUrl(result)) Object.assign(track, { url })
        tryCancelPlayNextTimer()
        if (!Track.hasUrl(track)) {//如果没有url 
            if (queueTracksSize.value < 2) {//播放列表只有一首歌曲
                if (!noToast) showToast()
            } else if (toastCnt < 9) {
                setAutoPlaying(true)
                if (!noToast) showToast(playNextTrack)
                ++toastCnt
            } else {
                toastCnt = 0
                setAutoPlaying(false)
            }
            return
        }
        toastCnt = 0
        setAutoPlaying(false)
        //歌词载入
        if (Track.hasLyric(result)) assignLyric(track, lyric)
        //封面载入
        if (Track.hasCover(result)) Object.assign(track, { cover })
        if (callback) callback(track)
    }).catch(e => {
        console.log(e)
        //showToast(playNextTrack)
    })
}

EventBus.on('track-pos', secs => {
    setPlaying(true)
    updateCurrentTime(secs)
})
//根据歌曲状态执行操作
EventBus.on('track-state', state => {
    switch (state) {
        case PLAY_STATE.PLAYING:
            setPlaying(true)
            break;
        case PLAY_STATE.PAUSE:
            setPlaying(false)
            break;
        case PLAY_STATE.END:
            playNextTrack()
            break;
        default:
            break
    }
})

const retry = (track) => {
    if (!Track.hasUrl(track)) {
        playNextTrack()
    } else {
        EventBus.emit('track-changed', track)
    }
}

EventBus.on('track-error', track => retry(track))
</script>
<template>
    <slot></slot>
</template>
<style></style>
