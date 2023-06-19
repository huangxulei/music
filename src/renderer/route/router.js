import { createRouter, createWebHashHistory } from "vue-router"
import PlaylistSquareView from "../views/PlaylistSquareView.vue"
import PlaylistDetailView from "../views/PlaylistDetailView.vue"
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
    }
]

export const router = createRouter({
    //为了简单起见，在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes
})
