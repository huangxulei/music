<script setup>
import { usePlayStore } from '../store/playStore';
import { useMainViewStore } from '../store/mainViewStore'
import { usePlatformStore } from '../store/platformStore';
import EventBus from '../../common/EventBus';
import { Track } from '../../common/Track';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useIpcRenderer } from '../../common/Utils';
import { PLAY_MODE, TRAY_ACTION } from '../../common/Constants';
import { useRouter } from 'vue-router'
import { useSettingStore } from '../store/settingStore';

const router = useRouter()
const ipcRenderer = useIpcRenderer()

const { queueTracksSize } = storeToRefs(usePlayStore())

const { playTrack, playNextTrack,
    setAutoPlaying, playPrevTrack,
    togglePlay, switchPlayMode,
    updateCurrentTime, setPlaying } = usePlayStore()

const { getVender } = usePlatformStore()
const { showPlayNotification, hidePlayNotification,
    hidePlayingView, hidePlaybackQueueView, togglePlaybackQueueView } = useMainViewStore()
const { isStorePlayStateBeforeQuit, isStoreLocalMusicBeforeQuit } = storeToRefs(useSettingStore())


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
</script>
<template>
    <slot></slot>
</template>
<style></style>
