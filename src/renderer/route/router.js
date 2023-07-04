import { createRouter, createWebHashHistory } from "vue-router"
import PlaylistSquareView from "../views/PlaylistSquareView.vue"
import PlaylistDetailView from "../views/PlaylistDetailView.vue"
import LocalMusicView from "../views/LocalMusicView.vue"
import LocalPlaylistEditView from "../views/LocalPlaylistEditView.vue"
import LocalPlaylistDetailView from "../views/LocalPlaylistDetailView.vue"
const routes = [
    {
        path: "/",
        redirect: "/playlists/square/qq"
    },
    {
        path: "/playlists/square/:platform",
        component: PlaylistSquareView
    },
    {
        //歌单详情
        path: "/:exploreMode/playlist/:platform/:id",
        props: true,
        component: PlaylistDetailView
    },
    {  //本地歌曲
        path: '/local',
        component: LocalMusicView
    },
    {  //分类歌单 - 本地歌曲 - 自建歌单
        path: '/:exploreMode/local/create',
        props: true,
        component: LocalPlaylistEditView
    },
    {  //分类歌单 - 自建本地歌单 - 详情
        path: '/:exploreMode/local/:id',
        props: true,
        component: LocalPlaylistDetailView
    },
]

export const router = createRouter({
    //为了简单起见，在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes
})
