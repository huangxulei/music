<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import CreatePlaylistBtn from '../components/CreatePlaylistBtn.vue';
</script>
<template>
    <div id="local-music-view">
        <div class="header">
            <div class="title">本地歌曲</div>
            <div class="about">
                <p>支持播放的音频格式：.mp3、.flac、.ogg、.wav、.aac、.m4a</p>
                <p>支持导入的歌单格式：.m3u、.pls</p>
                <p>歌单导入、导出功能，并不支持跨设备，而为兼容当前设备下的其他播放器</p>
                <p>最近播放功能，暂时还不支持记录本地歌曲</p>
                <p>歌曲信息乱码时，建议使用第三方音乐标签工具修正后，再重新添加到当前播放器</p>
            </div>
            <div class="action">
                <CreatePlaylistBtn :leftAction="visitLocalPlaylistCreate">
                </CreatePlaylistBtn>
            </div>
        </div>
    </div>
</template>
<style scoped>
#local-music-view {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px 33px 10px 33px;
    overflow: scroll;
    overflow-x: hidden;
}

#local-music-view .spacing {
    margin-left: 20px;
}

#local-music-view .header {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

#local-music-view .header .title {
    text-align: left;
    margin-bottom: 10px;
    font-size: var(--content-text-module-title-size);
    font-weight: bold;
}

#local-music-view .header .about {
    text-align: left;
    margin-left: 5px;
    margin-bottom: 15px;
    line-height: 28px;
    color: var(--content-subtitle-text-color);
}

#local-music-view .header .action {
    display: flex;
}

#local-music-view .center .list-title {
    margin-bottom: 5px;
    text-align: left;
    font-size: 16px;
    font-weight: bold;
}
</style>