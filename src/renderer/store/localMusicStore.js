import { defineStore } from 'pinia'
import { Track } from '../../common/Track'
import { useIpcRenderer } from '../../common/Utils'
import { Playlist } from "../../common/Playlist";
import { randomTextWithinAlphabetNums } from "../../common/Utils";
const ipcRenderer = useIpcRenderer()

export const useLocalMusicStore = defineStore('localMusic', {
    state: () => ({
        localDirs: [],
        localTracks: [],
        //上面状态，后期会全部移除掉
        localPlaylists: [],
        importTaskCount: 0, //正在进行中的导入任务数
    }),
    getters: {
        getLocalPlaylists() {
            return this.localPlaylists
        }
    },
    actions: {
        async addFolders() {
            if (!ipcRenderer) return
            this.isLoading = true
            const result = await ipcRenderer.invoke('open-dirs')
            if (result) {
                this.localDirs.push(result.path)
                result.data.foeEach(item => {
                    this.localTracks.push(Object.assign(new Track(), item))
                })
            }
            this.isLoading = false
        },
        async addFiles() {
            if (!ipcRenderer) return
            this.isLoading = true
            const result = await ipcRenderer.invoke('open-files')

            if (result) {
                result.forEach(item => {
                    this.localTracks.push(Object.assign(new Track(), item))
                })
            }
            this.isLoading = false
        },
        removeItem(index) {
            if (isNaN(index)) return
            if (index > -1) {
                this.localTracks.splice(index, 1)
            }
        },
        resetAll() {
            this.localDirs.length = 0
            this.localTracks.length = 0
        },
        getLocalPlaylist(id) {
            if (this.localPlaylists.length < 1) return { id }
            const index = this.localPlaylists.findIndex(e => e.id === id)
            return index < 0 ? { id } : this.localPlaylists[index]
        },
        addLocalPlaylist(title, tags, about, cover, data) {
            const id = Playlist.LOCAL_PLAYLIST_ID_PREFIX + randomTextWithinAlphabetNums(12)
            const created = Date.now()
            const updated = created
            tags = tags || ''
            about = about || ''
            cover = cover || 'default_cover.png'
            data = data || []
            data.forEach(item => item.pid = id)
            this.localPlaylists.push({ id, platform: 'local', type: Playlist.NORMAL_TYPE, title, tags, about, cover, data, created, updated })
            return id
        },
        updateLocalPlaylist(id, title, tags, about, cover) {
            if (this.localPlaylists.length < 1) return
            const index = this.localPlaylists.findIndex(e => e.id === id)
            if (index < 0) return
            const updated = Date.now()
            Object.assign(this.localPlaylists[index], { platform: 'local', title, about, tags, cover, updated })
        },
        increaseImportTaskCount() {
            ++this.importTaskCount
        },
        decreaseImportTaskCount() {
            this.importTaskCount = Math.max(this.importTaskCount - 1, 0)
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                paths: ['localPlaylists']
            }
        ]
    }
})
