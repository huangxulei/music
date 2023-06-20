//用户配置文件
import { defineStore } from "pinia"
import EventBus from "../../common/EventBus"

export const useUserProfileStore = defineStore("userProfile", {
    state: () => ({
        user: {
            id: 0,
            nickname: "",
            cover: "",
            about: ""
        },
        favorites: {
            playlists: [],
            albums: [],
            songs: [],
            radios: []
        },
        customPlaylists: [],
        follows: {
            artists: []
        },
        recents: {
            playlists: [],
            albums: [],
            songs: [],
            radios: []
        },
        decoration: {
            current: 1001
        }
    }),
    getters: {},
    actions: {
        //TODO state合法性待校验
        findItemIndex(state, item, compareFn) {
            if (!state) return -1
            if (!item) return -1
            return state.findIndex((e) => {
                return compareFn ? compareFn(item, e) : item.id === e.id && item.platform == e.platform
            })
        },
        addRecentSong(track) {
            const { id, platform, title, artist, album, duration, cover } = track
            if (!platform || platform.trim().length < 1) return
            this.uniqueInsertFirst(this.recents.songs, { id, platform, title, artist, album, duration, cover })
        },
        insertFirst(state, item, compareFn) {
            if (!state) return
            const index = this.findItemIndex(state, item, compareFn)
            if (index != -1) return false
            const created = Date.now()
            const updated = created
            Object.assign(item, { created, updated }) //创建时间和更新时间
            state.splice(0, 0, item)
            //this.refreshUserHome()
            return true
        },
        removeItem(state, item, compareFn) {
            if (!state) return
            if (!item) return
            const index = this.findItemIndex(state, item, compareFn)
            if (index != -1) state.splice(index, 1)
            //this.refreshUserHome()
        },
        uniqueInsertFirst(state, item, compareFn) {
            this.removeItem(state, item, compareFn)
            this.insertFirst(state, item, compareFn)
        },
        refreshUserHome() {
            // EventBus.emit("userHome-refresh")
        }
    }
})
