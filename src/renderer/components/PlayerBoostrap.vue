<script setup>
import { usePlayStore } from '../store/playStore';
import { useMainViewStore } from '../store/mainViewStore'
import { usePlatformStore } from '../store/platformStore';
import { useUserProfileStore } from '../store/userProfileStore';
import EventBus from '../../common/EventBus';
import { Track } from '../../common/Track';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
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

const visitRoute = (path) => {
    hidePlayingView()
    hidePlaybackQueueView()
    router.push(path)
}

//registryIpcRenderderListeners()

//注册ipcMain消息监听器
const registryIpcRenderderListeners = () => {
    if (!ipcRenderer) return
    //Tray事件
    ipcRenderer.on("tray-action", (e, value) => {
        switch (value) {
            case TRAY_ACTION.PLAY:
            case TRAY_ACTION.PAUSE:
                togglePlay()
                break
            case TRAY_ACTION.PLAY_PREV:
                playPrevTrack()
                break
            case TRAY_ACTION.PLAY_NEXT:
                playNextTrack()
                break
            case TRAY_ACTION.HOME:
                visitRoute('/')
                break
            case TRAY_ACTION.USERHOME:
                visitRoute('/userhome/all')
                break
            case TRAY_ACTION.SETTING:
                visitRoute('/setting')
                break
        }
    })

    //其他事件
    ipcRenderer.on('app-quit', () => {
        if (!isStorePlayStateBeforeQuit.value) {
            localStorage.removeItem('player')
        }
        if (!isStoreLocalMusicBeforeQuit.value) {
            localStorage.removeItem('localMusic')
        }
    })
}

//普通歌曲
EventBus.on('track-changed', track => {
    //traceRecentPlay(track)
    bootstrapTrack(track, track => {
        playTrack(track)
        //loadLyric(track)
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
let toastCnt = 0 //连跳计数器
//获取url 
const bootstrapTrack = (track, callback, noToast) => {
    if (!track) return
    const { id, platform } = track
    const vender = getVender(platform)
    if (!vender) return
    vender.playDetail(id, track).then(result => {
        const { lyric, cover, artist, url } = result
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
</script>
<template>
    <slot></slot>
</template>
<style></style>
