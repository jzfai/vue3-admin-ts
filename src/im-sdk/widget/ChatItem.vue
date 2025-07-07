<template>
  <component
    :is="MessageComponent"
    :isSelf="data.to === data.target"
    :data="data"
  />
</template>

<script lang="ts" setup>
import type { Component } from 'vue';
import { MessageData } from '../types';
import ImageMessage from './messages/ImageMessage.vue';
import LocationMessage from './messages/LocationMessage.vue';
import TextMessage from './messages/TextMessage.vue';
import UnknownMessage from './messages/UnknownMessage.vue';
import VideoMessage from './messages/VideoMessage.vue';
import VoiceMessage from './messages/VoiceMessage.vue';
import CallMessage from './messages/CallMessage.vue';

const { data } = defineProps<{
  data: MessageData;
}>();
// 根据类型选择对应的组件
const componentMap: Record<
  string,
  Component<{ data: MessageData; isSelf: boolean }>
> = {
  txt: TextMessage,
  img: ImageMessage,
  video: VideoMessage,
  audio: VoiceMessage,
  location: LocationMessage,
  call: CallMessage,
};
const MessageComponent = componentMap[data?.type] || UnknownMessage;
</script>

<style lang="scss" scoped></style>
