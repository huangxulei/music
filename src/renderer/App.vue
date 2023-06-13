<script setup>
import PlayerBoostrap from './components/PlayerBoostrap.vue';
import Themes from './components/Themes.vue';
import MainLeft from './layout/MainLeft.vue'
import MainCenter from './layout/MainCenter.vue'
</script>

<template>
    <PlayerBoostrap>
        <Themes>
            <MainLeft></MainLeft>
            <MainCenter></MainCenter>
        </Themes>
    </PlayerBoostrap>
</template>

<style>
html,
body,
#app {
    background-color: var(--bg-color);
    background: var(--app-bg);
    background-position: center;
    background-size: cover;
}
</style>
