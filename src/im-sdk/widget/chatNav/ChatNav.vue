<template>
  <div class="last_style">
    <img :src="BackImg" class="left" @click="$router.go(-1)" />
    <div class="inform_box">
      <UserHead class="box_avatar" :img="conversation.user?.avatar" />
      <div class="nickname">{{ conversation.user?.name }}</div>
    </div>
    <!-- <div class="right">
      <van-popover
        v-model:show="showMore"
        :actions="actions"
        placement="bottom-end"
        style="--van-popover-action-width: 100%"
        @select="handleSelect"
      >
        <template #reference>
          <div class="more">
            <img :src="moreUrl" alt="" />
          </div>
        </template>
      </van-popover>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import BackImg from '@/im-sdk/assets/backImg.svg';
import { $t } from '@/locales';
import { PopoverAction } from 'vant';
import moreUrl from '@/im-sdk/assets/More.svg';
import remarkImg from '@/im-sdk/assets/remark.svg';
import reportImg from '@/im-sdk/assets/report.svg';
import blockImg from '@/im-sdk/assets/blockImg.svg';
import { ref } from 'vue';
import ImDataCenter from '@/im-sdk/ImDataCenter';
import { useRoute } from 'vue-router';
const route = useRoute();
// 对方信息
const controller = ImDataCenter.getConversation(String(route.query.id), true);
const conversation = controller!.conversation;

// 更多操作
const showMore = ref(false);

// 弹出层
const actions = ref([
  { type: 'block', text: $t('common.blackOut'), icon: blockImg },
  { type: 'remark', text: $t('common.setRemarks'), icon: remarkImg },
  { type: 'report', text: $t('common.AnonymousReport'), icon: reportImg },
]);
const handleSelect = (action: PopoverAction) => {
  console.log(action.type);
  switch (action.type) {
    case 'remark':
      // memoName.value = userData.value?.nickname || '';
      showRemark.value = true;
      break;
    case 'report':
      // 跳转匿名举报
      // report();
      break;
    case 'block':
      // 跳转拉黑
      // showBlack.value = true;
      break;
  }
};

// 设置备注
const showRemark = ref(false);
const memoName = ref('');
</script>

<style lang="scss" scoped>
.last_style {
  width: 100%;
  height: 0.68rem;
  padding: 0 0.16rem;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.04rem;
  .left {
    width: 0.24rem;
    height: 0.24rem;
  }
  .inform_box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.08rem;
    .box_avatar {
      width: 0.34rem;
      height: 0.34rem;
    }
    .nickname {
      font-weight: 600;
      font-size: 0.16rem;
      color: #000000;
    }
  }
  .right {
    width: 0.2rem;
    height: 0.2rem;
  }
}
</style>
