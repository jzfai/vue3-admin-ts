<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!--has transition  Judging by settings.mainNeedAnimation-->
    <transition-group name="breadcrumb" v-if="settings.mainNeedAnimation">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">
          {{ item.meta?.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
    <!--no transition-->
    <template v-else>
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">
          {{ item.meta?.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { onBeforeMount, getCurrentInstance, watch, ref, computed } from 'vue'
import { compile } from 'path-to-regexp'
let levelList: any = ref(null)
let { proxy }: any = getCurrentInstance()

//Whether close the animation fo breadcrumb
import { useStore } from 'vuex'
let store = useStore()
let settings = computed(() => {
  return store.state.app.settings
})

import { RouteItemTy } from '@/types/router'
const getBreadcrumb = () => {
  // only show routes with meta.title
  let matched = proxy.$route.matched.filter((item: RouteItemTy) => item.meta && item.meta.title)
  const first = matched[0]
  if (!isDashboard(first)) {
    //it can replace the first page if not exits
    matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched)
  }
  levelList.value = matched.filter(
    (item: RouteItemTy) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  )
}

const isDashboard = (route: RouteItemTy) => {
  const name = route?.name
  if (!name) {
    return false
  }
  return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
}
const pathCompile = (path: string) => {
  const { params } = proxy.$route
  const toPath = compile(path)
  return toPath(params)
}
const handleLink = (item: RouteItemTy) => {
  const { redirect, path } = item
  if (redirect) {
    proxy.$router.push(redirect)
    return
  }
  if (path) {
    proxy.$router.push(pathCompile(path))
  }
}
watch(
  () => proxy.$route,
  () => {
    getBreadcrumb()
  },
  { immediate: true }
)
onBeforeMount(() => {
  getBreadcrumb()
})
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
