<template>
  <router-view />
</template>
<script setup lang='ts' >
import { setToken } from '@/utils/auth'
import { onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const settings = computed(() => {
  return store.state.app.settings
})
onBeforeMount(() => {
  //set tmp token when setting isNeedLogin false
  if (!settings.value.isNeedLogin) setToken(settings.value.tmpToken)
})
</script>
