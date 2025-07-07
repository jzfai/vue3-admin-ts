<template>
  <div
    class="videoMessage"
    :style="{ flexDirection: isSelf ? 'row-reverse' : 'row' }"
  >
    <CacheImg :src="isSelf ? self.mine?.avatar : user?.avatar" class="avatar" @click="onViewUser(isSelf ? self.mine! : user!)"/>
    <div class="msg_box" :style="{ alignItems: isSelf ? 'end' : 'start' }">
      <div class="content_box">
        <SendStatus :status="data.state" v-if="isSelf" />
        <video
          :src="data.url"
          class="video"
          :style="{
            height: videoHeight(data.width, data.height) + 'px',
          }"
          controls
        />
      </div>
      <TimeCost :message="data" :self_message="isSelf" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import TimeCost from '@/im-sdk/widget/TimeCost.vue';
import SendStatus from '@/im-sdk/widget/SendStatus.vue';
import { ImUserData, MessageCommon, VideoContent } from '@/im-sdk/types';
import CacheImg from '@/im-sdk/components/CacheImg.vue';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import { useRoute } from 'vue-router';
import config from '@/im-sdk/config';
type VideoMessage = MessageCommon & VideoContent;
const { data, isSelf } = defineProps<{
  data: VideoMessage;
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

// 计算高度
const videoHeight = (width: number, height: number) => {
  return width < 148 ? height : height * (148 / width);
};
</script>

<style lang="scss" scoped>
.videoMessage {
  display: flex;
  align-items: start;
  gap: 0.12rem;
  .avatar {
    width: 0.48rem;
    height: 0.48rem;
  }
  .video {
    max-width: 1.48rem;
    border-radius: 0.12rem;
  }
  .msg_box {
    display: flex;
    flex-direction: column;
    .content_box {
      display: flex;
      align-items: end;
      gap: 0.08rem;
      border-radius: .12rem;
      overflow: hidden;
      .video{
        border-radius: .12rem;
      overflow: hidden;
      }
    }
  }
}
</style>
