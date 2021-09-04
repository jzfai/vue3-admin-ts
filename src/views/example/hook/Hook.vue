<template>
  <div>ref1:{{ ref1 }},ref2:{{ ref2 }}</div>
  <el-button @click="hookExample">执行hook方法</el-button>
</template>

<script setup lang="ts">
import testHook from '@/hooks/testooks'
let { ref1, ref2, hooksFunc } = testHook()
const hookExample = () => {
  hooksFunc()
}
</script>

<style scoped lang="scss"></style>
