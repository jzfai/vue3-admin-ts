<template>
  <div>loaction</div>
</template>

<script lang="ts" setup>
import { MessageData } from '@/im-sdk/types';

const { data, isSelf } = defineProps<{
  data: MessageData;
  isSelf: boolean;
}>();
</script>

<style lang="scss" scoped></style>
