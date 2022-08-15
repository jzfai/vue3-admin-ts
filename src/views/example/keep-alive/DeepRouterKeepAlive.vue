<template>
  <div>
    <div class="mb1">DeepRouterKeepAlive.vue</div>
    <el-input v-model="testInput" class="w300 mb3" placeholder="input test keepAlive(DeepRouterKeepAlive)" />
    <!--  three router   -->
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedViewsDeep">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DeepRouterKeepAlive'
})

import { useAppStore } from '@/store/app'

let testInput = ref('')
const appStore = useAppStore()
const cachedViewsDeep = computed(() => {
  return appStore.cachedViewsDeep
})

onMounted(() => {
  console.log('DeepRouterKeepAlive')
})
</script>

<style scoped lang="scss"></style>
