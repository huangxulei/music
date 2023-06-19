import { createApp } from "vue"
import App from "./App.vue"
//pinia
import { createPinia } from "pinia"
//Route
import { router } from "./route/Router"
//LazyLoad
import VueLazyLoad from "vue3-lazyload"
//播放器
import { Player } from "../common/Player"

//Components
import ProgressBar from "./components/ProgressBar.vue"
import ImageTextTile from "./components/ImageTextTile.vue"
import SongItem from "./components/SongItem.vue"

//状态管理
const pinia = createPinia()
//播放器：初始化并配置
Player.initAndSetup()

//应用：创建、配置
const app = createApp(App)

app.use(pinia)
    .use(router)
    .use(VueLazyLoad, {
        loading: "default_cover.png",
        error: "default_cover.png"
    })
    .component("ProgressBar", ProgressBar)
    .component("ImageTextTile", ImageTextTile)
    .component("SongItem", SongItem)
    .mount("#app")
