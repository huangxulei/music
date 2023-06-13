import { getJson, postJson } from '../common/HttpClient'
import { Category } from '../common/Category'
import { Playlist } from '../common/Playlist'

const moduleReq = (module, method, param) => {
    return { module, method, param }
}

export class QQ {
    static CODE = 'qq'
    static DEFAULT_CATE = 10000000
    static NEW_CODE = 22222222
    static TOPLIST_CODE = 99999999
    static RADIO_CODE = 88888888
    static TOPLIST_PREFIX = 'TOP_'
    static RADIO_CACHE = { channel: 0, data: [] }
    static categories() {
        return QQ.categories_vl()
    }
    //全部分类
    static categories_v0() {
        return new Promise((resolve, reject) => {
            const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg'
            const reqBody = {
                format: 'json',
                inCharset: 'utf8',
                outCharset: 'utf8',
            }
            const result = { platform: QQ.CODE, data: [], orders: [] }
            getJson(url, reqBody).then((json) => {
                const cateNameCached = []
                const list = json.data.categories
                list.forEach((cate) => {
                    const cateName = cate.categoryGroupName
                    const category = new Category(cateName)
                    const items = cate.items
                    items.forEach((item) => {
                        const name = item.categoryName
                        const id = item.categoryId
                        category.add(name, id)
                    })
                    if (cateNameCached.includes(cateName)) return
                    result.data.push(category)
                    cateNameCached.push(cateName)
                })
                const firstCate = result.data[0]
                firstCate.data.splice(1, 0, { key: '最新', value: QQ.NEW_CODE })
                firstCate.data.splice(2, 0, { key: '排行榜', value: QQ.TOPLIST_CODE })
                firstCate.data.splice(3, 0, { key: '电台', value: QQ.RADIO_CODE })
                resolve(result)
            })
        })
    }
    //全部分类
    static categories_v1() {
        return new Promise((resolve, reject) => {
            const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
            const reqBody = JSON.stringify({
                req_1: moduleReq('music.playlist.PlaylistSquare', 'GetAllTag', { qq: '' }),
                comm: {
                    g_tk: 5381,
                    uin: '0',
                    format: 'json',
                    ct: 6,
                    cv: 80605,
                    platform: 'wk_v17',
                    uid: '5019772269',
                    guid: '2057708153c9fc13f0e801c14d39af5fccdfdc60',
                    mesh_devops: 'DevopsBase',
                },
            })
            const result = { platform: QQ.CODE, data: [], orders: [] }
            postJson(url, reqBody).then((json) => {
                const recommandTagNames = ['国语', '英语', '粤语', '轻音乐', '校园', '民谣', '轻音乐', '思念', '学习工作', '治愈', '古典', '摇滚', '爵士', '运动', '乡村', '乐器', '婚礼']
                const recommandCategory = new Category('推荐', 0)
                result.data.push(recommandCategory)

                const list = json.req_1.data.v_group
                list.forEach((cate) => {
                    const cateName = cate.group_name
                    const cateCode = cate.group_id
                    const category = new Category(cateName, cateCode)
                    const items = cate.v_item
                    items.forEach((item) => {
                        const { id, name } = item
                        if (name == 'AI歌单') return
                        if (recommandTagNames.includes(name)) recommandCategory.add(name, id)
                        category.add(name, id)
                    })
                    result.data.push(category)
                })
                const firstCate = result.data[0]
                firstCate.data.splice(0, 0, { key: '默认', value: QQ.DEFAULT_CATE })
                firstCate.data.splice(1, 0, { key: '排行榜', value: QQ.TOPLIST_CODE })
                firstCate.data.splice(2, 0, { key: '电台', value: QQ.RADIO_CODE })
                //firstCate.data.splice(4, 0, { key: '最新', value: QQ.NEW_CODE })
                resolve(result)
            })
        })
    }

