import { Howl, Howler } from "howler"
import { PLAY_STATE } from "../common/Constants"
import EventBus from "../common/EventBus"
import { Track } from "../common/Track"

let singleton = null

export class Player {
    constructor(track) {
        this.currentTrack = track
        this.sound = null
        this.retry = 0
    }

    static get() {
        if (!singleton) singleton = new Player()
        return singleton
    }

    /* 初始化并配置播放器 */
    static initAndSetup() {
        const player = Player.get()
        //添加行为
        return player
            .on("suspend", () => player.pause())
            .on("track-play", (track) => player.playTrack(track))
            .on("track-restore", (track) => player.restore(track))
            .on("track-togglePlay", () => player.togglePlay())
            .on("track-seek", (percent) => player.seek(percent))
            .on("volume-set", (volume) => player.volume(volume))
            .on("track-stop", () => player.setCurrent(null))
            .on("radio-play", () => player.setCurrent(null))
            .on("queue-empty", () => player.setCurrent(null))
    }

    on(event, handler) {
        EventBus.on(event, handler)
        return this
    }

    createSound() {
        if (!Track.hasUrl(this.currentTrack)) return null
        var self = this
        //释放资源
        if (this.sound) this.sound.unload()
        this.sound = new Howl({
            src: [this.currentTrack.url],
            html5: true,
            onplay: function () {
                this.retry = 0
                requestAnimationFrame(self.__step.bind(self))
                self.notifyStateChanged(PLAY_STATE.PLAYING)
            },
            onpause: function () {
                self.notifyStateChanged(PLAY_STATE.PAUSE)
            },
            onend: function () {
                self.notifyStateChanged(PLAY_STATE.END)
            },
            onseek: function () {
                requestAnimationFrame(self.__step.bind(self))
            },
            onloaderror: function () {
                self.retryPlay(1)
            },
            onplayerror: function () {
                self.retryPlay(1)
            }
        })
        return this.sound
    }

    play() {
        let sound = this.getSound()
        if (sound) sound.play()
    }

    pause() {
        const sound = this.getSound()
        if (sound) sound.pause()
    }

    togglePlay() {
        const sound = this.getSound()
        if (!sound) {
            this.retryPlay(1)
            return
        }
        if (sound.playing()) {
            sound.pause()
        } else {
            sound.play()
        }
    }

    stop() {
        const sound = this.getSound()
        if (sound) sound.stop()
    }

    setCurrent(track) {
        this.stop()
        this.currentTrack = track
        this.createSound()
    }

    playTrack(track) {
        console.log("播放歌曲", track.title)
        this.setCurrent(track)
        this.play()
    }

    restore(track) {
        this.setCurrent(track)
    }

    volume(value) {
        Howler.volume(value)
    }

    getSound() {
        return Track.hasUrl(this.currentTrack) ? this.sound : null
    }

    seek(percent) {
        console.log(percent)
        const sound = this.getSound()
        if (!sound) return
        if (sound.playing()) sound.seek(sound.duration() * percent)
    }

    __step() {
        const sound = this.getSound()
        if (!sound) return
        if (!sound.playing()) return
        const seek = sound.seek() || 0
        EventBus.emit("track-pos", seek)
        requestAnimationFrame(this.__step.bind(this))
    }

    notifyStateChanged(state) {
        EventBus.emit("track-state", state)
    }

    notifyError() {
        EventBus.emit("track-error", this.currentTrack)
    }

    retryPlay(times) {
        if (this.retry < times) this.notifyError()
        ++this.retry
    }
}
