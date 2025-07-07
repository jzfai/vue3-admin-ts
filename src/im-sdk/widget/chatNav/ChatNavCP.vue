<template>
  <div class="last_style">
    <img :src="BackImg" class="left" @click="$router.go(-1)" />
    <div class="inform_box">
      <div class="feeling">
        <img :src="dataCenter.user.value?.avatar" class="role" />
      </div>
      <img :src="leftLove" />
      <div class="progress_container">
        <img :src="hollowImg" class="hollow" />
        <img
          :src="fullImg"
          class="full"
          :style="{ '--fill-percent': fullLinear + '%' }"
        />
        <div class="progress">{{ fullLinear + '%' }}</div>
      </div>
      <img :src="rightLove" />
      <div class="feeling">
        <img :src="dataCenter.user.value?.avatar" class="role" />
      </div>
    </div>
    <div class="right">
      <!-- 更多操作弹层 -->
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import BackImg from '@/im-sdk/assets/backImg.svg';
import { $t } from '@/locales';
import { PopoverAction } from 'vant';
import hollowImg from '@/im-sdk/assets/hollow.svg';
import fullImg from '@/im-sdk/assets/full.svg';
import leftLove from '@/im-sdk/assets/leftLove.svg';
import rightLove from '@/im-sdk/assets/rightLove.svg';
import moreUrl from '@/im-sdk/assets/More.svg';
import remarkImg from '@/im-sdk/assets/remark.svg';
import reportImg from '@/im-sdk/assets/report.svg';
import blockImg from '@/im-sdk/assets/blockImg.svg';
import { ref } from 'vue';
import dataCenter from '@/dataCenter';

// 模拟数据 参数值
const fullLinear = 70;

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
    justify-content: center;
    .progress_container {
      position: relative;
      width: 0.34rem;
      height: 0.34rem;
      .hollow,
      .full {
        position: absolute;
        width: 0.34rem; /* 图片实际尺寸 */
        height: 0.34rem;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(1.3); /* 放大1.3倍（≈0.44rem） */
        transform-origin: center; /* 从中心缩放 */
      }

      .full {
        clip-path: inset(calc(100% - var(--fill-percent, 0%)) 0 0 0);
      }

      .progress {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.1rem;
        color: #fff;
      }
    }
    .feeling {
      width: 0.44rem;
      height: 0.44rem;
      background-color: #fff0f7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      .role {
        width: 0.34rem;
        height: 0.34rem;
        border-radius: 50%;
        background: linear-gradient(
          90deg,
          rgba(237, 155, 194, 1),
          rgba(255, 106, 177, 1)
        );
        padding: 2px; /* 模拟边框厚度 */
        box-sizing: border-box;
      }
    }
  }
  .right {
    width: 0.2rem;
    height: 0.2rem;
  }
}
</style>
