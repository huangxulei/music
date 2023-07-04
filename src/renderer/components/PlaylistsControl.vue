<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import PaginationTiles from './PaginationTiles.vue'
import { usePlatformStore } from '../store/platformStore';
import { useMainViewStore } from '../store/mainViewStore';
import { storeToRefs } from 'pinia';
const { visitPlaylist } = inject('appRoute')

const props = defineProps({
    data: Array,
    loading: Boolean
})
const router = useRouter()
const { isPlatformValid } = usePlatformStore()
const { exploreModeCode } = storeToRefs(useMainViewStore())
const visitItem = (item) => {
    const { id, platform } = item
    const platformValid = isPlatformValid(platform)
    const idValid = (typeof (id) == 'string') ? (id.trim().length > 0) : (id > 0)
    const visitable = platformValid && idValid
    if (visitable) {
        visitPlaylist(platform, id)
    }
}
</script>


<template>
    <div class="playlists-ctl">
        <PaginationTiles v-show="!loading">
            <ImageTextTile v-for="item in data" :cover="item.cover" :title="item.title" @click="visitItem(item)">

            </ImageTextTile>
        </PaginationTiles>
    </div>
</template>
<style scoped></style>