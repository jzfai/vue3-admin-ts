<template>
  <div class="mt2">DeepChildren.vue third router render</div>
  <el-input v-model="testInput" placeholder="input test keepAlive(DeepChildren)" class="w300" />
</template>

<script setup lang="ts">
defineOptions({ name: 'DeepChildren' })
import { useAppStore } from '@/store/app'

let testInput = ref('')

const appStore = useAppStore()
appStore.M_ADD_CACHED_VIEW_DEEP('DeepChildren')

onMounted(() => {
  console.log('DeepChildren')
})
</script>

<style scoped lang="scss"></style>
