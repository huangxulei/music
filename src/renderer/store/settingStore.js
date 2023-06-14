import { defineStore } from "pinia"
import EventBus from "../../common/EventBus"
import { useIpcRenderer } from "../../common/Utils"

const ipcRenderer = useIpcRenderer()

const THEMES = [
    {
        id: "dark",
        name: "默认",
        bg: "#464646",
        dark: true
    },
    {
        id: "light",
        name: "白色",
        bg: "#fafafa",
        dark: false
    },
    {
        id: "pink",
        name: "粉色",
        //bg: '#e667af',
        bg: "#fc589c",
        dark: false
    },
    {
        id: "red",
        name: "粉红",
        //bg: '#ef5350',
        bg: "#fc7688",
        dark: false
    },
    {
        id: "green",
        name: "绿色",
        //bg: '#1ca388',
        bg: "#28c83f",
        dark: false
    },
    {
        id: "blue",
        name: "蓝色",
        bg: "#56ccf2",
        dark: false
    },
    {
        id: "yellow",
        name: "黄色",
        bg: "#ffb300",
        dark: false
    },
    {
        id: "purple",
        name: "紫色",
        bg: "#9c27b0",
        dark: true
    }
]

const QUALITIES = [
    {
        id: "NQ",
        name: "普通"
    },
    {
        id: "HQ",
        name: "高"
    },
    {
        id: "SQ",
        name: "无损"
    }
]

export const useSettingStore = defineStore("setting", {
    state: () => ({
        theme: {
            index: 0
        } /* 播放歌曲 */,
        track: {
            //音质级别：NQ(普通)、HQ（高音质）、SQ（超高、无损）
            quality: {
                index: 0
            },
            //VIP收费歌曲，是否自动切换到免费歌曲（可能来自不同平台），默认暂停播放
            vipTransfer: false,
            //歌单分类栏随机显示
            categoryBarRandom: false,
            //播放歌曲时，防止系统睡眠
            playingWithoutSleeping: false
        },
        /* 缓存 */
        cache: {
            storePlayState: true, //退出后保存播放状态：包括当前歌曲、播放列表等
            storeLocalMusic: false //退出后记录已经添加的本地歌曲
        }
    }),
    getters: {
        isPlaylistCategoryRandom(state) {
            return this.track.categoryBarRandom
        },
        isStorePlayStateBeforeQuit(state) {
            return this.cache.storePlayState
        },
        isStoreLocalMusicBeforeQuit(state) {
            return this.cache.storeLocalMusic
        }
    },
    actions: {
        setThemeIndex(index) {
            this.theme.index = index
            const themeId = THEMES[index].id
            EventBus.emit("switchTheme", themeId)
        },
        getCurrentThemeId() {
            let index = this.theme.index
            index = index > 0 ? index : 0
            return THEMES[index].id
        }
    }
})
