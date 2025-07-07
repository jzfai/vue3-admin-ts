<template>
  <div>
    <img :src="payMenuUrl" alt="" />
  </div>
</template>

<script lang="ts" setup>
import payMenuUrl from '@/im-sdk/assets/payMenu.svg';
const props = defineProps<{ id: string }>();
</script>

<style lang="scss" scoped></style>
