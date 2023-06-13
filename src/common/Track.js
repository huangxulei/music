import { Lyric } from './Lyric'
import { toMmss } from './Times'
const DEFAULT_COVER = 'default_cover.png'

export class Track {
    constructor(id, platform, title, artist, album, duration, cover) {
        this.id = id ? id + '' : ''
        this.platform = platform
        this.title = title
        this.artist = artist
        this.album = album
        this.duration = duration ? duration : 0
        this.cover = cover ? cover : DEFAULT_COVER
        this.url = ''
        this.lyric = new Lyric()
        this.isRadioType = false //是否为电台歌曲
        //当歌单类型为电台时，是否为广播电台
        this.isFMRadio = false
        this.channel = ''
    }

    /** 歌曲时间转换 */
    static mmssDuration(track) {
        return toMmss(track.duration)
    }

    mmssDuration() {
        return Track.mmssDuration(this)
    }

    //歌手
    static artistName(track) {
        let artistName = ''
        if (track && track.artist) {
            const names = []
            track.artist.forEach((e) => {
                names.push(e.name)
            })
            artistName = names.join('、')
            artistName = artistName.slice(0, artistName.length)
        }
        return artistName
    }

    artistName() {
        return Track.artistName(this)
    }
    //第一个歌手名字
    static firstArtistName(track) {
        return track ? track.artistName().split('、')[0] : ''
    }

    firstArtistName() {
        return Track.firstArtistName(this)
    }
    //是否有歌词
    static hasLyric(track) {
        return track && track.lyric && Lyric.hasData(track.lyric)
    }

    hasLyric() {
        return Track.hasLyric(this)
    }

    //获取歌词
    static lyricData(track) {
        return track && track.lyric ? track.lyric.data : []
    }

    lyricData() {
        return Track.lyricData(this)
    }

    //是否有个歌曲
    static hasUrl(track) {
        return track && track.url && track.url.trim().length > 0
    }

    hasUrl() {
        return Track.hasUrl(this)
    }

    //是否有封面
    static hasCover(track) {
        if (!track || !track.cover) return false
        track.cover = track.cover.trim()
        if (track.cover.length < 1) return false
        return track.cover != DEFAULT_COVER
    }

    hasCover() {
        return Track.hasCover(this)
    }
    //是否有id号
    static hasId(track) {
        if (!track || !track.id) return false
        if (typeof track.id == 'number') return track.id > 0
        if (typeof track.id == 'string') return track.id.length > 0
    }

    hasId() {
        return Track.hasId(this)
    }

    static isEquals(t1, t2) {
        if (!t1 || !t2) return false
        return t1.id == t2.id && t1.platform == t2.platform
    }
}