    //排行榜列表
    static toplist(cate, offset, limit, page, order) {
        return new Promise((resolve, reject) => {
            let result = { platform: QQ.CODE, cate, offset: 0, limit: 100, page: 1, total: 0, data: [] }
            if (page > 1) {
                resolve(result)
                return
            }
            const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
            const reqBody = topListReqBody()
            getJson(url, reqBody).then((json) => {
                const groupList = json.req_1.data.group
                groupList.forEach((group) => {
                    group.toplist.forEach((item) => {
                        const id = QQ.TOPLIST_PREFIX + item.topId
                        const cover = item.frontPicUrl || item.headPicUrl
                        const detail = new Playlist(id, QQ.CODE, cover, item.title)
                        detail.about = item.intro
                        result.data.push(detail)
                    })
                })
                resolve(result)
            })
        })
    }

    //歌单广场(列表)
    static square(cate, offset, limit, page) {
        return QQ.square_v1(cate, offset, limit, page)
    }

    //歌单广场(列表)
    static square_v0(cate, offset, limit, page) {
        const originCate = cate || 0
        let resolvedCate = cate
        if (typeof resolvedCate == 'string') resolvedCate = parseInt(resolvedCate.trim())
        resolvedCate = resolvedCate > 0 ? resolvedCate : QQ.DEFAULT_CATE
        //榜单
        if (resolvedCate == QQ.TOPLIST_CODE) return QQ.toplist(cate, offset, limit, page)
        //电台
        if (resolvedCate == QQ.RADIO_CODE) return QQ.playlistRadios(cate, offset, limit, page)
        //普通歌单
        let sortId = 5 //最热
        if (resolvedCate == QQ.NEW_CODE) {
            sortId = 2 //最新
            resolvedCate = QQ.DEFAULT_CATE
        }
        return new Promise((resolve, reject) => {
            const result = { platform: QQ.CODE, cate: originCate, offset, limit, page, total: 0, data: [] }
            const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
            const reqBody = {
                format: 'json',
                inCharset: 'utf8',
                outCharset: 'utf8',
                sortId: sortId, //5 => 最热, 2 => 最新
                categoryId: resolvedCate,
                sin: offset,
                ein: offset + limit - 1,
            }
            getJson(url, reqBody).then((json) => {
                result.total = Math.ceil(json.data.sum / limit)
                const list = json.data.list
                list.forEach((item) => {
                    const cover = item.imgurl
                    const playlist = new Playlist(item.dissid, QQ.CODE, cover, item.dissname)
                    playlist.about = item.introduction
                    playlist.listenNum = item.listennum
                    result.data.push(playlist)
                })
                resolve(result)
            })
        })
    }

    //歌单广场(列表)
    static square_v1(cate, offset, limit, page) {
        const originCate = cate || 0
        let resolvedCate = cate
        if (typeof resolvedCate == 'string') resolvedCate = parseInt(resolvedCate.trim())
        resolvedCate = resolvedCate > 0 ? resolvedCate : QQ.DEFAULT_CATE
        //榜单
        if (resolvedCate == QQ.TOPLIST_CODE) return QQ.toplist(cate, offset, limit, page)
        //电台
        if (resolvedCate == QQ.RADIO_CODE) return QQ.playlistRadios(cate, offset, limit, page)
        //普通歌单
        if (resolvedCate == QQ.DEFAULT_CATE || resolvedCate == QQ.NEW_CODE) {
            return QQ.square_v0(cate, offset, limit, page)
        }
        return new Promise((resolve, reject) => {
            const result = { platform: QQ.CODE, cate: originCate, offset, limit, page, total: 0, data: [] }
            const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
            const reqBody = JSON.stringify({
                req_1: moduleReq('playlist.PlayListCategoryServer', 'get_category_content', {
                    caller: '0',
                    category_id: resolvedCate,
                    page: page - 1,
                    use_page: 1,
                    size: limit,
                }),
            })
            postJson(url, reqBody).then((json) => {
                const { content } = json.req_1.data
                result.total = Math.ceil(content.total_cnt / limit)
                const list = content.v_item
                list.forEach((lItem) => {
                    const item = lItem.basic
                    const cover = item.cover.big_url || item.cover.medium_url || item.cover.default_url
                    const playlist = new Playlist(item.tid, QQ.CODE, cover, item.title)
                    playlist.about = item.desc
                    playlist.listenNum = item.play_cnt
                    playlist.total = item.song_cnt
                    result.data.push(playlist)
                })
                resolve(result)
            })
        })
    }
}
