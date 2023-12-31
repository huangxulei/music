import { defineStore } from "pinia"
import { useMainViewStore } from "./mainViewStore"
import { QQ } from "../../vendor/qq"
import { NetEase } from "../../vendor/netease"
import { KuWo } from "../../vendor/kuwo"
import { KuGou } from "../../vendor/kugou"
import { LocalMusic } from "../../vendor/localmusic"

//音乐平台
const allPlatforms = [
    {
        code: "all",
        name: "全部平台",
        online: null
    },
    {
        code: QQ.CODE,
        name: "QQ音乐",
        online: true
    },
    {
        code: NetEase.CODE,
        name: "网易云音乐",
        online: true
    },
    {
        code: KuWo.CODE,
        name: "酷我音乐",
        online: true
    },
    {
        code: KuGou.CODE,
        name: "酷狗音乐",
        online: true
    },
    {
        code: LocalMusic.CODE,
        name: "本地歌曲",
        online: false
    }
]

const playlistPlatforms = allPlatforms.slice(1)
const artistPlatforms = allPlatforms.slice(1, 5)
const userhomePlatforms = allPlatforms.slice(0, 5)
const onlinePlatformFilter = allPlatforms.slice(0, allPlatforms.length - 1)

const venders = {
    qq: QQ,
    netease: NetEase,
    kuwo: KuWo,
    kugou: KuGou,
    local: LocalMusic
}

export const usePlatformStore = defineStore("platform", {
    state: () => ({
        currentPlatformIndex: 0,
        venders
    }),
    getters: {
        platforms() {
            return () => {
                const { isArtistMode, isUserHomeMode } = useMainViewStore()
                if (isArtistMode) return artistPlatforms
                if (isUserHomeMode) return userhomePlatforms
                return playlistPlatforms
            }
        },
        currentPlatform(state) {
            //const { exploreModes } = useMainViewStore()
            return state.platforms()[state.currentPlatformIndex]
        },
        currentPlatformCode(state) {
            return this.currentPlatform ? this.currentPlatform.code : ""
        },
        onlinePlatformsFilter() {
            return onlinePlatformFilter
        },
        isLocal(state) {
            return this.currentPlatformCode === "local"
        },
        isAll(state) {
            return this.currentPlatformCode === "all"
        }
    },
    actions: {
        updateCurrentPlatform(index) {
            this.currentPlatformIndex = index
        },
        updateCurrentPlatformByCode(code) {
            if (!code || code.trim().length < 1) {
                this.updateCurrentPlatform(-1)
                return
            }
            const pms = this.platforms()
            for (var i = 0; i < pms.length; i++) {
                if (code === pms[i].code) {
                    this.updateCurrentPlatform(i)
                    return
                }
            }
            this.updateCurrentPlatform(-1)
        },
        getVender(name) {
            name = name.toLowerCase().trim()
            return this.venders[name]
        },
        currentVender() {
            return this.getVender(this.currentPlatformCode)
        },
        isQQ(platform) {
            return this.isPlatformValid(platform) && platform.trim() == QQ.CODE
        },
        isNetEase(platform) {
            return this.isPlatformValid(platform) && platform.trim() == NetEase.CODE
        },
        isKuWo(platform) {
            return this.isPlatformValid(platform) && platform.trim() == KuWo.CODE
        },
        isKuGou(platform) {
            return this.isPlatformValid(platform) && platform.trim() == KuGou.CODE
        },
        isPlatformValid(platform) {
            return platform && platform.trim().length > 0
        }
    }
})
