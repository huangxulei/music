import { toTrimString } from './Utils';

export class Playlist {
    //普通歌单
    static NORMAL_TYPE = 0
    //普通电台歌单(无详情)
    static NORMAL_RADIO_TYPE = 1
    //FM广播电台歌单(无详情)
    static FM_RADIO_TYPE = 2
    //主播电台歌单
    static ANCHOR_RADIO_TYPE = 3
    //TODO
    static ANCHOR_RADIO_ID_PREFIX = "ARP_"
    //自定义列表
    static CUSTOM_ID_PREFIX = "CMP_"
    //本地自建歌单
    static LOCAL_PLAYLIST_ID_PREFIX = "LLP_"
    constructor(id, platform, cover, title, url, about, data) {
        this.id = id
        this.platform = platform
        this.cover = cover
        this.title = title
        this.url = url
        this.about = about ? about : ''
        this.data = data || []
        this.total = 0
        //歌单类型：普通、电台
        this.isRadioType = false
        //当歌单类型为电台时，是否为广播电台
        this.isFMRadio = false

    }

    addTrack(track) {
        this.data.push(track)
        return this
    }

}