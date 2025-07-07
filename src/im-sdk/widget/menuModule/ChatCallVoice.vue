<template>
  <div>
    <img :src="callVoiceUrl" @click="callVoice" />
  </div>
</template>

<script lang="ts" setup>
import callVoiceUrl from '@/im-sdk/assets/callMenu.svg';
import callDataCenter from '@/im-sdk/callDataCenter';
import callEvent from '@/third/huanxin/CallEvent';

const props = defineProps<{ id: string }>();
const callVoice = () => {
  callEvent.startVideoChat(props.id, 'audio')
};
</script>

<style lang="scss" scoped></style>
