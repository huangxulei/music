import { getDoc, postJson } from '../common/HttpClient'
import { Category } from '../common/Category'
import { Playlist } from '../common/Playlist'
import { Track } from '../common/Track'
import { toMillis, toYmd } from '../common/Times'
import { Lyric } from '../common/Lyric'
import forge from 'node-forge'
import { Album } from '../common/Album'
import CryptoJS from 'crypto-js'

const weapi = (text) => {
    if (typeof text === 'object') text = JSON.stringify(text)
    let secretkey = randomText(CHOICE, 16)
    let base64Text = aesEncrypt(text, NONCE, IV)
    const params = aesEncrypt(base64Text, secretkey, IV)
    const encSecKey = rsaEncrypt(secretkey, PUBLIC_KEY, MODULUS)
    return { params, encSecKey }
}
const rsaEncrypt = (src, publicKey, modulus) => {
    src = src.split('').reverse().join('')

    const m = new forge.jsbn.BigInteger(modulus, 16)
    const k = new forge.jsbn.BigInteger(publicKey, 16)
    const s = new forge.jsbn.BigInteger(forge.util.bytesToHex(src), 16)

    return s.modPow(k, m).toString(16).padStart(256, '0')
}

const aesEncrypt = (src, secKey, iv) => {
    secKey = toUtf8(secKey)
    iv = toUtf8(iv)
    src = toUtf8(src)
    const buffer = CryptoJS.AES.encrypt(src, secKey, { iv, mode: CryptoJS.mode.CBC })
    return buffer.toString()
}

const trackIdsParam = (ids) => {
    const c = []
    ids.forEach((id) => {
        c.push({ id })
    })
    return { c: JSON.stringify(c), ids: JSON.stringify(ids) }
}

const searchParam = (keyword, type) => {
    return {
        hlpretag: '<span class="s-fc7">',
        hlposttag: '</span>',
        s: keyword,
        type,
        offset: 0,
        total: 0,
        limit: 30,
        csrf_token: '',
    }
}

//常量
const MODULUS = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b72' + '5152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbd' + 'a92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe48' + '75d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
const NONCE = '0CoJUm6Qyw8W8jud'
const PUBLIC_KEY = '010001'
const IV = '0102030405060708'
const CHOICE = '012345679abcdef'

//URL
const BASE_URL = 'https://music.163.com'
export class NetEase {
    static CODE = 'netease'
    static TOPLIST_CODE = '排行榜'
    static RADIO_PREFIX = 'DJR_'

    //全部分类
    static categories() {
        return new Promise((resolve) => {
            const url = 'https://music.163.com/discover/playlist'
            getDoc(url).then((doc) => {
                const result = { platform: NetEase.CODE, data: [], orders: [] }
                result.data.push(DEFAULT_CATE)

                const listEl = doc.querySelectorAll('#cateListBox .f-cb')
                listEl.forEach((el) => {
                    const cate = el.querySelector('dt').textContent
                    const category = new Category(cate)
                    const fcEls = el.querySelectorAll('.s-fc1')
                    fcEls.forEach((item) => {
                        const text = item.textContent
                        category.add(text, text)
                    })
                    result.data.push(category)
                })
                const firstCate = result.data[0]
                firstCate.data.splice(1, 0, { key: '排行榜', value: NetEase.TOPLIST_CODE })
                resolve(result)
            })
        })
    }
    //歌单(列表)广场
    static square(cate, offset, limit, page, order) {
        if (cate == NetEase.TOPLIST_CODE) return NetEase.toplist(cate, offset, limit, page)
        return new Promise((resolve) => {
            const url = 'https://music.163.com/discover/playlist' + '?cat=' + encodeURIComponent(cate) + '&order=hot' + '&limit=' + limit + '&offset=' + offset
            getDoc(url).then((doc) => {
                const result = { platform: NetEase.CODE, cate, offset, limit, page, total: 0, data: [] }
                const listEl = doc.querySelectorAll('#m-pl-container li')
                listEl.forEach((el) => {
                    let id = null,
                        cover = null,
                        title = null,
                        itemUrl = null,
                        listenNum = 0
                    const coverEl = el.querySelector('.u-cover img')
                    const titleEl = el.querySelector('.dec a')
                    const listenNumEl = el.querySelector('.bottom .nb')

                    if (coverEl) {
                        cover = coverEl.getAttribute('src').split('?')[0]
                        //cover = coverEl.getAttribute("src").replace("140y140", "500y500")
                    }

                    if (titleEl) {
                        title = titleEl.textContent
                        itemUrl = BASE_URL + titleEl.getAttribute('href')
                        id = itemUrl.split('=')[1]
                    }

                    if (listenNumEl) {
                        listenNum = parseInt(listenNumEl.textContent || 0)
                    }

                    if (id && itemUrl) {
                        const playlist = new Playlist(id, NetEase.CODE, cover, title, itemUrl)
                        playlist.listenNum = listenNum
                        result.data.push(playlist)
                    }
                })
                const pgEls = doc.querySelectorAll('#m-pl-pager .u-page .zpgi')
                if (pgEls && pgEls.length > 0) {
                    const totalEl = pgEls[pgEls.length - 1]
                    if (totalEl) result.total = parseInt(totalEl.textContent)
                }
                resolve(result)
            })
        })
    }
    //排行榜列表
    static toplist(cate, offset, limit, page) {
        return new Promise((resolve) => {
            const result = { platform: NetEase.CODE, cate, offset: 0, limit: 100, page: 1, total: 0, data: [] }
            if (page > 1) {
                resolve(result)
                return
            }
            const url = 'https://music.163.com/discover/toplist'
            getDoc(url).then((doc) => {
                const listEl = doc.querySelectorAll('#toplist li')
                listEl.forEach((el) => {
                    let id = null,
                        cover = null,
                        title = null,
                        itemUrl = null

                    const coverEl = el.querySelector('.mine .left img')
                    const titleEl = el.querySelector('.mine .name a')

                    if (coverEl) {
                        cover = coverEl.getAttribute('src').replace('40y40', '500y500')
                    }

                    if (titleEl) {
                        title = titleEl.textContent
                        itemUrl = BASE_URL + titleEl.getAttribute('href')
                        id = itemUrl.split('=')[1]
                    }

                    if (id && itemUrl) {
                        const detail = new Playlist(id, NetEase.CODE, cover, title, itemUrl)
                        result.data.push(detail)
                    }
                })
                resolve(result)
            })
        })
    }

