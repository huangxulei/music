<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router';
import { usePlatformStore } from '../store/platformStore';
import WinTrafficLightBtn from '../components/WinTrafficLightBtn.vue';
import { useMainViewStore } from '../store/mainViewStore';
import EventBus from '../../common/EventBus';
import { useUseCustomTrafficLight } from '../../common/Utils';
import path from 'path';
import { ref } from 'vue';
import { useSettingStore } from '../store/settingStore';

//是否使用自定义交通灯控件
const useCustomTrafficLight = useUseCustomTrafficLight()
const router = useRouter()

const { platforms, currentPlatformIndex,
    currentPlatformCode, isLocal } = storeToRefs(usePlatformStore())
const { updateCurrentPlatform } = usePlatformStore()
const { isPlaylistMode, isArtistMode, isUserHomeMode,
    exploreModeIndex, exploreModeCode } = storeToRefs(useMainViewStore())
const { setExploreMode } = useMainViewStore()


</script>
<template>
    <div id="main-left">
        <div class="header">
            <WinTrafficLightBtn v-show="useCustomTrafficLight"></WinTrafficLightBtn>
        </div>
    </div>
</template>
<style>
#main-left {
    width: 16.5%;
    width: 211px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 3px var(--main-left-border-color);
}

#main-left ::-webkit-scrollbar-thumb {
    background: transparent;
    border: 1px solid transparent;
}
</style>