<template>
  <div class="app-main">
    <router-view :key="key" v-slot="{ Component }">
      <keep-alive :include="cachedViews">
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <!--<transition name="fade-transform" mode="out-in">-->
    <!--<div>-->
    <!---->
    <!--</div>-->
    <!--</transition>-->
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, computed } from 'vue'

const { proxy }: any = getCurrentInstance()
// string.instanceOf String
const key = computed(() => {
  return proxy.$route.path
})
const cachedViews = computed(() => {
  return proxy.$store.state.app.cachedViews
})
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
