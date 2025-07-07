<template>
  <div>
    <van-list>
      <van-cell
        v-for="item in dataList"
        :key="item.id"
        @click="config.onChatWith?.(item.user?.imId)"
      >
        <component :is="config.conversationRender" :data="item" />
      </van-cell>
      <!-- 暂无数据 -->
      <div class="default" v-if="dataList?.length == 0">
        <img :src="noDataImg" alt="" />
        <span>{{ '暂无数据' }}</span>
      </div>
    </van-list>
  </div>
</template>

<script lang="ts" setup>
import noDataImg from '@/im-sdk/assets/noData.svg';
import { onMounted } from 'vue';
import config from '../config';
import ImDataCenter from '../ImDataCenter';

const dataList = ImDataCenter.conversations;

onMounted(config.onLoadConversationView);
</script>

<style lang="scss" scoped>
.message-list {
  height: 100%;
  display: flex;
  flex-direction: column;

  .message-list-content {
    flex: 1;
    background-color: #fff;
    padding-bottom: 0.64rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    :deep(.van-pull-refresh) {
      flex: 1;
      overflow-y: auto;
    }

    :deep(.van-cell) {
      padding: 0.1rem 0.2rem;

      &::after {
        left: 0.82rem;
      }
    }
  }
}

:deep(.van-cell:after) {
  border: none;
}

/* 占位图 */
.default {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