    //歌单详情
    static playlistDetail(id, offset, limit, page) {
        if (id.toString().startsWith(Playlist.ANCHOR_RADIO_ID_PREFIX)) return NetEase.anchorRadioDetail(id, offset, limit, page)
        return new Promise((resolve, reject) => {
            const result = new Playlist()
            let url = 'https://music.163.com/weapi/v3/playlist/detail'
            let param = {
                id,
                offset: 0,
                total: true,
                limit: 1000,
                n: 1000,
                csrf_token: '',
            }
            let reqBody = weapi(param)
            postJson(url, reqBody).then((json) => {
                const playlist = json.playlist

                result.id = playlist.id
                result.platform = NetEase.CODE
                result.title = playlist.name
                result.cover = playlist.coverImgUrl
                result.about = playlist.description

                const ids = []
                playlist.trackIds.forEach((track) => {
                    ids.push(track.id)
                })

                result.total = ids.length
                const end = Math.min(offset + limit, result.total)

                url = 'https://music.163.com/weapi/v3/song/detail'
                param = trackIdsParam(ids.slice(offset, end))
                reqBody = weapi(param)
                postJson(url, reqBody).then((json) => {
                    const songs = json.songs
                    songs.forEach((song) => {
                        const artist = []
                        song.ar.forEach((e) => artist.push({ id: e.id, name: e.name }))
                        const album = { id: song.al.id, name: song.al.name }
                        const track = new Track(song.id, NetEase.CODE, song.name, artist, album, song.dt, song.al.picUrl)
                        track.mv = song.mv
                        track.pid = id
                        result.addTrack(track)
                    })
                    resolve(result)
                })
            })
        })
    }

    //歌词
    static lyric(id, track) {
        return new Promise((resolve, reject) => {
            const url = 'https://music.163.com/weapi/song/lyric?csrf_token='
            const param = {
                id,
                lv: -1,
                tv: -1,
                csrf_token: '',
            }
            const reqBody = weapi(param)
            const result = { id, platform: NetEase.CODE, lyric: null, trans: null }
            postJson(url, reqBody).then((json) => {
                const { lrc, tlyric } = json
                Object.assign(result, { lyric: Lyric.parseFromText(lrc.lyric) })
                if (tlyric) {
                    if (!isBlank(tlyric.lyric)) Object.assign(result, { trans: Lyric.parseFromText(tlyric.lyric) })
                }
                resolve(result)
            })
        })
    }

    static resolveAnchorRadio(id, track) {
        return new Promise((resolve, reject) => {
            if (id.toString().startsWith(NetEase.RADIO_PREFIX)) id = track.songlistId
            resolve(id)
        })
    }
}
