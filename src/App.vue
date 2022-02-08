<template>
  <router-view />
</template>
<script setup lang="ts">
import { setToken } from '@/utils/auth'

const store = useStore()
const settings = computed(() => {
  return store.state.app.settings
})
onBeforeMount(() => {
  //set tmp token when setting isNeedLogin false
  if (!settings.value.isNeedLogin) setToken(settings.value.tmpToken)
})
</script>
