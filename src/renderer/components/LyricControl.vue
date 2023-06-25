<script setup>
import { watch, ref, onMounted } from 'vue';
import EventBus from '../../common/EventBus';
import { Track } from '../../common/Track'
import { toMMssSSS } from '../../common/Times'
import ArtistControl from './ArtistControl.vue'
import AlbumControl from './AlbumControl.vue'

const props = defineProps({
    track: Object
})
const currentIndex = ref(-1)
const hasLyric = ref(false)
const lyricData = ref(Track.lyricData(props.track))

let destScrollTop = -1
let isUserMouseWheel = false
let userMouseWheelCancelTimer = null

//根据播放进度 同步 歌词 滚动
const renderAndScrollLyric = (secs) => {
    const MMssSSS = toMMssSSS(secs * 1000)
    const lyricWrap = document.querySelector(".lyric-ctl .center")
    const lines = lyricWrap.querySelectorAll('.line')

    let index = -1
    for (var i = 0; i < lines.length; i++) {
        const time = lines[i].getAttribute('time-key')
        if (MMssSSS >= time) {
            index = i
        } else if (MMssSSS < time) {
            break
        }
    }
    if (index < 0) return
    currentIndex.value = index
    //判断是否被鼠标滚动
    if (isUserMouseWheel) return
    const scrollIndex = index > 1 ? (index - 1) : 0
    const scrollHeight = lyricWrap.scrollHeight
    const clientHeight = lyricWrap.clientHeight
    const maxScrollTop = scrollHeight - clientHeight
    destScrollTop = maxScrollTop * (scrollIndex / (lines.length - 1))
    lyricWrap.scrollTop = destScrollTop
}

onMounted(() => {
    EventBus.emit('track-loadLyric', props.track)
})

const reloadLyricData = (track) => {
    hasLyric.value = Track.hasLyric(track)
    lyricData.value = Track.lyricData(track)
}

watch(() => props.track, (nv, ov) => {
    reloadLyricData(nv)
})
EventBus.on('track-lyricLoaded', track => reloadLyricData(track))

EventBus.on('track-pos', secs => {
    try {
        renderAndScrollLyric(secs)
    } catch (error) {
        console.log(error)
    }
})

const onUserMouseWheel = (e) => {
    //e.preventDefault()
    isUserMouseWheel = true
    if (userMouseWheelCancelTimer) clearTimeout(userMouseWheelCancelTimer)
    userMouseWheelCancelTimer = setTimeout(() => {
        isUserMouseWheel = false
    }, 3000)
}
</script>

<template>
    <div class="lyric-ctl">
        <div class="header">
            <div class="audio-title">{{ track.title }}</div>
            <div class="audio-artist" spacing>
                <b>歌手:</b>
                <span>
                    <ArtistControl :visitable="true" :platform="track.platform"
                        :data="track.artist" :trackId="track.id" class="ar-ctl">
                    </ArtistControl>
                </span>
            </div>
            <div class="audio-album spacing">
                <b>专辑</b>
                <span>
                    <AlbumControl :visitable="true" :platform="track.platform"
                        :data="track.album" class="ar-ctl">
                    </AlbumControl>
                </span>
            </div>
        </div>
        <div class="center" ref="lyricWrapRef" @mousewheel="onUserMouseWheel">
            <div v-show="!hasLyric" class="no-lyric">
                <label>暂无歌词,请继续欣赏音乐吧~</label>
            </div>
            <div v-show="hasLyric" v-for="(item, index) in lyricData"
                class="line" :time-key="item[0]"
                :class="{
                    first: index == 0,
                    last: index == (lyricData.size - 1),
                    current: index == currentIndex
                }"
                v-html="item[1]">
            </div>
        </div>
    </div>
</template>
<style scoped>
.lyric-ctl {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.lyric-ctl .spacing {
    margin-top: 10px;
}

.lyric-ctl .header {
    max-height: 202px;
}

.lyric-ctl .header b {
    margin-right: 3px;
    min-width: 43px;
}

.lyric-ctl .audio-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.lyric-ctl .audio-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 6px;
}

.lyric-ctl .audio-artist,
.lyric-ctl .audio-album {
    font-size: 18px;
    font-weight: bold;
    color: var(--text-sub-color);
    display: flex;
}

.lyric-ctl .audio-artist .ar-ctl,
.lyric-ctl .audio-album .al-ctl {
    -webkit-line-clamp: 1;
}

.lyric-ctl .center {
    height: 366px;
    height: 399px;
    overflow: auto;
    margin-top: 15px;
    padding-right: 6px;
    padding-bottom: 15px;
    -webkit-mask-image: linear-gradient(transparent 0%, #fff 20%, #fff 80%, transparent 100%);
}

.lyric-ctl .center .line {
    font-size: 18px;
    line-height: 28px;
    margin-top: 26px;
    color: #ccc;
    color: var(--text-lyric-color);
}

.lyric-ctl .center .current {
    background: var(--hl-text-bg);
    -webkit-background-clip: text;
    color: transparent;
    font-size: 21px;
    font-weight: bold;
}

.lyric-ctl .center .first {
    margin-top: 125px;
}

.lyric-ctl .center .last {
    margin-bottom: 135px;
}

.lyric-ctl .no-lyric {
    display: flex;
    margin-top: 125px;
    align-items: center;
    font-size: 19px;
    color: var(--text-lyric-color);
}
</style>