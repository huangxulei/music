<script setup>
import { reactive } from 'vue';
import EventBus from '../../common/EventBus';
import { useMainViewStore } from '../store/mainViewStore';
import { usePlaylistSquareViewStore } from '../store/playlistSquareViewStore'
import { storeToRefs } from 'pinia';

const { currentCategoryItem } = storeToRefs(usePlaylistSquareViewStore())
const { currentCategory, updateCurrentCategoryItem } = usePlaylistSquareViewStore()
const { hidePlaylistCategoryView } = useMainViewStore()
const category = reactive([])

const updateCategory = () => {
    category.length = 0
    const cached = currentCategory() || []
    category.push(...cached)
}

const resetScroll = () => {
    const view = document.querySelector(".playlist-category-view")
    view.scrollTop = 0
}

//判断分类是否一致 不一致返回true
const isDiffCate = (item, row, col) => {
    const prevCate = currentCategoryItem.value
    return prevCate ? (
        prevCate.data.value != item.value
        || prevCate.row != row
        || prevCate.col != col) : true
}
const visitCateItem = (item, row, col, forceRefresh) => {
    const needRefresh = isDiffCate(item, row, col) || forceRefresh
    updateCurrentCategoryItem(item, row, col)
    if (needRefresh) {
        EventBus.emit("playlistSquare-refresh")
    }
}

EventBus.on('playlistCategory-update', () => {
    updateCategory()
})

EventBus.on('playlistCategory-resetScroll', () => {
    resetScroll()
})
</script>
<template>
    <div class="playlist-category-view">
        <div class="header">
            <div class="cate-title">全部分类</div>
            <div class="fl-item" v-html="currentCategoryItem.data.key"></div>
        </div>
        <div class="center">
            <div v-for="(cate, row) in category" class="fl-row">
                <div class="cate-title">{{ cate.name }}</div>
                <div class="cate-item-wrap">
                    <div v-for="(item, col) in cate.data" class="fl-item"
                        v-html="item.key" @click="visitCateItem(item, row, col)">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.playlist-category-view {
    overflow: auto;
}

.playlist-category-view .header,
.playlist-category-view .center {
    display: flex;
    text-align: left;
}

.playlist-category-view .header {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-bottom: 10px;
    padding-left: 25px;
    padding-right: 25px;
    border-bottom: 0.5px solid #565656;
    border-bottom: var(--category-view-border);
}

.playlist-category-view .header .cate-title {
    margin-right: 1px;
}

.playlist-category-view .header .fl-item,
.playlist-category-view .header .fl-item:hover {
    cursor: default;
    font-size: 18px;
    background: var(--hl-text-bg);
    -webkit-background-clip: text;
    color: transparent;
    /*
    padding-top: 8px;
    margin-left: 30px;
    */
    position: absolute;
    right: 30px;
}

.playlist-category-view .center {
    flex-direction: column;
    margin-left: 25px;
    margin-right: 25px;
}

.playlist-category-view .fl-row {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    text-align: left;
}

.playlist-category-view .cate-item-wrap {
    display: flex;
    flex-wrap: wrap;
}

.playlist-category-view .cate-title {
    font-size: 18px;
    font-weight: bold;
    /*
    background: linear-gradient(to top right, #28c83f, #1ca388);
    -webkit-background-clip: text;
    color: transparent;
    */
    color: var(--text-sub-color);
    min-width: 36px;
    margin-top: 15px;
    margin-right: 15px;
}

.playlist-category-view .header .cate-title {
    font-size: 21px !important;
}

.playlist-category-view .fl-item {
    /*float: left;*/
    font-size: 15px;
    padding: 6px 16px;
    margin-top: 10px;
    margin-right: 10px;
    cursor: pointer;
    color: var(--text-color);
    border-radius: 10rem;
}

.playlist-category-view .fl-item:hover {
    background-color: var(--list-item-hover);
    color: var(--text-color);
}


.playlist-category-view .current {
    border-radius: 10rem;
    background: var(--hl-text-bg) !important;
    color: var(--svg-btn-color) !important;
}
</style>