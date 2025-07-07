<template>
  <div
    class="imageMessage"
    :style="{ flexDirection: isSelf ? 'row-reverse' : 'row' }"
  >
    <CacheImg :src="isSelf ? self.mine?.avatar : user?.avatar" class="avatar" @click="onViewUser(isSelf ? self.mine! : user!)"/>
    <div class="msg_box" :style="{ alignItems: isSelf ? 'end' : 'start' }">
      <div class="content_box">
        <SendStatus :status="data.state" v-if="isSelf" />
        <div class="content">
          <img
            :src="data?.url"
            :style="{
              height: imgHeight(data.width, data.height) + 'px',
            }"
            class="imageContent"
            @error="(e) => { const target = e.target as HTMLImageElement; if (target) target.src = blockImg }"
          />
        </div>
      </div>
      <TimeCost :message="data" :self_message="isSelf" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import blockImg from '@/im-sdk/assets/blockImg.svg';
import CacheImg from '@/im-sdk/components/CacheImg.vue';
import config from '@/im-sdk/config';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import { ImgContent, ImUserData, MessageCommon } from '@/im-sdk/types';
import SendStatus from '@/im-sdk/widget/SendStatus.vue';
import TimeCost from '@/im-sdk/widget/TimeCost.vue';
import { useRoute } from 'vue-router';
type ImgMessage = MessageCommon & ImgContent;
const { data, isSelf } = defineProps<{
  data: ImgMessage;
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
const imgHeight = (width: number, height: number) => {
  return width < 148 ? height : height * (148 / width);
};
</script>

<style lang="scss" scoped>
.imageMessage {
  display: flex;
  align-items: start;
  gap: 0.12rem;
  .avatar {
    width: 0.48rem;
    height: 0.48rem;
    border-radius: 50%;
  }
  .msg_box {
    display: flex;
    flex-direction: column;
    .content_box {
      display: flex;
      align-items: end;
      gap: 0.08rem;
      .content {
        border-radius: 0.12rem;
        overflow: hidden;
        .imageContent {
          max-width: 1.48rem;
        }
      }
    }
  }
}
</style>
