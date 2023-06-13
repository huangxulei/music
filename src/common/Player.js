import { Howl, Howler } from "howler"
import { PLAY_STATE } from "../common/Constants"
import EventBus from "../common/EventBus"
import { Track } from "../common/Track"

export class Player {
    constructor(track) {
        this.currentTrack = track
        this.sound = null
        this.retry = 0
    }
}
