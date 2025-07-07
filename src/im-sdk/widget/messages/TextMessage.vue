<template>
  <div
    class="textMessage"
    :style="{ flexDirection: isSelf ? 'row-reverse' : 'row' }"
  >
    <CacheImg :src="isSelf ? self.mine?.avatar : user?.avatar" class="avatar" @click="onViewUser(isSelf ? self.mine! : user!)"/> 
    <div class="msg_box" :style="{ alignItems: isSelf ? 'end' : 'start' }">
      <div class="content_box">
        <SendStatus :status="data.state" v-if="isSelf" />
        <div
          class="content"
          :style="
            isSelf
              ? {
                  backgroundColor: '#F0F0F0',
                  borderRadius: '.12rem .04rem .12rem .12rem',
                }
              : {
                  backgroundColor: '#FFF',
                  borderRadius: '.04rem .12rem .12rem .12rem',
                }
          "
        >
          {{ (data as TxtContent).msg }}
        </div>
      </div>
      <TimeCost :message="data" :self_message="isSelf"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CacheImg from '@/im-sdk/components/CacheImg.vue';
import SendStatus from '@/im-sdk/widget/SendStatus.vue';
import TimeCost from '@/im-sdk/widget/TimeCost.vue';
import { ImUserData, MessageData, TxtContent } from '@/im-sdk/types';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import { useRoute } from 'vue-router';
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';
import config from '@/im-sdk/config';
const { data, isSelf } = defineProps<{
  data: MessageData;
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

</script>

<style lang="scss" scoped>
.textMessage {
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
      max-width: 2.32rem;
      word-break: break-all;
      .content {
        padding: 0.08rem 0.12rem;
        border-radius: 0.12rem 0.04rem 0.12rem 0.12rem;
      }
    }
  }
}
</style>
