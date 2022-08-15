<template>
  <div class="mt2">DeepChildrenSd.vue third router render</div>
  <el-input v-model="testInput" placeholder="input test keepAlive(DeepChildren)" class="w300" />
</template>

<script setup lang="ts">
defineOptions({
  name: 'DeepChildrenSd'
})

let testInput = ref('')
</script>

<style scoped lang="scss"></style>
