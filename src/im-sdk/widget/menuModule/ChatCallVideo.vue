<template>
  <div>
    <img :src="callVideoUrl" @click="callVideo" />
  </div>
</template>

<script lang="ts" setup>
import callVideoUrl from '@/im-sdk/assets/videoMenu.svg';
import callDataCenter from '@/im-sdk/callDataCenter';
import callEvent from '@/third/huanxin/CallEvent';

const props = defineProps<{ id: string }>();

const callVideo = () => {
  callEvent.startVideoChat(props.id, 'video')
};
</script>

<style lang="scss" scoped></style>
