<template>
  <div
    class="voiceMessage"
    :style="{ flexDirection: isSelf ? 'row-reverse' : 'row' }"
  >
    <CacheImg :src="isSelf ? self.mine?.avatar : user?.avatar" class="avatar" @click="onViewUser(isSelf ? self.mine! : user!)"/>
    <div class="msg_box" :style="{ alignItems: isSelf ? 'end' : 'start' }">
      <div class="content_box">
        <SendStatus :status="data.state" v-if="isSelf" />
        <div
          class="content"
          :style="{ backgroundColor: isSelf ? '#F0F0F0' : '#FFF' }"
          @click="startplayAudio(data)"
        >
          <span> {{ (data as AudioContent).duration }}s </span>
          <img :src="audioPlayStatus.isPlaying && audioPlayStatus.playMsgId === data.id ? PauseImg : PlayImg" />
        </div>
      </div>
      <TimeCost :message="data" :self_message="isSelf" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import TimeCost from '@/im-sdk/widget/TimeCost.vue';
import SendStatus from '@/im-sdk/widget/SendStatus.vue';
import { AudioContent, ImUserData, MessageCommon } from '@/im-sdk/types';
import PlayImg from '@/im-sdk/assets/playVoice.svg';
import CacheImg from '@/im-sdk/components/CacheImg.vue';
import PauseImg from '@/im-sdk/assets/pauseVoice.svg';
import { onBeforeUnmount } from 'vue';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import { useRoute } from 'vue-router';
import { useAudioPlayer } from './Voice/ViocePlayController';
import config from '@/im-sdk/config';
type AudioMessage = MessageCommon & AudioContent;
const { data: data, isSelf } = defineProps<{
  data: AudioMessage;
  isSelf: boolean;
}>();
const route = useRoute();
// 对方信息
const controller = ImDataCenter.getConversation(String(route.query.id), true);
const user = controller!.conversation.user;

// 个人信息
const self = ImDataCenter.data;

// 跳转用户详情
const onViewUser = (user: ImUserData) => {
    config.onViewUser?.(user);
};

const { audioPlayStatus, playAudio, stopAudio } = useAudioPlayer()

const startplayAudio = (msgBody: AudioMessage) => {
  playAudio(msgBody.id, msgBody.url!)
}
onBeforeUnmount(() => {
  stopAudio();
});
</script>

<style lang="scss" scoped>
.voiceMessage {
  display: flex;
  align-items: start;
  gap: 0.12rem;
  .avatar {
    width: 0.48rem;
    height: 0.48rem;
  }
  .msg_box {
    display: flex;
    flex-direction: column;
    .content_box {
      display: flex;
      align-items: end;
      gap: 0.08rem;
      .content {
        padding: 0.08rem 0.12rem;
        border-radius: 0.12rem 0.04rem 0.12rem 0.12rem;
        display: flex;
        align-items: center;
        gap: 0.1rem;
        font-weight: 400;
        font-size: 0.12rem;
        color: #b1b1b1;
      }
    }
  }
}
</style>
