<template>
  <div>
    page test TestTableQuery.vue
    <div>
      <el-button @click="vueRouter.routerPush('TestDetail')">toTestDetail.vue</el-button>
      <el-button @click="vueRouter.routerPush('TestAddEdit')">TestAddEdit.vue</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const vueRouter = useVueRouter()
</script>

<style scoped lang="scss"></style>
