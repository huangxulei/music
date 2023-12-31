import { defineStore } from "pinia"
import EventBus from "../../common/EventBus"
import { useIpcRenderer } from "../../common/Utils"

const ipcRenderer = useIpcRenderer()

export const useMainViewStore = defineStore("mainView", {
    state: () => ({
        coverMaskShow: false,
        playlistCategoryViewShow: false,
        artistCategoryViewShow: false,
        playbackQueueViewShow: false,
        playingViewShow: false,
        //播放状态通知
        playNotificationShow: false,
        //通用通知
        commonNotificationShow: false,
        commonNotificationText: null,
        commonNotificationType: 0, //类型，0 - 普通成功消息，1-失败消息
        //探索模式，歌单、歌手
        exploreModes: ["playlists", "artists", "userhome"],
        exploreModeIndex: 0
    }),
    getters: {
        isPlaylistMode() {
            return this.exploreModeIndex == 0
        },
        isArtistMode() {
            return this.exploreModeIndex == 1
        },
        isUserHomeMode() {
            return this.exploreModeIndex == 2
        },
        exploreModeCode() {
            return this.exploreModes[this.exploreModeIndex]
        }
    },
    actions: {
        hidePlaybackQueueView() {
            this.playbackQueueViewShow = false
        },
        togglePlaybackQueueView() {
            this.playbackQueueViewShow = !this.playbackQueueViewShow
        },
        togglePlaylistCategoryView() {
            this.playlistCategoryViewShow = !this.playlistCategoryViewShow
            if (!this.playlistCategoryViewShow) {
                EventBus.emit("playlistCategory-resetScroll")
            }
        },
        hidePlaylistCategoryView() {
            this.playlistCategoryViewShow = false
            EventBus.emit("playlistCategory-resetScroll")
        },
        toggleArtistCategoryView() {
            this.artistCategoryViewShow = !this.artistCategoryViewShow
            if (!this.artistCategoryViewShow) {
                EventBus.emit("artistCategory-resetScroll")
            }
        },
        hideArtistCategoryView() {
            this.artistCategoryViewShow = false
            EventBus.emit("artistCategory-resetScroll")
        },
        showPlayingView() {
            this.playingViewShow = true
        },
        hidePlayingView() {
            this.playingViewShow = false
        },
        togglePlayingView() {
            this.playingViewShow = !this.playingViewShow
        },
        toggleCoverMask() {
            this.coverMaskShow = !this.coverMaskShow
        },
        quit() {
            if (ipcRenderer) ipcRenderer.send("app-quit")
        },
        minimize() {
            if (ipcRenderer) ipcRenderer.send("app-min")
        },
        maximize() {
            if (ipcRenderer) ipcRenderer.send("app-max")
        },
        setExploreMode(index) {
            if (!index || index < 0 || index > 2) index = 0
            this.exploreModeIndex = index
        },
        setArtistExploreMode() {
            this.setExploreMode(1)
        },
        setUserExploreMode() {
            this.setExploreMode(2)
        },
        showToast(text, callback, delay) {
            text = text || "操作成功！"
            EventBus.emit("toast", { text, callback, delay })
        },
        showPlayNotification() {
            this.playNotificationShow = true
        },
        hidePlayNotification() {
            this.playNotificationShow = false
        },
        showCommonNotification(text) {
            this.commonNotificationShow = true
            this.commonNotificationText = text || "操作成功！"
        },
        setCommonNotificationType(type) {
            this.commonNotificationType = type || 0
        },
        hideCommonNotification() {
            this.commonNotificationShow = false
            this.commonNotificationText = null
            this.commonNotificationType = 0
        }
    }
})
