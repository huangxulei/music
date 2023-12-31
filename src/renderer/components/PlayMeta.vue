<script setup>
import VolumeBar from './VolumeBar.vue';
import AudioTime from './AudioTime.vue';
import { useMainViewStore } from '../store/mainViewStore';
import { usePlayStore } from '../store/playStore';
import { storeToRefs } from 'pinia';
import { Track } from '../../common/Track';
import { onMounted, ref } from 'vue';
import EventBus from '../../common/EventBus';

const { currentTrack, mmssCurrentTime, volume } = storeToRefs(usePlayStore())
const { coverMaskShow } = storeToRefs(useMainViewStore())
const { showPlayingView, toggleCoverMask } = useMainViewStore()

const trackMeta = (track) => {
    let artistName = Track.artistName(track)
    if (artistName.length > 0) artistName = ' - ' + artistName
    return track.title + artistName
}

const volumeBar = ref(null)
onMounted(() => {
    if (volumeBar) volumeBar.value.setVolume(volume.value)
})
</script>
<template>
    <div class="play-meta">
        <div class="cover-wrap" @mouseenter="toggleCoverMask" @mouseleave="toggleCoverMask">
            <img class="audio-cover" v-lazy="currentTrack.cover" />
            <div class="cover-mask" v-show="coverMaskShow" @click="showPlayingView">
                <div class="down-btn">
                    <svg viewBox="0 0 763.32 424.57" xmlns="http://www.w3.org/2000/svg">
                        <g id="Layer_2" data-name="Layer 2">
                            <g id="Layer_1-2" data-name="Layer 1">
                                <path
                                    d="M380.47,322.11c27.6-27.5,54-53.68,80.23-80Q575,127.75,689.38,13.4C708.7-5.81,735-2.92,750.83,12.91c17,17,16.57,43.39-.9,60.87L414.1,409.61c-19.89,19.89-45,20-64.9.08Q180.9,241.45,12.66,73.15A42.53,42.53,0,1,1,72.85,13Q224.7,164.87,376.48,316.73A46.1,46.1,0,0,1,380.47,322.11Z" />
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
        <div class="title-wrap">
            <div class="flex-row">
                <div class="audio-title" v-html="trackMeta(currentTrack)"></div>
            </div>
            <div class="time-volume-wrap">
                <AudioTime :current="mmssCurrentTime" :duration="Track.mmssDuration(currentTrack)"></AudioTime>
                <VolumeBar class="volume-bar" ref="volumeBar"></VolumeBar>
            </div>
        </div>
    </div>
</template>
<style>
.play-meta {
    display: flex;
    height: 77px;
}

.play-meta .title-wrap {
    width: 211px;
    margin-left: 10px;
}

.play-meta .cover-wrap {
    position: relative;
    width: 77px;
    height: 77px;
    box-shadow: 0px 0px 1px #161616;
    box-shadow: 0px 0px 1px var(--main-left-border-color);
}

.play-meta .audio-cover,
.play-meta .cover-mask {
    /*width: 100%;*/
    width: 77px;
    height: 77px;
    cursor: pointer;
    -webkit-user-drag: none;
    -webkit-app-region: no-drag;

    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
}

.play-meta .audio-cover {
    background-color: var(--text-color);
}

.play-meta .cover-mask {
    z-index: 2;
    display: flex;
    align-items: center;
    background-color: #373737ab;
    background-color: var(--ntf-bg);
    opacity: 0.68;
}

.play-meta .cover-mask .down-btn {
    flex: 1;
}

.play-meta .cover-mask .down-btn svg {
    fill: var(--svg-color);
    width: 20px;
    height: 20px;
}

.play-meta .audio-title {
    font-size: 14;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-top: 15px;
    height: 20px;
}

.play-meta .time-volume-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 211px;
    /* justify-content: center; */
}

.play-meta .audio-time,
.play-meta .volume-bar {
    line-height: 25px;
    line-height: 30px;
}

.play-meta .audio-time {
    color: var(--text-sub-color);
    font-size: 14px;
    text-align: left;
    flex: 1;
}
</style>