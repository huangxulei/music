import { defineStore } from "pinia"
import { PLAY_MODE } from "../../common/Constants"
import EventBus from "../../common/EventBus"
import { Track } from "../../common/Track"
import { toMmss } from "../../common/Times"

const NO_TRACK = new Track(0, "", "听你想听，爱你所爱", [{ id: 0, name: "不枉青春" }], { id: 0, name: "山川湖海，日月星辰" }, 0, "default_cover.png")

export const usePlayStore = defineStore("play", {
    state: () => ({
        playing: false,
        playingIndex: -1,
        playMode: PLAY_MODE.REPEAT_ALL,
        queueTracks: [],
        currentTime: 0,
        progress: 0.0,
        volume: 0.5,
        isAutoPlaying: false
    }),
    getters: {
        track(state) {
            return (index) => {
                return state.queueTracks[index]
            }
        },
        //根据当前播放下标 获取
        currentTrack(state) {
            if (this.playingIndex < 0) return NO_TRACK
            return this.track(this.playingIndex)
        },
        /**
         *
         * @param {*} track
         * @returns 是否为当前播放
         */
        isCurrentTrack(state) {
            return (track) => {
                return track.id > 0 && state.currentTrack.id == track.id
            }
        },
        noTrack() {
            return NO_TRACK
        }, //当前播放时间
        mmssCurrentTime() {
            return toMmss(this.currentTime)
        },
        //播放列表长度
        queueTracksSize(state) {
            return state.queueTracks.length
        },
        //是否有歌词
        hasLyric(state) {
            const track = state.currentTrack
            if (!track) return false
            const lyric = track.lyric
            if (!lyric) return false
            return lyric.data.size > 0
        }
    },
    actions: {
        setPlaying(value) {
            this.playing = value
        },
        togglePlay() {
            //播放列表为空
            if (this.queueTracksSize < 1) return
            //当前歌曲不存在或存在但缺少url
            if (!Track.hasUrl(this.currentTrack) || this.currentTrack == NO_TRACK) {
                this.playNextTrack()
                return
            }
            EventBus.emit("track-togglePlay")
        },
        //增加歌曲
        addTrack(track) {
            const index = this.queueTracks.findIndex((e) => {
                Track.isEquals(track, e)
            })
            if (index == -1) this.queueTracks.push(track)
        },
        addTracks(tracks) {
            if (tracks.length < 1) return
            tracks.forEach((item) => {
                this.addTrack(item)
            })
        },
        removeTrack(track) {
            const index = this.queueTracks.findIndex((item, index) => Track.isEquals(track, item))
            if (index > -1) {
                const isCurrent = index == this.playingIndex
                this.queueTracks.splice(index, 1)
                if (index <= this.playingIndex) {
                    --this.playingIndex
                }
                const maxSize = this.queueTracksSize
                if (maxSize < 1) {
                    this.resetQueue()
                    return
                }
                if (isCurrent) {
                    if (this.playing) {
                        this.playNextTrack()
                    }
                }
            }
        },
        resetQueue() {
            this.isAutoPlaying = false
            this.queueTracks.length = 0
            this.playingIndex = -1
            this.__resetPlayState()
            EventBus.emit("queue-empty")
        },
        __resetPlayState() {
            this.playing = false
            this.currentTime = 0
            this.progress = 0.0
        },
        playTrack(track) {
            //是否在播放列表中 返回下标
            let index = this.queueTracks.findIndex((item, index) => Track.isEquals(track, item))
            // let index = this.queueTracks.findIndex((item) => {
            //     Track.isEquals(track, item)
            // })
            //-1 不在列表中 获取当前播放下标 加1 给track,并假如播放列表中
            if (index == -1) {
                index = this.playingIndex + 1
                this.queueTracks.splice(index, 0, track)
                console.log(this.queueTracks)
            }
            //改变当前播放下标
            this.playingIndex = index
            if (Track.hasUrl(track)) {
                EventBus.emit("track-play", track)
                //if (!Track.hasLyric(track)) EventBus.emit("track-loadLyric", track)
            } else {
                this.__changeTrack(track)
            }
        },
        playPrevTrack() {
            const maxSize = this.queueTracksSize
            if (maxSize < 1) return
            switch (this.playMode) {
                case PLAY_MODE.REPEAT_ALL:
                    --this.playingIndex
                    this.playingIndex = this.playingIndex < 0 ? maxSize - 1 : this.playingIndex
                    break
                case PLAY_MODE.REPEAT_ONE:
                    break
                case PLAY_MODE.RANDOM:
                    break
            }
            this.__validPlayingIndex()
            this.__changeTrack(this.currentTrack)
        },
        playNextTrack() {
            const maxSize = this.queueTracksSize
            if (maxSize < 1) return
            switch (this.playMode) {
                case PLAY_MODE.REPEAT_ALL:
                    this.playingIndex = ++this.playingIndex % maxSize
                case PLAY_MODE.REPEAT_ONE:
                    break
                case PLAY_MODE.RANDOM:
                    this.playingIndex = Math.ceil(Math.random() * maxSize)
                    break
            }
            this.__validPlayingIndex()
            this.__changeTrack(this.currentTrack)
        },
        __changeTrack(track) {
            EventBus.emit("track-stop")
            EventBus.emit("track-changed", track)
            this.__resetPlayState()
        },
        __resetPlayState() {
            this.playing = false
            this.currentTime = 0
            this.progress = 0.0
        },
        __validPlayingIndex() {
            const maxSize = this.queueTracksSize
            this.playingIndex = this.playingIndex > 0 ? this.playingIndex : 0
            this.playingIndex = this.playingIndex < maxSize ? this.playingIndex : maxSize - 1
        },
        updateCurrentTime(secs) {
            this.currentTime = secs * 1000
            let duration = 0
            try {
                duration = this.currentTrack.duration
            } catch (error) {
                console.log(error)
            }
            this.progress = duration > 0 ? this.currentTime / duration : 0
        },
        switchPlayMode() {
            this.playMode = ++this.playMode % 3
        },
        setAutoPlaying(value) {
            this.isAutoPlaying = value
        },
        /**
         *改变
         */
        updateVolume(value) {
            value = parseFloat(value)
            value = value > 0 ? value : 0
            value = value < 1 ? value : 1
            this.volume = value
            EventBus.emit("volume-set", value)
        },
        updateVolumeByOffset(value) {
            value = parseFloat(value)
            this.updateVolume(this.volume + value)
        }
    }
})
