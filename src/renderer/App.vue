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
    /*
  background-image: linear-gradient(rgba(0, 0, 255, 0.5), rgba(0, 0, 0, 0.68)), 
      url("../renderer/assets/images/clean-sky.jpg");
  background-image: var(--bg-img);
  background-position: center;
  background-size: cover;
  */
    margin: 0px auto;
    height: 100%;
    font-size: var(--text-size);
    color: var(--text-color);
    overflow: hidden;
}

#app {
    display: flex;
    font-family: var(--text-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
</style>
